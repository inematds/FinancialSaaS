# Financial Advisor SaaS

![Financial Advisor SaaS Banner](docs/banner.png)

Plataforma SaaS de consultoria financeira pessoal com inteligência artificial integrada.

## Sobre o Projeto

O **Financial Advisor SaaS** é uma aplicação web moderna que ajuda usuários a gerenciar suas finanças pessoais e investimentos. A plataforma oferece:

- **Dashboard Interativo** - Visão geral do portfólio, performance e metas financeiras
- **Gestão de Portfólio** - Acompanhamento de ações e investimentos em tempo real
- **Consultor de IA** - Chat com inteligência artificial (Google Gemini) para dúvidas financeiras
- **Notícias do Mercado** - Feed de notícias financeiras via Finnhub API
- **Inteligência de Empresas** - Análise detalhada de empresas e ações
- **Metas Financeiras** - Definição e acompanhamento de objetivos financeiros
- **Analytics** - Gráficos e análises de performance do portfólio

## Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Router** - Navegação SPA
- **Chart.js** - Gráficos interativos
- **Lucide React** - Ícones

### Backend & Serviços
- **Supabase** - Autenticação e banco de dados PostgreSQL
- **Google Gemini AI** - Consultor financeiro com IA
- **Finnhub API** - Dados de mercado e cotações em tempo real

## Estrutura do Projeto

```
src/
├── components/
│   ├── ai/                 # Chat com IA
│   ├── auth/               # Autenticação
│   ├── dashboard/          # Cards do dashboard
│   ├── layout/             # Sidebar e navegação
│   ├── portfolio/          # Gestão de portfólio
│   └── ui/                 # Componentes reutilizáveis
├── contexts/               # Context API (Auth)
├── layouts/                # Layouts de página
├── pages/                  # Páginas da aplicação
├── services/               # Integrações com APIs
└── lib/                    # Configurações (Supabase)
```

## Instalação

### Pré-requisitos
- Node.js 18+
- Conta no Supabase
- API Key do Finnhub
- API Key do Google Gemini

### Setup

1. Clone o repositório:
```bash
git clone https://github.com/inematds/FinancialSaaS.git
cd FinancialSaaS
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
VITE_FINNHUB_API_KEY=sua_chave_finnhub
VITE_GEMINI_API_KEY=sua_chave_gemini
```

4. Configure o banco de dados no Supabase:
   - Execute o script `supabase/schema.sql`
   - Execute o script `supabase/seed_stocks.sql` para dados iniciais

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa o ESLint |

## Funcionalidades Principais

### Dashboard
Visão consolidada com cards de:
- Valor total do portfólio
- Performance diária/mensal
- Alocação de ativos
- Metas financeiras
- Últimas transações
- Pulso do mercado

### Portfólio
- Adicionar/remover ações
- Visualizar holdings
- Cotações em tempo real
- Histórico de transações

### Consultor IA
Chat integrado com Google Gemini para:
- Tirar dúvidas sobre investimentos
- Análise de portfólio
- Recomendações personalizadas
- Educação financeira

### Notícias
Feed de notícias financeiras filtradas por:
- Mercado geral
- Ações específicas do portfólio

## Licença

Este projeto é privado e de uso restrito.

---

Desenvolvido com React + TypeScript + Vite
