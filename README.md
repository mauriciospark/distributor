<!--
  ============================================================================
  PROPRIETÁRIO: Mauricio Spark
  MARCA:        SparkMauricio
  PROJETO:      Distribuidora
  VERSÃO:       v1.0.0
  LINHAGEM:     SPARK
  ============================================================================
  Documento de Planejamento de Escopo
  COPYRIGHT: © 2026 / Mauricio Spark. Todos os direitos reservados.
  ============================================================================
-->

# Distribuidora — (Linhagem SPARK)

Sistema de gestão completa para distribuidoras de gás, água, mercado e padaria. Uma solução local-first que permite controle de estoque, PDV (Ponto de Venda), emissão de comprovantes e gestão de vasilhames, tudo armazenado localmente no navegador com privacidade total.

## Descrição

A Distribuidora é um software web leve e autônomo projetado para pequenos e médios comércios que precisam de controle eficiente de estoque e vendas sem depender de servidores externos ou conexão constante com a internet. O sistema opera 100% no navegador, utilizando localStorage para persistência de dados, garantindo que as informações do negócio permaneçam privadas e acessíveis a qualquer momento.

Ideal para estabelecimentos que comercializam gás, água, produtos de mercado e padaria, o sistema oferece módulos especializados para cada categoria, incluindo controle de vasilhames (botijões e galões) que é essencial para esse tipo de negócio.

## Stack Tecnológica

### Frontend
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com variáveis CSS e design responsivo
- **JavaScript (ES6+)** - Lógica da aplicação com módulos e funcionalidades modernas

### Backend
- **Local-First Architecture** - Dados persistidos no navegador via localStorage
- **Serverless** - Sem necessidade de servidor backend ou API externa

### Banco de Dados
- **localStorage** - Armazenamento local persistente no navegador
- **JSON** - Formato de serialização de dados

### Bibliotecas e Ferramentas
- **Vanilla JavaScript** - Sem frameworks externos, máxima performance
- **Native Web APIs** - Dialog API, Print API, Storage API
- **PWA Ready** - Estrutura preparada para Progressive Web App

## Funcionalidades

### 📦 Controle de Estoque
- Cadastro de produtos com nome, categoria, quantidade, estoque mínimo, custo e preço de venda
- Categorias: Gás, Água, Mercado e Padaria
- Ajuste rápido de estoque (+1/-1)
- Alertas visuais para estoque baixo
- KPIs em tempo real: total de itens, itens com estoque baixo, valor em estoque
- Filtros por categoria
- Busca por nome de produto
- Edição completa de produtos

### 🛒 PDV (Ponto de Venda)
- Catálogo visual de produtos com disponibilidade em tempo real
- Carrinho de compras com controle de quantidade
- Formas de pagamento: Pix, Dinheiro, Cartão
- Atualização automática de estoque após venda
- Barra de rolagem no carrinho para muitos itens
- Total calculado automaticamente

### 🧾 Comprovante de Venda
- Emissão automática de comprovante após cada venda
- Dados do emitente configuráveis
- Lista detalhada de itens com quantidade e valores
- Número do comprovante e data/hora
- Opção de impressão nativa
- Design profissional para impressão

### 📋 Histórico de Vendas
- Registro completo de todas as vendas realizadas
- Visualização de data, total e forma de pagamento
- Reemissão de comprovantes de vendas anteriores
- Lista ordenada por data (mais recente primeiro)

### 🫙 Cascos & Vasilhames
- Controle específico para botijões de gás e galões de água
- Registro de movimentos: troca, entrega e devolução
- Contagem de cheios, vazios e com clientes
- Botões desabilitados quando não há estoque disponível

### ⚙️ Configurações
- Personalização dos dados do comércio
- Configuração de nome, CNPJ, endereço e telefone
- Dados aplicados automaticamente nos comprovantes
- Persistência das configurações

## Como Rodar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor HTTP local (para evitar restrições de CORS com localStorage)

### Instruções

1. **Clone o repositório**
   ```bash
   git clone <repositorio-url>
   cd distributor
   ```

2. **Inicie um servidor local**

   **Opção 1 - Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Opção 2 - PHP:**
   ```bash
   php -S localhost:8000
   ```

   **Opção 3 - Node.js:**
   ```bash
   npx http-server -p 8000
   ```

3. **Acesse a aplicação**
   - Abra o navegador em: `http://localhost:8000`

4. **Comece a usar**
   - O sistema já vem com dados de exemplo
   - Configure os dados do seu comércio na aba "Configurações"
   - Cadastre seus produtos na aba "Estoque"
   - Comece a vender no PDV

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Para suporte ou sugestões, entre em contato através do repositório oficial do projeto.
