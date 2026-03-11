> Atue como um Arquiteto de Software Senior e Especialista em Dados Abertos.
> Quero especificar um PWA (Next.js 15, TypeScript, Tailwind) voltado para transparência eleitoral no Brasil em 2026. O objetivo é ajudar o eleitor a fiscalizar Deputados, Senadores e candidatos, cruzando dados de desempenho parlamentar com transparência financeira.
> Por favor, estruture a especificação técnica cobrindo os seguintes pontos:
>  * Consumo de APIs Públicas (Endpoint Strategy):
>    * Liste os principais endpoints da API de Dados Abertos da Câmara (v1/deputados) e do Senado.
>    * Como integrar os dados do TSE (DivulgaCandContas) para obter patrimônio e doadores de 2026.
>    * Sugira como consumir a API da Operação Serenata de Amor (Jarbas) para identificar gastos suspeitos.
>  * Arquitetura de Dados (Foco em DBA):
>    * Como as APIs de governo são lentas/instáveis, proponha uma estratégia de Caching/Stale-while-revalidate usando Redis ou Supabase.
>    * Sugira um esquema de banco de dados simplificado para armazenar o "perfil consolidado" do político.
>  * Features de Transparência (MVP):
>    * Ranking de Assiduidade: Lógica para calcular presença vs. faltas justificadas.
>    * Termômetro de Gastos: Comparação dos gastos da cota parlamentar do político contra a média da casa.
>    * Evolução Patrimonial: Visualização da variação de bens declarados ao TSE ao longo dos anos.
>  * Integração com LLM (Vibe Coding):
>    * Sugira como usar um Agente de IA para ler as ementas de projetos de lei e categorizar se o político é "Pró-Educação", "Focado em Economia", etc.
> Formato de saída: Use Markdown, com tabelas para as APIs e uma seção dedicada ao fluxo de dados entre o governo e o frontend. O nome do arquivo deve ser especificacao_lulaEleitoral.md
Autenticação google e Apple com clerk.
Sugira as telas e um protótipo simples de cada uma.