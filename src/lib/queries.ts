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
      *,
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
  return data.map((p: any) => {
    // Somar todas as despesas
    const despesas_mes = (p.despesas || []).reduce((acc: number, d: any) => acc + (d.valor_total || 0), 0);
    
    // Somar presenças e ausências
    const desempenho = p.desempenho || [];
    const presencas = desempenho.reduce((acc: number, d: any) => acc + (d.presencas || 0), 0);
    const ausencias = desempenho.reduce((acc: number, d: any) => acc + (d.ausencias_nao_justificadas || 0), 0);
    
    const total = presencas + ausencias;
    const presenca_pct = total > 0 ? Math.round((presencas / total) * 100) : 0;

    return {
      ...p,
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

  // Calcular campos agregados
  const despesas_mes = (data.despesas || []).reduce((acc: number, d: any) => acc + (d.valor_total || 0), 0);
  
  const desempenho = data.desempenho || [];
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
 */
export async function getUserFavorites(clerkToken: string | null, userId: string): Promise<Politico[]> {
  const supabase = (clerkToken && clerkToken !== "") ? createClerkSupabaseClient(clerkToken) : supabasePublic;
  
  const { data, error } = await supabase
    .from('Usuarios_Politicos_Favoritos')
    .select(`
      politico_id,
      politicos (*)
    `)
    .eq('user_id', userId);

  if (error) {
    if (error.code === '42P01') {
       const { data: dataAlt, error: errorAlt } = await supabase
        .from('usuarios_politicos_favoritos')
        .select(`
          politico_id,
          politicos (*)
        `)
        .eq('user_id', userId);
        if (!errorAlt && dataAlt) return (dataAlt as any[]).map(f => f.politicos);
    }
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }

  return (data as any[] || []).map(f => f.politicos);
}

/**
 * Busca apenas os IDs dos favoritos de um usuário específico
 */
export async function getUserFavoriteIds(clerkToken: string | null, userId: string): Promise<string[]> {
  const supabase = (clerkToken && clerkToken !== "") ? createClerkSupabaseClient(clerkToken) : supabasePublic;
  
  const { data, error } = await supabase
    .from('Usuarios_Politicos_Favoritos')
    .select('politico_id')
    .eq('user_id', userId);

  if (error) {
    if (error.code === '42P01') {
       const { data: dataAlt, error: errorAlt } = await supabase
        .from('usuarios_politicos_favoritos')
        .select('politico_id')
        .eq('user_id', userId);
        if (!errorAlt && dataAlt) return (dataAlt as any[]).map(f => f.politico_id);
    }
    console.error("Erro ao buscar IDs de favoritos:", error);
    return [];
  }

  return (data as any[] || []).map(f => f.politico_id);
}

/**
 * Alterna o estado de favorito de um político para o usuário
 */
export async function toggleFavorite(clerkToken: string | null, userId: string, politicoId: string) {
  const supabase = (clerkToken && clerkToken !== "") ? createClerkSupabaseClient(clerkToken) : supabasePublic;
  
  const tableNames = ['Usuarios_Politicos_Favoritos', 'usuarios_politicos_favoritos'];

  async function tryFetch(name: string) {
    return await supabase
      .from(name)
      .select('id')
      .eq('user_id', userId)
      .eq('politico_id', politicoId)
      .maybeSingle();
  }

  let data = null;
  let fetchError = null;
  let resolvedTableName = tableNames[0];

  const firstAttempt = await tryFetch(tableNames[0]);
  if (firstAttempt.error && firstAttempt.error.code === '42P01') {
    const secondAttempt = await tryFetch(tableNames[1]);
    if (!secondAttempt.error) {
      data = secondAttempt.data;
      resolvedTableName = tableNames[1];
    } else {
      fetchError = secondAttempt.error;
    }
  } else {
    data = firstAttempt.data;
    fetchError = firstAttempt.error;
    resolvedTableName = tableNames[0];
  }

  if (fetchError) {
    console.error("Erro ao verificar favorito:", fetchError);
    return { error: fetchError, success: false };
  }

  if (data) {
    // Se existe, remover
    const { error: deleteError } = await supabase
      .from(resolvedTableName)
      .delete()
      .eq('id', data.id);
    
    return { success: !deleteError, action: 'removed', error: deleteError };
  } else {
    // Se não existe, adicionar
    const { error: insertError } = await supabase
      .from(resolvedTableName)
      .insert({
        user_id: userId,
        politico_id: politicoId
      });
    
    if (insertError) console.error(`Erro ao inserir favorito na tabela ${resolvedTableName}:`, insertError);
    
    return { success: !insertError, action: 'added', error: insertError };
  }
}

/**
 * Busca o feed de projetos dos favoritos
 */
export async function getFavoritesFeed(clerkToken: string, userId: string) {
  const favoritos = await getUserFavorites(clerkToken, userId);
  const ids = favoritos.map((f: any) => f.id);

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

  return data.map((p: any) => ({
    id: p.id,
    politico: {
      nome: p.politicos.nome_urna,
      foto: p.politicos.foto_url
    },
    tipo: 'Projeto de Lei',
    titulo: p.titulo,
    tempo: new Date(p.data_apresentacao).toLocaleDateString('pt-BR'),
    likes: 0, // Mockado por enquanto
    comments: 0 // Mockado por enquanto
  }));
}
