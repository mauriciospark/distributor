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

# Guia de Contribuição

Este documento estabelece as diretrizes para contribuir com o projeto Distribuidora. Seguir estas práticas garante qualidade, consistência e manutenibilidade do código.

## Código de Conduta

- Respeite todos os contribuidores
- Seja construtivo em feedback e revisões
- Priorize a simplicidade e clareza sobre complexidade desnecessária
- Mantenha o foco na filosofia do projeto: privacidade, eficiência, autonomia

## Fluxo de Contribuição

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
git clone https://github.com/SEU-USUARIO/distributor.git
cd distributor
```

### 2. Branch Strategy

Use branches descritivos e com prefixo:

- `feature/` - Nova funcionalidade
- `fix/` - Correção de bug
- `refactor/` - Refatoração de código
- `docs/` - Atualização de documentação
- `style/` - Alterações de estilo/formatting

Exemplos:
```bash
git checkout -b feature/adicionar-exportacao-csv
git checkout -b fix/bug-scroll-carrinho
git checkout -b refactor/mover-logica-estoque
```

### 3. Desenvolvimento

- Escreva código limpo e legível
- Siga os padrões de estilo do projeto
- Adicione comentários quando a lógica não for óbvia
- Teste manualmente as alterações

### 4. Commit Messages

Use o formato Conventional Commits:

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional com detalhes]

[rodapé opcional]
```

**Tipos permitidos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudança na documentação
- `style`: Formatação, ponto e vírgula, etc (sem mudança de código)
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição ou modificação de testes
- `chore`: Atualização de build, dependências, etc

**Exemplos:**
```bash
feat(pdv): adicionar opção de pagamento em cartão de crédito
fix(estoque): corrigir cálculo de valor total quando há itens com desconto
docs(readme): atualizar instruções de instalação
refactor(css): simplificar classes de responsividade
```

### 5. Pull Request

Antes de abrir um PR:

- [ ] Rebase seu branch com a branch principal (`main`)
- [ ] Verifique se não há conflitos
- [ ] Teste todas as funcionalidades afetadas
- [ ] Atualize a documentação se necessário
- [ ] Adicione uma descrição clara no PR

**Template de PR:**

```markdown
## Descrição
Breve descrição do que esta PR altera.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Quebra de compatibilidade
- [ ] Atualização de documentação

## Motivação
Por que esta mudança é necessária? Qual problema ela resolve?

## Como Testar
Passos para reproduzir e verificar a mudança.

## Screenshots (se aplicável)
Capturas de tela mostrando a mudança.

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Self-review realizado
- [ ] Comentários adicionados onde necessário
- [ ] Documentação atualizada
- [ ] Sem conflitos de merge
- [ ] Commit messages seguem o padrão
```

## Padrões de Código

### JavaScript

#### Nomenclatura

- **Variáveis e funções**: `camelCase`
  ```javascript
  const totalPrice = 100;
  function calculateTotal() { }
  ```

- **Constantes**: `UPPER_SNAKE_CASE`
  ```javascript
  const STORAGE_KEY = "distribuidora_pro_v1";
  const MAX_ITEMS = 50;
  ```

- **Classes**: `PascalCase` (se utilizado no futuro)
  ```javascript
  class ProductManager { }
  ```

#### Estrutura de Funções

```javascript
// Função pequena e focada
function calcularTotal(item) {
  const total = item.quantity * item.price;
  return arredondar(total);
}

// Função com validação
function adicionarAoCarrinho(id) {
  const item = achar(data.items, id);
  if (!item) return; // Validação
  
  // Lógica principal
  // ...
}
```

#### Comentários

Use comentários para explicar **por que**, não **o que**:

```javascript
// ❌ Ruim
// Soma a quantidade com 1
item.quantity = item.quantity + 1;

// ✅ Bom
// Arredonda para evitar erros de ponto flutuante (0.1 + 0.2 ≠ 0.3)
const total = arredondar(qtd * preco);
```

### HTML

#### Semântica

Use tags HTML5 semânticas:

```html
<!-- ✅ Bom -->
<section id="tab-pdv">
  <header>
    <h3>Venda Atual</h3>
  </header>
  <div class="cart-list"></div>
</section>

<!-- ❌ Ruim -->
<div id="pdv">
  <div class="title">Venda Atual</div>
  <div class="items"></div>
</div>
```

#### Atributos data-

Use `data-*` attributes para comunicação JavaScript-HTML:

```html
<button data-action="carrinho-add" data-id="${item.id}">Adicionar</button>
```

### CSS

#### Organização

Mantenha variáveis CSS no topo do arquivo:

