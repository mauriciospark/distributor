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

# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-11-25

### Added
- **Controle de Estoque**
  - Cadastro de produtos com nome, categoria, quantidade, estoque mínimo, custo e preço de venda
  - Categorias: Gás, Água, Mercado e Padaria
  - Ajuste rápido de estoque (+1/-1)
  - Alertas visuais para estoque baixo
  - KPIs em tempo real: total de itens, itens com estoque baixo, valor em estoque
  - Filtros por categoria
  - Busca por nome de produto
  - Edição completa de produtos

- **PDV (Ponto de Venda)**
  - Catálogo visual de produtos com disponibilidade em tempo real
  - Carrinho de compras com controle de quantidade
  - Formas de pagamento: Pix, Dinheiro, Cartão
  - Atualização automática de estoque após venda
  - Barra de rolagem no carrinho para muitos itens
  - Total calculado automaticamente
  - Controles para aumentar/diminuir quantidade e remover itens

- **Comprovante de Venda**
  - Emissão automática de comprovante após cada venda
  - Dados do emitente configuráveis
  - Lista detalhada de itens com quantidade e valores
  - Número do comprovante e data/hora
  - Opção de impressão nativa
  - Design profissional para impressão

- **Histórico de Vendas**
  - Registro completo de todas as vendas realizadas
  - Visualização de data, total e forma de pagamento
  - Reemissão de comprovantes de vendas anteriores
  - Lista ordenada por data (mais recente primeiro)

- **Cascos & Vasilhames**
  - Controle específico para botijões de gás e galões de água
  - Registro de movimentos: troca, entrega e devolução
  - Contagem de cheios, vazios e com clientes
  - Botões desabilitados quando não há estoque disponível

- **Configurações**
  - Personalização dos dados do comércio
  - Configuração de nome, CNPJ, endereço e telefone
  - Dados aplicados automaticamente nos comprovantes
  - Persistência das configurações

- **Arquitetura**
  - Implementação de arquitetura Local-First
  - Persistência via localStorage
  - Separação entre dados persistentes (data) e transitórios (ui)
  - Event delegation para gerenciamento de eventos
  - Proteção contra XSS com escapamento de HTML

- **Design e UX**
  - Interface responsiva com suporte a mobile
  - Design limpo e moderno com paleta de cores consistente
  - Feedback visual imediato para ações do usuário
  - Barra de rolagem customizada no carrinho
  - Badges de status (estoque OK/Baixo)
  - Navegação por abas com títulos e textos de ajuda

- **Documentação**
  - README.md com instruções de uso e instalação
  - LICENSE com licença MIT
  - ABOUT.md com visão geral e filosofia do projeto
  - ARCHITECTURE.md com detalhes técnicos da arquitetura
  - CONTRIBUTING.md com guia de contribuição
  - CHANGELOG.md com histórico de versões

### Changed
- Sistema refatorado para Vanilla JavaScript puro (sem frameworks)
- Reorganização do código em seções claras (Configurações, Dados, Utilitários, Regras, Telas, Eventos)
- Implementação de cabeçalho oficial de copyright em todos os arquivos
- Atualização do título do projeto para "Distribuidora"
- Mudança de "Nota Fiscal" para "Comprovante de Venda" (documento sem valor fiscal)

### Fixed
- Correção de precisão em cálculos monetários usando arredondamento
- Prevenção de injeção XSS através de escapamento de HTML
- Validação de estoque ao adicionar itens ao carrinho
- Gerenciamento correto de tipos (Number vs String) para valores monetários

### Security
- Implementação de escapamento de HTML para prevenir ataques XSS
- Validação e sanitização de todas as entradas de usuário
- Armazenamento local sem envio de dados para servidores externos
- Zero dependências de terceiros reduzindo superfície de ataque

### Performance
- Uso de event delegation para reduzir número de event listeners
- Renderização otimizada com reescrita seletiva do DOM
- Caching de referências DOM com função `$()`
- Separação de estado persistente/transitório para reduzir acessos ao localStorage

---

## [Versões Futuras]

### Planejado para v1.1.0
- Exportação de dados para CSV
- Relatórios de vendas por período
- Sistema de backup/restore de dados
- Autenticação local simples

### Planejado para v1.2.0
- Integração PWA completa
- Sincronização opcional entre dispositivos
- Impressão de etiquetas para produtos
- Controle de fornecedores

### Planejado para v2.0.0
- Múltiplos usuários com permissões
- Integração fiscal (NFC-e real opcional)
- Dashboard analytics com KPIs avançados
- Aplicativo mobile nativo

---

## Notas de Versão

### v1.0.0 - Lançamento Inicial

Esta é a primeira versão estável da Distribuidora. O sistema oferece todas as funcionalidades essenciais para gestão de distribuidoras de gás, água, mercado e padaria, com foco em simplicidade, privacidade e autonomia.

**Decisões de Design:**
- Local-First: Dados ficam no dispositivo do usuário
- Vanilla JS: Zero dependências externas
- localStorage: Persistência simples e eficiente
- Event Delegation: Arquitetura escalável de eventos

**Limitações Conhecidas:**
- Capacidade limitada do localStorage (~5-10MB)
- Perda de dados ao limpar cache do navegador
- Sem sincronização automática entre dispositivos
- Sem autenticação multi-usuário

**Requisitos de Sistema:**
- Navegador moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Servidor HTTP local para desenvolvimento
- JavaScript habilitado

---

[1.0.0]: https://github.com/mauriciospark/distributor/releases/tag/v1.0.0
