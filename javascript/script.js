/*
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
*/
"use strict";

/* ---------- 1. CONFIGURAÇÕES FIXAS ---------- */

const STORAGE_KEY = "distribuidora_pro_v1";

const CATEGORIAS = {
  gas: "Gás",
  agua: "Água",
  mercado: "Mercado",
  padaria: "Padaria",
};

// Título, explicação e se mostra busca/botão "Novo Item" em cada tela
const TELAS = {
  estoque: {
    titulo: "Controle de Estoque",
    busca: true,
    ajuda: "Veja tudo o que tem na loja. Itens em vermelho estão acabando.",
  },
  pdv: {
    titulo: "Vendas (PDV)",
    busca: true,
    ajuda: "Clique em Adicionar nos produtos, escolha o pagamento e finalize.",
  },
  vendas: {
    titulo: "Vendas Emitidas",
    busca: false,
    ajuda: "Histórico de todas as vendas feitas. Dá para rever o comprovante.",
  },
  cascos: {
    titulo: "Cascos & Vasilhames",
    busca: false,
    ajuda:
      "Controle de botijões e galões: quantos cheios, vazios e com clientes.",
  },
  config: {
    titulo: "Configurações",
    busca: false,
    ajuda: "Dados do comércio que saem impressos no comprovante.",
  },
};

/* ---------- 2. DADOS E ARMAZENAMENTO ---------- */

// Dados iniciais (usados só na primeira vez que o sistema abre)
const DADOS_INICIAIS = {
  items: [
    {
      id: 1,
      name: "Botijão Gás P13 (Carga)",
      category: "gas",
      quantity: 18,
      minStock: 5,
      cost: 82,
      price: 110,
    },
    {
      id: 2,
      name: "Galão Água Mineral 20L",
      category: "agua",
      quantity: 24,
      minStock: 8,
      cost: 5.5,
      price: 12,
    },
    {
      id: 3,
      name: "Fardo Água 500ml (12un)",
      category: "agua",
      quantity: 4,
      minStock: 6,
      cost: 8,
      price: 16,
    },
    {
      id: 4,
      name: "Arroz Branco 5kg",
      category: "mercado",
      quantity: 15,
      minStock: 5,
      cost: 18.5,
      price: 25.9,
    },
    {
      id: 5,
      name: "Pão Francês (kg)",
      category: "padaria",
      quantity: 20,
      minStock: 10,
      cost: 8,
      price: 14,
    },
    {
      id: 6,
      name: "Pão de Forma (500g)",
      category: "padaria",
      quantity: 12,
      minStock: 5,
      cost: 6,
      price: 10,
    },
    {
      id: 7,
      name: "Pão de Hambúrguer (6un)",
      category: "padaria",
      quantity: 8,
      minStock: 4,
      cost: 5,
      price: 9,
    },
    {
      id: 8,
      name: "Pão de Hot Dog (6un)",
      category: "padaria",
      quantity: 10,
      minStock: 4,
      cost: 4.5,
      price: 8,
    },
  ],
  cascos: [
    {
      id: "p13",
      name: "Casco Gás P13",
      cheios: 18,
      vazios: 9,
      comClientes: 32,
    },
    {
      id: "g20",
      name: "Galão Água 20L",
      cheios: 24,
      vazios: 14,
      comClientes: 45,
    },
  ],
  sales: [],
  config: {
    nome: "Distribuidora Pro",
    cnpj: "00.000.000/0001-00",
    endereco: "Rua Exemplo, 123 - Centro",
    telefone: "(00) 0000-0000",
  },
};

// "data" = o que fica salvo. "ui" = o que só vale enquanto a tela está aberta.
const data = carregarDados();
const ui = { cart: [], filterCat: "todos", search: "" };

function carregarDados() {
  const padrao = structuredClone(DADOS_INICIAIS);
  try {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!salvo) return padrao;
    return {
      ...padrao,
      ...salvo,
      config: { ...padrao.config, ...salvo.config },
    };
  } catch {
    return padrao;
  }
}

function salvarDados() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ---------- 3. UTILITÁRIOS ---------- */

const $ = (id) => document.getElementById(id);

const formatarReal = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

// Evita erros de centavos (0.1 + 0.2) e protege contra texto malicioso no HTML
const arredondar = (n) => Math.round(n * 100) / 100;
const escapar = (t) =>
  String(t).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const mesmoId = (a, b) => String(a) === String(b);
const achar = (lista, id) => lista.find((x) => mesmoId(x.id, id));
const totalDoCarrinho = () =>
  arredondar(ui.cart.reduce((s, c) => s + c.qty * c.price, 0));
const estoqueBaixo = (i) => i.quantity <= i.minStock;

