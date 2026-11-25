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

# Arquitetura do Sistema

## Visão Geral

A Distribuidora adota uma arquitetura **Local-First** com design monolítico simplificado. Todo o sistema opera no navegador do cliente, sem dependência de servidor backend ou APIs externas. Os dados são persistidos localmente usando a Web Storage API (localStorage), garantindo privacidade total e operação offline.

## Padrão Arquitetural

### Local-First Architecture

A arquitetura Local-First prioriza o armazenamento e processamento de dados no dispositivo do usuário, em vez de depender de servidores remotos. Esta escolha foi motivada por:

1. **Privacidade**: Dados sensíveis (clientes, vendas, estoque) nunca deixam o dispositivo
2. **Autonomia**: Sistema funciona sem conexão com a internet após carregamento inicial
3. **Performance**: Latência zero para operações de leitura/escrita
4. **Simplicidade**: Elimina necessidade de infraestrutura de servidor, banco de dados e autenticação
5. **Custo Zero**: Sem custos de hospedagem, manutenção ou escalabilidade

### Estrutura de Camadas

O sistema está organizado em 4 camadas distintas:

```
┌─────────────────────────────────────┐
│     CAMADA DE APRESENTAÇÃO          │
│  (HTML + CSS + Interação DOM)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        CAMADA DE LÓGICA             │
│   (JavaScript: regras de negócio)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      CAMADA DE DADOS (UI)           │
│   (Estado transitório da sessão)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    CAMADA DE PERSISTÊNCIA           │
│     (localStorage - Data)            │
└─────────────────────────────────────┘
```

## Design de Dados

### Estrutura de Estado

O estado da aplicação é dividido em dois objetos:

#### `data` (Persistente)
Dados que são salvos no localStorage e persistem entre sessões:

```javascript
{
  items: [],      // Lista de produtos cadastrados
  cascos: [],     // Controle de vasilhames
  sales: [],      // Histórico de vendas
  config: {}      // Configurações do comércio
}
```

#### `ui` (Transitório)
Dados que existem apenas durante a sessão atual:

```javascript
{
  cart: [],       // Carrinho de compras
  filterCat: "",  // Filtro de categoria atual
  search: ""      // Termo de busca atual
}
```

### Separação de Responsabilidades

Essa separação garante que:
- Dados críticos (vendas, estoque) sejam sempre persistidos
- Estado de interface (filtros, busca) seja resetado ao recarregar
- Carrinho vazio se o usuário fechar o navegador por engano (prevenção de perda)

## Fluxo de Dados

### 1. Interação do Usuário

Quando o usuário interage com a interface (clica em botão, preenche formulário):

```
Usuário → Evento DOM → Event Listener → Função de Lógica
```

Exemplo: Clicar em "Adicionar" no PDV
```
Clique → data-action="carrinho-add" → ACOES["carrinho-add"] → adicionarAoCarrinho()
```

### 2. Processamento de Lógica

A função de lógica executa as regras de negócio:

```
Função de Lógica → Validações → Modificação de Estado
```

Exemplo: Adicionar ao carrinho
```javascript
adicionarAoCarrinho(id) {
  // 1. Busca produto
  const item = achar(data.items, id);
  
  // 2. Valida estoque disponível
  if (qtdAtual >= item.quantity) return;
  
  // 3. Modifica estado transitório
  ui.cart.push({ ... });
  
  // 4. Atualiza interface
  renderCarrinho();
}
```

### 3. Persistência

Quando dados precisam ser salvos permanentemente:

```
Modificação de data → salvarDados() → localStorage.setItem()
```

Exemplo: Finalizar venda
```javascript
finalizarVenda() {
  // 1. Cria registro de venda
  const venda = { ... };
  
  // 2. Adiciona ao array persistente
  data.sales.unshift(venda);
  
  // 3. Atualiza estoque
  venda.items.forEach((c) => {
    item.quantity -= c.qty;
  });
  
  // 4. Persiste no localStorage
  salvarDados();
  
  // 5. Limpa estado transitório
  ui.cart = [];
}
```

### 4. Renderização

