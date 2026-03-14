import { supabasePublic, createClerkSupabaseClient } from "./supabase";

/**
 * Tipagem básica do Político vindo do Banco
 */
export interface Politico {
  id: string;
  id_camara_senado: number | null;
  cpf: string;
  nome_urna: string;
  cargo_atual: 'Deputado' | 'Senador' | 'Nenhum';
  partido_atual: string | null;
  uf: string | null;
  foto_url: string | null;
  tags_ia: string[] | null;
  // Campos calculados/agregados que adicionaremos via join ou query
  presenca_pct?: number;
  despesas_mes?: number;
}

/**
 * Busca todos os políticos com filtro opcional de cargo
 */
export async function getPoliticos(cargo?: string) {
  let query = supabasePublic
    .from('politicos')
    .select(`
      id, id_camara_senado, cpf, nome_urna, cargo_atual, partido_atual, uf, foto_url, tags_ia,
      despesas:despesas_mensais_consolidadas(valor_total),
      desempenho:desempenho_plenario(presencas, ausencias_nao_justificadas)
    `);

  if (cargo) {
    query = query.ilike('cargo_atual', cargo);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar políticos:", error);
    return [];
  }

  // Mapear para incluir dados agregados
  return data.map((p: unknown) => {
    const poly = p as Politico & { despesas: { valor_total: number }[], desempenho: { presencas: number, ausencias_nao_justificadas: number }[] };
    // Somar todas as despesas
    const despesas_mes = (poly.despesas || []).reduce((acc: number, d) => acc + (d.valor_total || 0), 0);
    
    // Somar presenças e ausências
    const desempenho = poly.desempenho || [];
    const presencas = desempenho.reduce((acc: number, d) => acc + (d.presencas || 0), 0);
    const ausencias = desempenho.reduce((acc: number, d) => acc + (d.ausencias_nao_justificadas || 0), 0);
    
    const total = presencas + ausencias;
    const presenca_pct = total > 0 ? Math.round((presencas / total) * 100) : 0;

    return {
      ...poly,
      despesas_mes,
      presenca_pct
    };
  });
}

/**
 * Busca um político específico por ID com todos os detalhes
 */