/* ---------- 4. REGRAS DO NEGÓCIO ---------- */

function ajustarEstoque(id, delta) {
  const item = achar(data.items, id);
  if (!item) return;
  item.quantity = Math.max(0, item.quantity + delta);
  salvarDados();
  renderTudo();
}

function adicionarAoCarrinho(id) {
  const item = achar(data.items, id);
  if (!item) return;
  const noCarrinho = achar(ui.cart, id);
  const qtdAtual = noCarrinho ? noCarrinho.qty : 0;
  if (qtdAtual >= item.quantity) return; // não vende mais do que tem

  if (noCarrinho) noCarrinho.qty += 1;
  else
    ui.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  renderCarrinho();
}

function mudarQtdCarrinho(id, delta) {
  const noCarrinho = achar(ui.cart, id);
  const item = achar(data.items, id);
  if (!noCarrinho || !item) return;

  const novaQtd = noCarrinho.qty + delta;
  if (novaQtd <= 0) return removerDoCarrinho(id);
  if (novaQtd > item.quantity)
    return alert("Quantidade indisponível em estoque.");
  noCarrinho.qty = novaQtd;
  renderCarrinho();
}

function removerDoCarrinho(id) {
  ui.cart = ui.cart.filter((c) => !mesmoId(c.id, id));
  renderCarrinho();
}

function finalizarVenda() {
  if (!ui.cart.length) return;

  const venda = {
    id: Date.now(),
    date: new Date().toISOString(),
    paymentMethod: $("payment-method").value,
    items: structuredClone(ui.cart),
    total: totalDoCarrinho(),
  };
  data.sales.unshift(venda); // mais recente primeiro

  // Dá baixa no estoque
  venda.items.forEach((c) => {
    const item = achar(data.items, c.id);
    if (item) item.quantity = Math.max(0, item.quantity - c.qty);
  });

  ui.cart = [];
  salvarDados();
  renderTudo();
  mostrarComprovante(venda);
}

// Movimentos de vasilhame. Cada um diz de onde sai e para onde vai o casco.
const MOVIMENTOS_CASCO = {
  troca: {
    rotulo: "Troca (leva cheio, deixa vazio)",
    de: "cheios",
    para: "vazios",
  },
  entrega: {
    rotulo: "Levou cheio sem devolver",
    de: "cheios",
    para: "comClientes",
  },
  devolve: {
    rotulo: "Cliente devolveu vazio",
    de: "comClientes",
    para: "vazios",
  },
};

function moverCasco(id, tipo) {
  const casco = achar(data.cascos, id);
  const mov = MOVIMENTOS_CASCO[tipo];
  if (!casco || !mov || casco[mov.de] <= 0) return;
  casco[mov.de] -= 1;
  casco[mov.para] += 1;
  salvarDados();
  renderCascos();
}

function cadastrarItem(form) {
  const f = new FormData(form);
  const editId = f.get("edit-id");

  if (editId) {
    // Edição de item existente
    const item = achar(data.items, editId);
    if (item) {
      item.name = f.get("name").trim();
      item.category = f.get("category");
      item.quantity = Number(f.get("quantity"));
      item.minStock = Number(f.get("minStock"));
      item.cost = Number(f.get("cost"));
      item.price = Number(f.get("price"));
    }
  } else {
    // Novo item
    data.items.push({
      id: Date.now(),
      name: f.get("name").trim(),
      category: f.get("category"),
      quantity: Number(f.get("quantity")),
      minStock: Number(f.get("minStock")),
      cost: Number(f.get("cost")),
      price: Number(f.get("price")),
    });
  }
  salvarDados();
}

function abrirEdicao(id) {
  const item = achar(data.items, id);
  if (!item) return;

  $("modal-item-title").textContent = "Editar Item";
  $("edit-id").value = item.id;
  const form = $("form-item");
  form.name.value = item.name;
  form.category.value = item.category;
  form.quantity.value = item.quantity;
  form.minStock.value = item.minStock;
  form.cost.value = item.cost;
  form.price.value = item.price;
  $("btn-excluir-item").style.display = "block";
  $("modal-item").showModal();
}

function excluirItem(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  data.items = data.items.filter((i) => !mesmoId(i.id, id));
  salvarDados();
  $("modal-item").close();
  renderTudo();
}

/* ---------- 5. TELAS (RENDER) ---------- */

