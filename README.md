# Zé Construção - Controle de Estoque e Caixa

Aplicação web simples para estudo, com foco em gestão de loja de materiais de construção.

## Demo

GitHub Pages (após ativar no repositório):  
`https://millicodev.github.io/ze-construcao-dashboard/`

## Funcionalidades

- Login de administrador
- Cadastro e atualização de produtos
- Controle de estoque em tempo real
- Registro de vendas
- Dashboard financeiro de caixa
- Persistência de dados no navegador (`localStorage`)
- Exportação do histórico de vendas em CSV

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

## Como executar

1. Abra o arquivo `Construção.html` no navegador.
2. Faça login com:
   - Usuário: `demo_admin`
   - Senha: `demo_123`

## Aviso

Projeto educacional/demonstração. Não use essas credenciais em produção.

## Estrutura do projeto

- `Construção.html` - estrutura da interface
- `style.css` - estilos visuais
- `config.js` - configurações centrais (auth, storage e API)
- `data-gateway.js` - camada de persistência (hoje localStorage, pronto para API)
- `script.js` - regras de negócio e interações da interface

## Melhorias futuras

- Filtros por período no caixa (dia, semana, mês)
- Categorias de produtos
- Relatórios avançados
- Integração com banco de dados

## Preparado para upgrades

- **Banco de dados/API:** troque apenas o `data-gateway.js` por uma versão HTTP sem reescrever a interface.
- **Deploy:** o projeto continua estático e pode subir em GitHub Pages, Vercel ou Netlify.
- **Configuração central:** login e chave de storage ficam em `config.js`, facilitando ambientes (dev/prod).

## Sugestões para o GitHub

- **Descrição do repositório:** Dashboard web para controle de estoque, vendas e caixa de loja de materiais de construção.
- **Tópicos (tags):** `html`, `css`, `javascript`, `dashboard`, `inventory-management`, `cash-flow`, `github-pages`
