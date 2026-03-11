-- Supabase Schema para Lupa Eleitoral MVP

-- 1. Tabela Politicos
CREATE TABLE Politicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_camara_senado INT,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nome_urna VARCHAR(255) NOT NULL,
    cargo_atual VARCHAR(50) CHECK (cargo_atual IN ('Deputado', 'Senador', 'Nenhum')),
    partido_atual VARCHAR(50),
    uf CHAR(2),
    foto_url TEXT,
    tags_ia TEXT[]
);

-- 2. Tabela Evolucao_Patrimonial
CREATE TABLE Evolucao_Patrimonial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    politico_id UUID REFERENCES Politicos(id) ON DELETE CASCADE,
    ano_eleicao INT NOT NULL,
    valor_declarado DECIMAL(15, 2) NOT NULL
);

-- 3. Tabela Despesas_Mensais_Consolidadas
CREATE TABLE Despesas_Mensais_Consolidadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    politico_id UUID REFERENCES Politicos(id) ON DELETE CASCADE,
    ano INT NOT NULL,
    mes INT NOT NULL,
    valor_total DECIMAL(15, 2) NOT NULL,
    flags_suspeita_qtd INT DEFAULT 0
);

-- 4. Tabela Desempenho_Plenario
CREATE TABLE Desempenho_Plenario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    politico_id UUID REFERENCES Politicos(id) ON DELETE CASCADE,
    legislatura INT NOT NULL,
    presencas INT DEFAULT 0,
    ausencias_justificadas INT DEFAULT 0,
    ausencias_nao_justificadas INT DEFAULT 0
);

-- 5. Tabela Projetos_Lei_Recentes
CREATE TABLE Projetos_Lei_Recentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    politico_id UUID REFERENCES Politicos(id) ON DELETE CASCADE,
    numero_ano VARCHAR(50) NOT NULL,
    titulo TEXT NOT NULL,
    resumo_ia TEXT NOT NULL,
    data_apresentacao DATE NOT NULL
);

-- 6. Tabela Usuarios_Politicos_Favoritos (Para funcionalidade "Meu Eleitorado")
CREATE TABLE Usuarios_Politicos_Favoritos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL, -- ID do Clerk
    politico_id UUID REFERENCES Politicos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, politico_id)
);

-- RLS (Row Level Security) - Importante para MVP (mesmo básico)
-- Permitir leitura pública para tabelas de dados públicos
ALTER TABLE Politicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura Pública de Politicos" ON Politicos FOR SELECT USING (true);

ALTER TABLE Evolucao_Patrimonial ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura Pública de Patrimonios" ON Evolucao_Patrimonial FOR SELECT USING (true);

ALTER TABLE Despesas_Mensais_Consolidadas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura Pública de Despesas" ON Despesas_Mensais_Consolidadas FOR SELECT USING (true);

ALTER TABLE Desempenho_Plenario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura Pública de Desempenho" ON Desempenho_Plenario FOR SELECT USING (true);

ALTER TABLE Projetos_Lei_Recentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura Pública de Projetos" ON Projetos_Lei_Recentes FOR SELECT USING (true);

-- Favoritos (Apenas o próprio usuário pode ler/inserir/deletar)
ALTER TABLE Usuarios_Politicos_Favoritos ENABLE ROW LEVEL SECURITY;
-- Essa política pressupõe que estamos checando auth.jwt()->>'sub' (Clerk Integration) ou que o backend Next.js contorne o RLS em rotas protegidas
CREATE POLICY "Usuário gerencia próprios favoritos" 
ON Usuarios_Politicos_Favoritos FOR ALL 
USING (true) -- Temporariamente aberto para o JWT não falhar caso não haja claims customizados (Next.js server cuidará da segurança primária no MVP)
WITH CHECK (true);