function renderEstoque() {
  const lista = data.items.filter(
    (i) =>
      (ui.filterCat === "todos" || i.category === ui.filterCat) &&
      (!ui.search || i.name.toLowerCase().includes(ui.search)),
  );

  $("kpi-total-itens").textContent = data.items.length;
  $("kpi-baixo-estoque").textContent = data.items.filter(estoqueBaixo).length;
  $("kpi-valor-venda").textContent = formatarReal(
    data.items.reduce((s, i) => s + i.quantity * i.price, 0),
  );

  $("estoque-tbody").innerHTML =
    lista
      .map(
        (i) => `
    <tr>
      <td><strong>${escapar(i.name)}</strong></td>
      <td>${CATEGORIAS[i.category] || i.category}</td>
      <td>${i.quantity}</td>
      <td>${formatarReal(i.cost)}</td>
      <td>${formatarReal(i.price)}</td>
      <td><span class="badge ${estoqueBaixo(i) ? "low" : "ok"}">${estoqueBaixo(i) ? "Baixo" : "OK"}</span></td>
      <td>
        <button type="button" class="btn sm" data-action="estoque-mais" data-id="${i.id}">+1</button>
        <button type="button" class="btn sm" data-action="estoque-menos" data-id="${i.id}">-1</button>
        <button type="button" class="btn sm btn-edit" data-action="estoque-editar" data-id="${i.id}">Editar</button>
      </td>
    </tr>`,
      )
      .join("") || `<tr><td colspan="7">Nenhum item encontrado.</td></tr>`;
}

function renderPDV() {
  const lista = data.items.filter(
    (i) => !ui.search || i.name.toLowerCase().includes(ui.search),
  );
  $("pdv-catalog").innerHTML = lista
    .map(
      (i) => `
    <div class="prod-card">
      <div>
        <strong>${escapar(i.name)}</strong>
        <p class="stock-info">Disp: ${i.quantity}</p>
      </div>
      <div>
        <div class="price">${formatarReal(i.price)}</div>
        <button type="button" class="btn primary sm full" data-action="carrinho-add" data-id="${i.id}"
          ${i.quantity <= 0 ? "disabled" : ""}>Adicionar</button>
      </div>
    </div>`,
    )
    .join("");
  renderCarrinho();
}

