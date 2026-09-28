# Fanfar Farmácias

Frontend da loja virtual da Fanfar Farmácias, feito com React, TypeScript e Vite. O catálogo atual usa dados de demonstração; carrinho, preferências e favoritos ficam no navegador, e os pedidos são encaminhados pelo WhatsApp.

## Desenvolvimento local

Requisitos: Node.js e pnpm.

```bash
pnpm install
pnpm dev
```

Para gerar a versão de produção localmente:

```bash
pnpm build
pnpm preview
```

## Publicar na Vercel

1. Envie este projeto para um repositório Git (GitHub, GitLab ou Bitbucket).
2. Na Vercel, importe o repositório. O `vercel.json` configura Vite, o comando `pnpm build`, a pasta `dist` e o fallback das rotas do React Router.
3. Mantenha o gerenciador de pacotes em pnpm; o `pnpm-lock.yaml` está incluído para instalação reproduzível.
4. Faça o deploy. Não há variáveis de ambiente obrigatórias para a versão atual.

As páginas `/produto/...`, `/categoria/...` e `/cupons` carregam diretamente graças ao rewrite para o app React.

## Catálogo de produtos

O catálogo da interface vem de `data/saojoao-produtos.json`; a versão compacta usada pelo frontend fica em `src/data/catalogProducts.json`. Para atualizar ambos, rode `pnpm scrape:saojoao`. Por padrão, são coletados 200 produtos; use `SCRAPER_MAX_FROM=500 pnpm scrape:saojoao` para aumentar a quantidade.

## Antes de usar como loja real

O catálogo, cupons, preços e dados exibidos são demonstrativos. O estado administrativo e as informações gravadas no `localStorage` existem somente no navegador de cada visitante. O checkout prepara o pedido para envio pelo WhatsApp; este projeto não inclui backend, pagamentos, autenticação real, estoque compartilhado ou persistência centralizada. Revise também os dados comerciais e legais antes de divulgar o site.