Após qualquer modificação de estado, a interface é atualizada:

```
Modificação de Estado → renderTudo() → Reescrita do DOM
```

## Justificativa das Escolhas Técnicas

### Por que localStorage?

**Vantagens:**
- API nativa do navegador, sem dependências
- Persistência entre sessões
- Síncrono (simplicidade operacional)
- Capacidade de ~5-10MB (suficiente para o caso de uso)
- Zero latência

**Limitações Aceitas:**
- Não estruturado (JSON serializado)
- Não relacional
- Perda ao limpar cache do navegador (mitigado: instruir usuário)

### Por que Vanilla JavaScript?

**Vantagens:**
- Zero dependências externas
- Carregamento instantâneo
- Tamanho mínimo do bundle
- Controle total sobre performance
- Aprendizado simples para manutenção

**Alternativas Consideradas e Rejeitadas:**
- React/Vue: Overhead desnecessário para aplicação simples
- jQuery: Obsoleto, aumenta tamanho sem benefício
- Frameworks backend: Contradiz filosofia Local-First

### Por que Event Delegation?

Em vez de `onclick` inline em cada botão, usamos event delegation:

```javascript
document.addEventListener("click", (e) => {
  const botao = e.target.closest("[data-action]");
  if (botao && ACOES[botao.dataset.action]) 
    ACOES[botao.dataset.action](botao);
});
```

**Vantagens:**
- Um único listener para toda a aplicação
- Elementos dinâmicos funcionam automaticamente
- Separação clara entre HTML e JavaScript
- Fácil manutenção e debug

### Por que Separação data/ui?

```javascript
const data = carregarDados();      // Persistente
const ui = { cart: [], ... };      // Transitório
```

**Vantagens:**
- Clareza de propósito de cada dado
- Simples implementação de backup (salvar apenas `data`)
- Previne persistência acidental de estado de interface
- Facilita migração futura para outras camadas de persistência

## Segurança e Privacidade

### Proteção Contra XSS

Todo conteúdo inserido no DOM é escapado:

```javascript
const escapar = (t) =>
  String(t).replace(/[&<>"']/g, (c) => ({ ... })[c]);
```

Isso previne injeção de scripts maliciosos através de nomes de produtos ou configurações.

### Sanitização de Entrada

Antes de salvar, todos os dados são validados:
- Números são convertidos com `Number()`
- Strings são trimadas com `.trim()`
- Campos obrigatórios são verificados

### Privacidade de Dados

- Nenhum dado é enviado para servidores externos
- Nenhum tracking ou analytics é implementado
- Cookies não são utilizados
- LocalStorage é acessível apenas pelo mesmo domínio

## Escalabilidade e Manutenibilidade

### Organização do Código

O arquivo `script.js` está organizado em seções claras:

1. **Configurações Fixas**: Constantes e definições
2. **Dados e Armazenamento**: Funções de carregamento/salvamento
3. **Utilitários**: Funções auxiliares (formatar, escapar)
4. **Regras do Negócio**: Lógica principal (estoque, vendas)
5. **Telas (Render)**: Funções que desenham a interface
6. **Eventos**: Listeners e mapeamento de ações
7. **Início**: Inicialização da aplicação

### Facilidade de Extensão

Para adicionar nova funcionalidade:
1. Adicionar nova ação em `ACOES`
2. Implementar função de lógica
3. Adicionar botão com `data-action` no HTML

Exemplo de modularidade futura:
- Cada módulo (estoque, pdv, cascos) pode ser extraído para arquivo separado
- Camada de persistência pode ser abstraída para suportar IndexedDB
- Interface pode ser componentizada para reuso

## Conclusão

A arquitetura da Distribuidora foi projetada para simplicidade, privacidade e autonomia. Cada escolha técnica foi feita com o objetivo de criar um sistema que qualquer pessoa possa usar sem barreiras técnicas, mantendo controle total sobre seus dados. A arquitetura Local-First, combinada com Vanilla JavaScript e localStorage, oferece o equilíbrio ideal entre funcionalidade e simplicidade para o caso de uso específico.
