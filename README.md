# Dossiê do Colaborador

Aplicação SPA em **Vue 2** para gestão de dossiê de colaboradores.

## Stack

- Vue 2 + Vue Router + Vuex
- Bootstrap-Vue + Element UI
- Axios (consumo de API REST)
- SCSS (estilização global com variáveis)

## Pré-requisitos

- Node.js >= 14
- npm >= 6

## Instalação

```bash
cd front
npm install
```

## Desenvolvimento

```bash
cd front
npm run serve
```

Acesse em `http://localhost:8080`.

## Build de produção

```bash
cd front
npm run build
```

Os arquivos gerados ficam em `front/dist/`.

## Variáveis de ambiente

Crie um arquivo `front/.env.local` baseado em `front/.env.example`:

```
VUE_APP_API_URL=https://sua-api.com
```

## Deploy no Vercel

O projeto já possui `vercel.json` configurado na raiz. Para fazer o deploy:

1. Importe o repositório no [Vercel](https://vercel.com)
2. Sem alterar nenhuma configuração — o `vercel.json` cuida do build e das rotas SPA
3. Configure a variável de ambiente `VUE_APP_API_URL` nas Settings do projeto no Vercel
4. Faça o deploy

## Estrutura

```
23113/
├── front/              # Aplicação Vue CLI
│   ├── public/         # index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── router/
│   │   ├── services/   # Chamadas à API (axios)
│   │   ├── store/      # Vuex
│   │   ├── styles/     # SCSS global
│   │   └── views/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── vercel.json
└── README.md
```
