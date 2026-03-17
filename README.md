<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">💰 API de Carteira Cripto</h1>

<p align="center">
API REST de carteira digital com suporte a múltiplos tokens, desenvolvida com NestJS, seguindo boas práticas de arquitetura, consistência transacional e rastreabilidade via ledger.
</p>

---

## 📌 Descrição

Este projeto implementa uma **carteira cripto simplificada**, conforme especificado no teste técnico.

A API permite:

* autenticação de usuários
* gerenciamento de saldo por token
* depósito via webhook
* saque
* swap entre moedas
* rastreamento completo de movimentações (ledger)

O sistema foi projetado para ser **auditável, consistente e seguro**, simulando cenários reais de sistemas financeiros.

---

## 🚀 Tecnologias utilizadas

* Node.js
* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL / SQLite
* JWT (autenticação)

---

## 🧠 Arquitetura do sistema

```bash
src/
├── auth/
├── wallet/
├── withdraw/
├── swap/
├── ledger/
├── webhooks/
├── prisma/
```

---

## 📊 Modelagem do banco de dados

### Entidades principais

* **User** → usuário da plataforma
* **Wallet** → carteira vinculada ao usuário
* **Balance** → saldo por token
* **Ledger** → registro de todas as movimentações

---

## 🔐 Autenticação

* Cadastro com email e senha
* Login retorna JWT
* Rotas protegidas por autenticação

---

## 👛 Carteira e saldos

* Ao criar um usuário, uma carteira é criada automaticamente
* Suporte a múltiplos tokens (ex: BRL, BTC, ETH)
* Saldos armazenados em tabela `Balance`
* Estrutura baseada em **ledger virtual**

---

## 💰 Depósito via webhook

### Endpoint:

```bash
POST /webhooks/deposit
```

### Payload:

```json
{
  "userId": "uuid",
  "token": "BRL",
  "amount": 100,
  "idempotencyKey": "abc123"
}
```

### Regras:

* Validação de `idempotencyKey` para evitar depósitos duplicados
* Atualização do saldo no token correto
* Registro no ledger
* Retorna erro se usuário ou token não existir

---

## 🔄 Swap (conversão de tokens)

### Cotação

* Integração com API externa (ex: CoinGecko)
* Retorna valor convertido + taxa

### Execução

* Valida saldo suficiente
* Aplica taxa fixa de **1.5%**
* Debita token de origem
* Credita token de destino
* Registra movimentações no ledger

---

## 💸 Saque

### Endpoint:

```bash
POST /withdraw
```

### Regras:

* Valida saldo suficiente
* Debita saldo
* Operação simulada (mock)
* Registro obrigatório no ledger

---

## 📒 Ledger (movimentações)

Toda alteração de saldo gera um registro no ledger.

### Tipos de movimentação:

* DEPOSIT
* SWAP_IN
* SWAP_OUT
* SWAP_FEE
* WITHDRAWAL

### Cada registro contém:

* token
* valor
* saldo anterior
* saldo novo
* data/hora

### Propriedade importante:

O saldo pode ser **reconstruído a partir do ledger**, garantindo auditabilidade.

---

## 📊 Histórico de transações

### Funcionalidade:

* Listagem de transações do usuário
* Suporte a paginação
* Cada transação inclui:

  * tipo
  * tokens envolvidos
  * valores
  * taxa
  * data

---

## ⚙️ Regras de negócio

* Não permite saldo negativo
* Operações protegidas por transações (`prisma.$transaction`)
* Consistência garantida em operações concorrentes
* Validação de entrada e tratamento de erros

---

## 🔄 Transações (consistência)

O sistema utiliza transações para garantir integridade dos dados:

```ts
await prisma.$transaction(async (tx) => {
  // leitura e escrita atômica
});
```

---

## ▶️ Como rodar o projeto

```bash
# instalar dependências
npm install

# gerar cliente prisma
npx prisma generate

# rodar migrations
npx prisma migrate dev

# iniciar aplicação
npm run start:dev
```

---

## 🧪 Testes

```bash
npm run test
npm run test:e2e
```

---

## 🧠 Decisões técnicas

### 🔹 Prisma ORM

Escolhido pela tipagem forte e facilidade de uso com TypeScript.

### 🔹 Ledger como fonte de verdade

Permite rastreabilidade completa e auditoria das movimentações.

### 🔹 Transações no Prisma

Garantem consistência em operações financeiras críticas.

### 🔹 Separação por módulos

Facilita manutenção e escalabilidade do sistema.

---

## 🚀 Possíveis melhorias

* Cache de cotações com Redis
* Deploy em nuvem
* Interface frontend
* Proteção avançada contra concorrência
* Idempotência em outras operações

---

## 👨‍💻 Autor

Projeto desenvolvido como parte de teste técnico para vaga de backend.

---

## 📄 Licença

MIT
