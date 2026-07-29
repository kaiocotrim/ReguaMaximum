<div align="center">
  <img src="./barber-cloud/public/LogoMComBorder3.png" alt="Logo da Régua Máxima" width="180" />

  # Régua Máxima

  **Plataforma completa para conectar clientes, barbeiros e barbearias.**

  Agendamentos online, gestão de equipe, serviços, caixa, avaliações,
  relatórios e presença digital em um único sistema.

  [Apresentação](#-sobre-o-projeto) ·
  [Funcionalidades](#-funcionalidades) ·
  [Instalação](#-executando-localmente) ·
  [Documentação](#-arquitetura) ·
  [Licença](#-licença)
</div>

---

## ✂️ Sobre o projeto

A **Régua Máxima** é uma plataforma de gestão e descoberta criada para o
mercado de barbearias. O sistema oferece uma experiência pública para clientes
encontrarem estabelecimentos e reservarem horários, além de um painel
administrativo para o proprietário controlar a operação do negócio.

O projeto organiza toda a jornada:

1. O cliente encontra uma barbearia.
2. Escolhe serviço, profissional, data e horário.
3. A reserva entra automaticamente na agenda do estabelecimento.
4. O profissional realiza e conclui o atendimento.
5. O pagamento alimenta o caixa e os relatórios.
6. O cliente pode avaliar o barbeiro e a barbearia.

## 🎯 Objetivos

- Facilitar o agendamento de serviços de barbearia.
- Reduzir o controle manual de agenda e atendimentos.
- Centralizar equipe, catálogo de serviços e movimentações financeiras.
- Ajudar barbearias a construírem presença e reputação digital.
- Oferecer dados para decisões por meio de indicadores e relatórios.

## 👥 Perfis atendidos

### Cliente

- Cadastro e autenticação.
- Busca e descoberta de barbearias.
- Visualização de perfil, serviços, equipe, fotos e avaliações.
- Agendamento online.
- Consulta e gerenciamento dos próprios horários.
- Favoritos.
- Avaliação pós-atendimento.
- Configuração de perfil e tema.

### Barbeiro

- Perfil profissional.
- Portfólio de trabalhos.
- Participação em uma equipe por convite.
- Agenda de atendimentos.
- Avaliações recebidas.

### Proprietário da barbearia

- Dashboard com visão geral do negócio.
- Gestão de agenda e atendimentos.
- Cadastro e edição de serviços.
- Convites e gestão de barbeiros.
- Controle de caixa.
- Relatórios.
- Gestão do perfil público e galeria.
- Pausa e liberação de novos agendamentos.
- Consulta do plano e da licença ativa.

### Administrador de licenças

- Geração de chaves.
- Definição de plano e duração.
- Acompanhamento de status.
- Revogação de licenças.
- Associação da licença ao cliente e à barbearia.

## 🚀 Funcionalidades

### Agendamentos

- Seleção de serviço, barbeiro, data e horário.
- Visualização em agenda e calendário.
- Pesquisa avançada.
- Status `EM_ANDAMENTO`, `CONCLUIDO` e `CANCELADO`.
- Registro de comparecimento ou falta.
- Observações no atendimento.
- Cancelamento sem perda do histórico.
- Notificações e lembretes por e-mail.
- Contato com o cliente pelo WhatsApp.

### Serviços

- Criação, edição e exclusão.
- Nome, descrição, preço, duração e imagem.
- Associação automática com a barbearia.
- Uso da duração no cálculo dos horários disponíveis.

### Equipe

- Busca de barbeiros cadastrados.
- Envio, aceite, recusa e cancelamento de convites.
- Controle do vínculo com a barbearia.
- Perfil e portfólio individual do profissional.

### Caixa

- Registro de entradas e saídas.
- Formas de pagamento: dinheiro, PIX, crédito, débito e outras.
- Pagamento vinculado ao atendimento concluído.
- Histórico por data.
- Identificação do responsável pelo registro.

### Avaliações

- Avaliação do barbeiro após atendimento.
- Avaliação da barbearia.
- Nota e comentário.
- Resumo e distribuição das notas no dashboard.
- Exibição da reputação no perfil público.

### Perfil da barbearia

- Nome, endereço, cidade e descrição.
- Telefones e Instagram.
- Horários de abertura e fechamento.
- Logo, capa e carrossel de fotos.
- Cor da marca.
- Localização por latitude e longitude.
- Controle da disponibilidade para novos agendamentos.

### Relatórios

- Indicadores de clientes, equipe e agendamentos.
- Análises operacionais.
- Exportação de dados de agendamentos para planilha.

### Planos e licenças

- Planos `BASIC`, `PRO` e `PREMIUM`.
- Chaves protegidas por hash.
- Ativação por usuário e barbearia.
- Controle de duração e vencimento.
- Estados `AVAILABLE`, `CLAIMED`, `ACTIVE` e `REVOKED`.
- Área administrativa protegida.

### Experiência

- Tema claro e escuro.
- Interface responsiva.
- Componentes acessíveis.
- Feedback visual e notificações.
- Animações com suporte a `prefers-reduced-motion`.
- Central de Ajuda em `/ajuda`.

## 🧰 Tecnologias

| Área | Tecnologias |
| --- | --- |
| Aplicação | Next.js 16, React 19 e TypeScript |
| Interface | Tailwind CSS 4, Radix UI, Base UI e Lucide |
| Autenticação | NextAuth, credenciais, Google, GitHub e Facebook |
| Banco de dados | PostgreSQL hospedado no Neon |
| ORM | Prisma 7 com adapter Neon |
| Arquivos | Supabase Storage |
| E-mail | Resend e React Email |
| Agenda | FullCalendar |
| Gráficos | Recharts |
| Planilhas | ExcelJS |
| Animações | Framer Motion, Motion e CSS |
| Segurança | bcrypt, autorização no servidor e rate limiting |

## 🏗️ Arquitetura

O projeto utiliza o **App Router** do Next.js e prioriza operações protegidas no
servidor.

```text
barber-cloud/
├── app/
│   ├── _actions/            # Server Actions e regras de mutação
│   ├── _components/         # Componentes de interface e domínio
│   ├── _emails/             # Templates de e-mail
│   ├── _hooks/              # Hooks reutilizáveis
│   ├── _lib/                # Banco, autenticação e serviços
│   ├── _providers/          # Providers globais
│   ├── admin/               # Administração de licenças
│   ├── api/                 # Route Handlers
│   ├── dashboard/           # Painel da barbearia
│   ├── barbershops/         # Listagem e perfil público
│   └── ...                  # Demais páginas da aplicação
├── prisma/
│   ├── migrations/          # Histórico de alterações do banco
│   ├── schema.prisma        # Modelagem principal
│   └── seed.ts              # Dados iniciais
├── public/                  # Imagens e arquivos públicos
├── prisma.config.ts         # Configuração do Prisma
└── next.config.ts           # Configuração do Next.js
```

### Principais entidades

- `User`: conta, autenticação e papel do usuário.
- `Client`: perfil do cliente.
- `Barber`: perfil profissional e vínculo com a barbearia.
- `Barbershop`: estabelecimento e dados públicos.
- `BarbeshopService`: catálogo de serviços.
- `Booking`: agendamento e seu ciclo de atendimento.
- `Payment`: pagamento associado a um agendamento.
- `CashMovement`: entradas e saídas do caixa.
- `Review` e `BarbershopReview`: avaliações.
- `BarbershopInvite`: convites para a equipe.
- `PlanLicense`: plano, ativação e validade da licença.

## ✅ Pré-requisitos

- Node.js compatível com o Next.js 16.
- npm.
- Banco PostgreSQL.
- Projeto no Supabase para armazenamento de imagens.
- Conta no Resend para envio de e-mails.
- Credenciais OAuth dos provedores que serão habilitados.

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz de `barber-cloud`. Nunca envie esse arquivo para
o repositório.

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-segredo-forte"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub OAuth
GITHUB_ID=""
GITHUB_SECRET=""

# Facebook OAuth
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
SUPABASE_URL=""
SUPABASE_SECRET_KEY=""
# Alternativa compatível:
SUPABASE_SERVICE_ROLE_KEY=""

# E-mails
RESEND_API_KEY=""

# Administração de licenças
LICENSE_ADMIN_EMAILS="administrador@exemplo.com"
# Somente para uso temporário fora de produção:
LICENSE_PUBLIC_GENERATOR="false"
```

> Gere o `NEXTAUTH_SECRET` com uma fonte criptograficamente segura e mantenha
> todas as chaves privadas somente no servidor.

## 💻 Executando localmente

### 1. Clone o repositório

```bash
git clone https://github.com/kaiocotrim/ReguaMaximum.git
cd ReguaMaximum/barber-cloud
```

### 2. Instale as dependências

```bash
npm install
```

O script `postinstall` gera automaticamente o Prisma Client.

### 3. Configure o ambiente

Crie o arquivo `.env` usando a seção de variáveis acima e informe credenciais
válidas para os serviços usados.

### 4. Prepare o banco

Em um banco novo:

```bash
npx prisma migrate deploy
npx prisma generate
```

Para popular dados de desenvolvimento, quando aplicável:

```bash
npx prisma db seed
```

> Antes de executar migrations em um banco existente, confira
> `npx prisma migrate status` e valide o histórico para evitar conflitos.

### 5. Inicie o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o Prisma Client e cria o build de produção |
| `npm run start` | Executa o build de produção |
| `npm run lint` | Analisa o código com ESLint |
| `npm run postinstall` | Gera o Prisma Client após a instalação |
| `npm run prepare` | Configura os hooks do Husky |

## 🗺️ Rotas principais

| Rota | Finalidade |
| --- | --- |
| `/` | Página inicial e descoberta |
| `/login` | Autenticação |
| `/barbershops` | Lista de barbearias |
| `/barbershops/[id]` | Perfil público da barbearia |
| `/appointments` | Agendamentos do cliente |
| `/favorites` | Barbearias favoritas |
| `/perfil` | Perfil do usuário |
| `/configuracoes` | Dados pessoais e aparência |
| `/ajuda` | Manual do sistema |
| `/minha-barbearia` | Criação e ativação da barbearia |
| `/dashboard` | Painel do proprietário |
| `/dashboard/agendamentos` | Gestão da agenda |
| `/dashboard/servicos` | Gestão de serviços |
| `/dashboard/barbeiros` | Gestão da equipe |
| `/dashboard/caixa` | Controle financeiro |
| `/dashboard/relatorios` | Indicadores e relatórios |
| `/dashboard/perfil` | Fotos e avaliações da barbearia |
| `/dashboard/configuracoes` | Dados públicos, agenda e licença |
| `/admin/licencas` | Administração protegida de licenças |

## 🔐 Segurança

- Senhas armazenadas com hash usando bcrypt.
- Sessões protegidas pelo NextAuth.
- Autenticação e autorização verificadas novamente em Server Actions.
- Consultas administrativas limitadas ao proprietário da barbearia.
- Chaves de licença armazenadas por hash.
- Rate limiting em fluxos sensíveis.
- Segredos mantidos em variáveis de ambiente.
- Campos sensíveis do usuário omitidos pelo Prisma Client.

## 🧪 Validação antes de publicar

```bash
npm run lint
npm run build
```

Também valide:

- migrations no banco de destino;
- login por credenciais e provedores OAuth;
- upload e exibição de imagens;
- envio de e-mails;
- criação e conclusão de agendamentos;
- pagamentos e caixa;
- ativação e vencimento de licenças;
- comportamento nos temas claro e escuro;
- navegação em telas móveis.

## 🚢 Publicação

1. Configure todas as variáveis no provedor de hospedagem.
2. Use um banco PostgreSQL com SSL.
3. Execute `npx prisma migrate deploy`.
4. Gere o build com `npm run build`.
5. Inicie com `npm run start`.
6. Atualize `NEXTAUTH_URL` para a URL pública.
7. Cadastre a URL pública nos provedores OAuth.

## 🤝 Contribuição

Este é um software proprietário. Contribuições não concedem direito de uso,
cópia ou redistribuição do projeto. Para colaborar, solicite autorização ao
titular e trabalhe em uma branch específica:

```bash
git switch -c tipo/descricao-da-alteracao
```

Antes de enviar uma alteração:

- preserve as regras de autorização;
- não inclua credenciais;
- execute lint e build;
- documente migrations e novas variáveis;
- descreva claramente o comportamento alterado.

## 📞 Suporte

- Central de Ajuda: `/ajuda`
- E-mail: `equipe@cotrimdev.com.br`
- Repositório: [github.com/kaiocotrim/ReguaMaximum](https://github.com/kaiocotrim/ReguaMaximum)

## 📄 Licença

Copyright © 2026 Kaio Cotrim. Todos os direitos reservados.

Este projeto é **proprietário** e não é software de código aberto. Consulte o
arquivo [LICENSE](./LICENSE) para conhecer os termos de uso, cópia,
modificação e distribuição.