function renderCarrinho() {
  $("cart-list").innerHTML = ui.cart.length
    ? ui.cart
        .map(
          (c) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <span>${c.qty}x ${escapar(c.name)}</span>
          <div class="cart-item-controls">
            <button type="button" class="btn sm" data-action="carrinho-menos" data-id="${c.id}">-</button>
            <button type="button" class="btn sm" data-action="carrinho-mais" data-id="${c.id}">+</button>
            <button type="button" class="btn sm btn-delete" data-action="carrinho-remover" data-id="${c.id}">Remover</button>
          </div>
        </div>
        <strong>${formatarReal(c.qty * c.price)}</strong>
      </div>`,
        )
        .join("")
    : `<p class="empty-msg">Carrinho vazio</p>`;
  $("cart-total").textContent = formatarReal(totalDoCarrinho());
}

function renderVendas() {
  $("vendas-tbody").innerHTML = data.sales.length
    ? data.sales
        .map(
          (s) => `
      <tr>
        <td>${new Date(s.date).toLocaleString("pt-BR")}</td>
        <td>${formatarReal(s.total)}</td>
        <td>${escapar(s.paymentMethod)}</td>
        <td><button type="button" class="btn sm" data-action="ver-comprovante" data-id="${s.id}">Ver comprovante</button></td>
      </tr>`,
        )
        .join("")
    : `<tr><td colspan="4">Nenhuma venda registrada.</td></tr>`;
}

function renderCascos() {
  $("cascos-tbody").innerHTML = data.cascos
    .map(
      (c) => `
    <tr>
      <td><strong>${escapar(c.name)}</strong></td>
      <td>${c.cheios}</td>
      <td>${c.vazios}</td>
      <td>${c.comClientes}</td>
      <td><div class="btn-group">
        ${Object.entries(MOVIMENTOS_CASCO)
          .map(
            ([tipo, m]) => `
          <button type="button" class="btn sm" data-action="casco" data-tipo="${tipo}" data-id="${c.id}"
            ${c[m.de] <= 0 ? "disabled" : ""}>${m.rotulo}</button>`,
          )
          .join("")}
      </div></td>
    </tr>`,
    )
    .join("");
}

function renderTudo() {
  renderEstoque();
  renderPDV();
  renderVendas();
  renderCascos();
}

function mostrarComprovante(venda) {
  const c = data.config;
  $("nf-numero").textContent = String(venda.id).slice(-8);
  $("nf-data").textContent = new Date(venda.date).toLocaleString("pt-BR");
  $("nf-total").textContent = formatarReal(venda.total);
  $("nf-pagamento").textContent = venda.paymentMethod;
  $("nf-emitente").innerHTML = `
    <h3>Dados do Emitente</h3>
    <p><strong>${escapar(c.nome)}</strong></p>
    <p>CNPJ: ${escapar(c.cnpj)}</p>
    <p>Endereço: ${escapar(c.endereco)}</p>
    <p>Telefone: ${escapar(c.telefone)}</p>`;
  $("nf-itens").innerHTML = venda.items
    .map(
      (i) => `
    <tr>
      <td>${escapar(i.name)}</td>
      <td>${i.qty}</td>
      <td>${formatarReal(i.price)}</td>
      <td>${formatarReal(i.qty * i.price)}</td>
    </tr>`,
    )
    .join("");
  $("modal-nota-fiscal").showModal();
}

function preencherConfig() {
  $("config-nome").value = data.config.nome;
  $("config-cnpj").value = data.config.cnpj;
  $("config-endereco").value = data.config.endereco;
  $("config-telefone").value = data.config.telefone;
}

/* ---------- 6. EVENTOS ---------- */

function abrirTela(tela) {
  document
    .querySelectorAll(".menu-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === tela));
  document
    .querySelectorAll(".tab")
    .forEach((s) => s.classList.toggle("active", s.id === `tab-${tela}`));

  const info = TELAS[tela];
  $("page-title").textContent = info.titulo;
  $("page-help").textContent = info.ajuda;
  $("btn-novo-item").style.display = info.busca ? "block" : "none";
  $("search-input").style.display = info.busca ? "block" : "none";

  if (tela === "config") preencherConfig();
  renderTudo();
}

// Um único "ouvinte" para todos os botões das tabelas (dispensa onclick no HTML)
const ACOES = {
  "estoque-mais": (b) => ajustarEstoque(b.dataset.id, 1),
  "estoque-menos": (b) => ajustarEstoque(b.dataset.id, -1),
  "estoque-editar": (b) => abrirEdicao(b.dataset.id),
  "carrinho-add": (b) => adicionarAoCarrinho(b.dataset.id),
  "carrinho-mais": (b) => mudarQtdCarrinho(b.dataset.id, 1),
  "carrinho-menos": (b) => mudarQtdCarrinho(b.dataset.id, -1),
  "carrinho-remover": (b) => removerDoCarrinho(b.dataset.id),
  casco: (b) => moverCasco(b.dataset.id, b.dataset.tipo),
  "ver-comprovante": (b) => {
    const venda = achar(data.sales, b.dataset.id);
    if (venda) mostrarComprovante(venda);
  },
};

document.addEventListener("click", (e) => {
  const botao = e.target.closest("[data-action]");
  if (botao && ACOES[botao.dataset.action]) ACOES[botao.dataset.action](botao);
});

document
  .querySelectorAll(".menu-btn")
  .forEach((btn) =>
    btn.addEventListener("click", () => abrirTela(btn.dataset.tab)),
  );

document.querySelectorAll("#category-filters .chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    document
      .querySelectorAll("#category-filters .chip")
      .forEach((c) => c.classList.toggle("active", c === chip));
    ui.filterCat = chip.dataset.cat;
    renderEstoque();
  }),
);

$("search-input").addEventListener("input", (e) => {
  ui.search = e.target.value.trim().toLowerCase();
  renderEstoque();
  renderPDV();
});

$("btn-novo-item").addEventListener("click", () => {
  $("modal-item-title").textContent = "Novo Item";
  $("edit-id").value = "";
  $("form-item").reset();
  $("btn-excluir-item").style.display = "none";
  $("modal-item").showModal();
});
$("btn-cancelar-modal").addEventListener("click", () =>
  $("modal-item").close(),
);
$("btn-excluir-item").addEventListener("click", () => {
  const editId = $("edit-id").value;
  if (editId) excluirItem(editId);
});

$("form-item").addEventListener("submit", (e) => {
  e.preventDefault();
  cadastrarItem(e.target);
  e.target.reset();
  $("modal-item").close();
  renderTudo();
});

$("btn-finalizar-venda").addEventListener("click", finalizarVenda);

$("form-config").addEventListener("submit", (e) => {
  e.preventDefault();
  data.config = {
    nome: $("config-nome").value.trim(),
    cnpj: $("config-cnpj").value.trim(),
    endereco: $("config-endereco").value.trim(),
    telefone: $("config-telefone").value.trim(),
  };
  salvarDados();
  alert("Configurações salvas com sucesso!");
});

$("btn-fechar-nf").addEventListener("click", () =>
  $("modal-nota-fiscal").close(),
);
$("btn-imprimir-nf").addEventListener("click", () => window.print());

/* ---------- 7. INÍCIO ---------- */

abrirTela("estoque");