```css
:root {
  --primary: #1d4ed8;
  --success: #15803d;
  --danger: #dc2626;
}
```

#### Nomenclatura de Classes

Use `kebab-case` para classes:

```css
/* ✅ Bom */
.cart-item { }
.cart-item-info { }
.btn-primary { }

/* ❌ Ruim */
.cartItem { }
.cartItemInfo { }
.btnPrimary { }
```

#### Responsividade

Use media queries no final do arquivo:

```css
/* Estilos base */
.component { }

/* Mobile */
@media (max-width: 768px) {
  .component { }
}
```

## Validações Obrigatórias

### Antes de Commitar

1. **Teste Manual**
   - Abra a aplicação em diferentes navegadores (Chrome, Firefox, Edge)
   - Teste em mobile (responsividade)
   - Verifique se localStorage funciona
   - Teste casos de borda (estoque zero, carrinho vazio, etc)

2. **Validação de Dados**
   - Todos os inputs são validados
   - Dados são escapados antes de inserir no DOM
   - Números são convertidos corretamente
   - Strings são trimadas

3. **Performance**
   - Não há loops desnecessários
   - Renderização não causa flicker
   - localStorage não é acessado excessivamente

4. **Acessibilidade**
   - Labels estão associados aos inputs
   - Cores têm contraste adequado
   - Botões têm estados hover/focus visíveis

## Padrões de Arquitetura

### Separação de Responsabilidades

Mantenha a separação entre camadas:

- **HTML**: Estrutura e conteúdo
- **CSS**: Apresentação e layout
- **JavaScript**: Comportamento e lógica

### Não Duplique Código (DRY)

Crie funções reutilizáveis:

```javascript
// ❌ Ruim
const total1 = item1.quantity * item1.price;
const total2 = item2.quantity * item2.price;

// ✅ Bom
const calcularTotal = (item) => item.quantity * item.price;
const total1 = calcularTotal(item1);
const total2 = calcularTotal(item2);
```

### Funções Pequenas

Mantenha funções focadas e pequenas:

```javascript
// ❌ Ruim - função faz múltiplas coisas
function processarVenda() {
  // adiciona ao carrinho
  // calcula total
  // salva no localStorage
  // atualiza estoque
  // mostra modal
  // envia email
}

// ✅ Bom - cada função faz uma coisa
function adicionarAoCarrinho(id) { }
function calcularTotal() { }
function salvarVenda(venda) { }
function atualizarEstoque(itens) { }
function mostrarComprovante(venda) { }
```

## Diretrizes Específicas do Projeto

### Local-First

- Nunca adicione chamadas a APIs externas
- Não implemente tracking ou analytics
- Mantenha tudo funcional offline
- Valide que localStorage é suficiente para os dados

### Privacidade

- Nunca capture dados pessoais sem necessidade
- Não implemente cookies para rastreamento
- Mantenha dados sensíveis apenas no dispositivo do usuário
- Se dados precisarem ser compartilhados, use métodos explícitos (exportação)

### Simplicidade

- Evite dependências externas a menos que essenciais
- Prefira JavaScript vanilla sobre frameworks
- Mantenha a interface simples e intuitiva
- Não adicione funcionalidades complexas sem valor claro

## Revisão de Código

### Para Revisores

Ao revisar um PR:

1. Verifique se o código segue os padrões estabelecidos
2. Teste as mudanças localmente
3. Forneça feedback construtivo e específico
4. Aprove se o código atende aos objetivos
5. Solicite alterações se necessário, com explicações claras

### Para Contribuidores

Ao receber feedback:

1. Leia atentamente os comentários
2. Faça as alterações solicitadas
3. Responda às perguntas do revisor
4. Agradeça pelo tempo dedicado à revisão

## Perguntas Frequentes

### Posso adicionar uma biblioteca externa?

Geralmente não. O projeto prioriza vanilla JavaScript. Se você acredita que uma biblioteca é essencial, justifique no PR considerando:
- Tamanho do bundle
- Dependência de CDN externo
- Manutenção a longo prazo
- Alternativas nativas

### Como adicionar testes?

Atualmente o projeto usa testes manuais. Testes automatizados podem ser adicionados no futuro usando:
- Jest para testes unitários
- Playwright para testes E2E

### Posso mudar a arquitetura?

Mudanças arquiteturais devem ser discutidas antes da implementação. Abra uma issue descrevendo:
- Motivação da mudança
- Benefícios esperados
- Impacto no código existente
- Plano de migração

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT do projeto.

## Contato

Para dúvidas sobre contribuição, abra uma issue no repositório ou entre em contato através dos canais oficiais do projeto.

---

**Obrigado por contribuir com a Distribuidora!** 🚀