export async function getPoliticoById(id: string) {
  const { data, error } = await supabasePublic
    .from('politicos')
    .select(`
      *,
      evolucao:evolucao_patrimonial(*),
      despesas:despesas_mensais_consolidadas(*),
      desempenho:desempenho_plenario(*),
      projetos:projetos_lei_recentes(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Erro ao buscar político por ID:", error);
    return null;
  }

  const polyData = data as any;
  // Calcular campos agregados
  const despesas_mes = (polyData.despesas || []).reduce((acc: number, d: any) => acc + (d.valor_total || 0), 0);
  
  const desempenho = polyData.desempenho || [];
  const presencas = desempenho.reduce((acc: number, d: any) => acc + (d.presencas || 0), 0);
  const ausencias = desempenho.reduce((acc: number, d: any) => acc + (d.ausencias_nao_justificadas || 0), 0);
  
  const total = presencas + ausencias;
  const presenca_pct = total > 0 ? Math.round((presencas / total) * 100) : 0;

  return {
    ...data,
    presenca_pct,
    despesas_mes
  };
}

/**
 * Busca os destaques (Mais assíduos e Maiores Gastadores)
 */
export async function getHighlights() {
  const politicos = await getPoliticos();
  
  const assiduos = [...politicos]
    .sort((a, b) => (b.presenca_pct || 0) - (a.presenca_pct || 0))
    .slice(0, 2);

  const gastadores = [...politicos]
    .sort((a, b) => (b.despesas_mes || 0) - (a.despesas_mes || 0))
    .slice(0, 2);

  return { assiduos, gastadores };
}

/**
 * Busca os favoritos de um usuário específico
 * 
 * NOTA MVP: Usamos supabasePublic pois a política RLS está temporariamente aberta (USING(true)).
 * A integração Clerk→Supabase JWT requer configuração adicional no dashboard do Supabase.
 */
export async function getUserFavorites(_clerkToken: string | null, userId: string): Promise<Politico[]> {
  const { data, error } = await supabasePublic
    .from('usuarios_politicos_favoritos')
    .select(`
      politico_id,
      politicos (
        *,
        despesas:despesas_mensais_consolidadas(valor_total),
        desempenho:desempenho_plenario(presencas, ausencias_nao_justificadas)
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }

  return (data as unknown as any[] || []).map(f => {
    const p = f.politicos;
    if (!p) return null;

    // Somar todas as despesas
    const despesas_mes = (p.despesas || []).reduce((acc: number, d: any) => acc + (d.valor_total || 0), 0);
    
    // Somar presenças e ausências
    const desempenho = p.desempenho || [];
    const presencas = (desempenho as unknown as any[]).reduce((acc: number, d) => acc + (d.valor_total || 0), 0);
    const ausencias = (desempenho as unknown as any[]).reduce((acc: number, d) => acc + (d.ausencias_nao_justificadas || 0), 0);
    
    const total = presencas + ausencias;
    const presenca_pct = total > 0 ? Math.round((presencas / total) * 100) : 0;

    return {
      ...p,
      despesas_mes,
      presenca_pct
    };
  }).filter(Boolean);
}

/**
 * Busca apenas os IDs dos favoritos de um usuário específico
 */
export async function getUserFavoriteIds(_clerkToken: string | null, userId: string): Promise<string[]> {
  const { data, error } = await supabasePublic
    .from('usuarios_politicos_favoritos')
    .select('politico_id')
    .eq('user_id', userId);

  if (error) {
    console.error("Erro ao buscar IDs de favoritos:", error);
    return [];
  }

  return (data as unknown as { politico_id: string }[] || []).map(f => f.politico_id);
}

/**
 * Alterna o estado de favorito de um político para o usuário
 * 
 * NOTA MVP: Usamos supabasePublic pois a política RLS está temporariamente aberta (USING(true)).
 */
export async function toggleFavorite(_clerkToken: string | null, userId: string, politicoId: string) {
  // Verificar se já é favorito
  const { data, error: fetchError } = await supabasePublic
    .from('usuarios_politicos_favoritos')
    .select('id')
    .eq('user_id', userId)
    .eq('politico_id', politicoId)
    .maybeSingle();

  if (fetchError) {
    console.error("[toggleFavorite] Erro ao verificar favorito:", fetchError);
    return { error: fetchError, success: false };
  }

  if (data) {
    // Se existe, remover
    const { error: deleteError } = await supabasePublic
      .from('usuarios_politicos_favoritos')
      .delete()
      .eq('id', data.id);
    
    if (deleteError) console.error("[toggleFavorite] Erro ao remover:", deleteError);
    return { success: !deleteError, action: 'removed', error: deleteError };
  } else {
    // Se não existe, adicionar
    const { error: insertError } = await supabasePublic
      .from('usuarios_politicos_favoritos')
      .insert({
        user_id: userId,
        politico_id: politicoId
      });
    
    if (insertError) console.error("[toggleFavorite] Erro ao inserir:", insertError);
    return { success: !insertError, action: 'added', error: insertError };
  }
}

/**
 * Busca o feed de projetos dos favoritos
 */
export async function getFavoritesFeed(_clerkToken: string | null, userId: string) {
  const favoritos = await getUserFavorites(null, userId);
  const ids = favoritos.map((f) => f.id);

  if (ids.length === 0) return [];

  const { data, error } = await supabasePublic
    .from('projetos_lei_recentes')
    .select(`
      *,
      politicos (nome_urna, foto_url)
    `)
    .in('politico_id', ids)
    .order('data_apresentacao', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Erro ao buscar feed de favoritos:", error);
    return [];
  }

  return (data as unknown as any[] || []).map((p) => ({
    id: p.id,
    politico: {
      nome: p.politicos.nome_urna,
      foto: p.politicos.foto_url
    },
    tipo: 'Projeto de Lei',
    titulo: p.titulo,
    resumo_ia: p.resumo_ia,
    tempo: new Date(p.data_apresentacao).toLocaleDateString('pt-BR')
  }));
}

/**
 * Busca a contagem de notificações não lidas
 */
export async function getUnreadNotificationsCount(userId: string) {
  const { count, error } = await supabasePublic
    .from('alerta_parlamentar_favorito')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('lido', 'N');

  if (error) {
    console.error("Erro ao buscar contagem de notificações:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Busca a lista de notificações com detalhes do projeto e político
 */
export async function getNotifications(userId: string) {
  const { data, error } = await supabasePublic
    .from('alerta_parlamentar_favorito')
    .select(`
      id,
      lido,
      created_at,
      projetos:Projetos_Lei_Recentes (
        id,
        titulo,
        resumo_ia,
        politicos (
          nome_urna,
          foto_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar notificações:", error);
    return [];
  }

  return (data as any[]).map(n => ({
    id: n.id,
    lido: n.lido,
    data: n.created_at,
    projeto_id: n.projetos?.id,
    titulo: n.projetos?.titulo,
    resumo_ia: n.projetos?.resumo_ia,
    politico_nome: n.projetos?.politicos?.nome_urna,
    politico_foto: n.projetos?.politicos?.foto_url
  }));
}

/**
 * Marca uma notificação como lida
 */
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabasePublic
    .from('alerta_parlamentar_favorito')
    .update({ lido: 'S' })
    .eq('id', notificationId);

  if (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return false;
  }

  return true;
}

/**
 * Marca todas as notificações de um usuário como lidas
 */
export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabasePublic
    .from('alerta_parlamentar_favorito')
    .update({ lido: 'S' })
    .eq('user_id', userId)
    .eq('lido', 'N');

  if (error) {
    console.error("Erro ao marcar todas notificações como lidas:", error);
    return false;
  }

  return true;
}
