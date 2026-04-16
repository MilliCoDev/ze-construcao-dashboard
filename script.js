const usuarioAdmin = window.APP_CONFIG.auth.username;
const senhaAdmin = window.APP_CONFIG.auth.password;

const loginBox = document.getElementById("loginBox");
const painelSistema = document.getElementById("painelSistema");
const mensagemSistema = document.getElementById("mensagemSistema");
const estoqueBody = document.getElementById("estoqueBody");
const vendasBody = document.getElementById("vendasBody");
const produtoVenda = document.getElementById("produtoVenda");
const valorCaixa = document.getElementById("valorCaixa");
const valorTotalVendido = document.getElementById("valorTotalVendido");
const quantidadeVendas = document.getElementById("quantidadeVendas");
const modalConfirmacao = document.getElementById("modalConfirmacao");

const estado = {
    produtos: [],
    vendas: [],
    totalCaixa: 0
};

document.getElementById("loginForm").addEventListener("submit", onLoginSubmit);
document.getElementById("sairBtn").addEventListener("click", onSairClick);
document.getElementById("cadastroForm").addEventListener("submit", onCadastroSubmit);
document.getElementById("vendaForm").addEventListener("submit", onVendaSubmit);
document.getElementById("exportarCsvBtn").addEventListener("click", exportarVendasCsv);
document.getElementById("limparDadosBtn").addEventListener("click", limparDadosSistema);
document.getElementById("confirmarLimpezaBtn").addEventListener("click", confirmarLimpezaDados);
document.getElementById("cancelarLimpezaBtn").addEventListener("click", fecharModalLimpeza);

carregarDados();
renderizarTudo();

function onLoginSubmit(event) {
    event.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    if (usuario === usuarioAdmin && senha === senhaAdmin) {
        mensagem.style.color = "green";
        mensagem.textContent = "Login realizado com sucesso.";
        loginBox.classList.add("oculto");
        painelSistema.classList.add("ativo");
        return;
    }

    mensagem.style.color = "red";
    mensagem.textContent = "Usuário ou senha inválidos.";
}

function onSairClick() {
    painelSistema.classList.remove("ativo");
    loginBox.classList.remove("oculto");
    document.getElementById("loginForm").reset();
    document.getElementById("mensagem").textContent = "";
    mensagemSistema.textContent = "";
}

function onCadastroSubmit(event) {
    event.preventDefault();
    const nomeProduto = document.getElementById("nomeProduto").value.trim();
    const qtdProduto = Number(document.getElementById("qtdProduto").value);
    const precoProduto = Number(document.getElementById("precoProduto").value);

    if (!nomeProduto || qtdProduto <= 0 || precoProduto <= 0) {
        mostrarMensagemSistema("Dados do cadastro inválidos.", "erro");
        return;
    }

    const produtoExistente = estado.produtos.find((produto) => produto.nome.toLowerCase() === nomeProduto.toLowerCase());
    if (produtoExistente) {
        produtoExistente.quantidade += qtdProduto;
        produtoExistente.preco = precoProduto;
    } else {
        estado.produtos.push({ nome: nomeProduto, quantidade: qtdProduto, preco: precoProduto });
    }

    salvarDados();
    renderizarTudo();
    document.getElementById("cadastroForm").reset();
    mostrarMensagemSistema("Produto cadastrado/atualizado com sucesso.", "sucesso");
}

function onVendaSubmit(event) {
    event.preventDefault();
    const produtoSelecionado = produtoVenda.value;
    const qtdVenda = Number(document.getElementById("qtdVenda").value);
    const produto = estado.produtos.find((item) => item.nome === produtoSelecionado);

    if (!produtoSelecionado || !produto || qtdVenda <= 0) {
        mostrarMensagemSistema("Dados da venda inválidos.", "erro");
        return;
    }

    if (qtdVenda > produto.quantidade) {
        mostrarMensagemSistema("Estoque insuficiente para essa venda.", "erro");
        return;
    }

    const valorVenda = qtdVenda * produto.preco;
    produto.quantidade -= qtdVenda;
    estado.totalCaixa += valorVenda;
    estado.vendas.unshift({
        data: new Date().toISOString(),
        produto: produto.nome,
        quantidade: qtdVenda,
        valorUnitario: produto.preco,
        total: valorVenda
    });

    salvarDados();
    renderizarTudo();
    document.getElementById("vendaForm").reset();
    mostrarMensagemSistema("Venda registrada com sucesso.", "sucesso");
}

function atualizarTabelaEstoque() {
    if (estado.produtos.length === 0) {
        estoqueBody.innerHTML = "<tr><td colspan='2'>Nenhum produto cadastrado.</td></tr>";
        return;
    }

    estoqueBody.innerHTML = estado.produtos
        .map((produto) => "<tr><td>" + produto.nome + "</td><td>" + produto.quantidade + "</td></tr>")
        .join("");
}

function atualizarTabelaVendas() {
    if (estado.vendas.length === 0) {
        vendasBody.innerHTML = "<tr><td colspan='5'>Nenhuma venda registrada.</td></tr>";
        return;
    }

    vendasBody.innerHTML = estado.vendas
        .map((venda) =>
            "<tr><td>" +
            formatarData(venda.data) +
            "</td><td>" +
            venda.produto +
            "</td><td>" +
            venda.quantidade +
            "</td><td>" +
            formatarMoeda(venda.valorUnitario) +
            "</td><td>" +
            formatarMoeda(venda.total) +
            "</td></tr>"
        )
        .join("");
}

function atualizarResumoFinanceiro() {
    const totalVendido = estado.vendas.reduce((soma, venda) => soma + venda.total, 0);
    valorCaixa.textContent = formatarMoeda(estado.totalCaixa);
    valorTotalVendido.textContent = formatarMoeda(totalVendido);
    quantidadeVendas.textContent = String(estado.vendas.length);
}

function atualizarProdutosVenda() {
    produtoVenda.innerHTML = "<option value=''>Selecione um produto</option>";
    estado.produtos.forEach((produto) => {
        const option = document.createElement("option");
        option.value = produto.nome;
        option.textContent = produto.nome;
        produtoVenda.appendChild(option);
    });
}

function renderizarTudo() {
    atualizarTabelaEstoque();
    atualizarTabelaVendas();
    atualizarResumoFinanceiro();
    atualizarProdutosVenda();
}

function mostrarMensagemSistema(texto, tipo) {
    mensagemSistema.textContent = texto;
    mensagemSistema.className = tipo === "sucesso" ? "sucesso" : "erro";
}

function salvarDados() {
    window.dataGateway.save(estado);
}

function carregarDados() {
    const dados = window.dataGateway.load();
    if (!dados) {
        return;
    }

    estado.produtos = Array.isArray(dados.produtos) ? dados.produtos : [];
    estado.vendas = Array.isArray(dados.vendas) ? dados.vendas : [];
    estado.totalCaixa = Number(dados.totalCaixa) || 0;
}

function limparDadosSistema() {
    modalConfirmacao.classList.remove("oculto");
}

function confirmarLimpezaDados() {
    estado.produtos = [];
    estado.vendas = [];
    estado.totalCaixa = 0;
    window.dataGateway.clear();
    renderizarTudo();
    fecharModalLimpeza();
    mostrarMensagemSistema("Dados do sistema foram limpos.", "sucesso");
}

function fecharModalLimpeza() {
    modalConfirmacao.classList.add("oculto");
}

function exportarVendasCsv() {
    if (estado.vendas.length === 0) {
        mostrarMensagemSistema("Não há vendas para exportar.", "erro");
        return;
    }

    const cabecalho = ["data_hora", "produto", "quantidade", "valor_unitario", "total_venda"];
    const linhas = estado.vendas.map((venda) => [
        formatarData(venda.data),
        venda.produto,
        String(venda.quantidade),
        venda.valorUnitario.toFixed(2),
        venda.total.toFixed(2)
    ]);
    const conteudo = [cabecalho, ...linhas]
        .map((colunas) => colunas.map((coluna) => "\"" + String(coluna).replaceAll("\"", "\"\"") + "\"").join(";"))
        .join("\n");

    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "registro-de-vendas.csv";
    link.click();
    URL.revokeObjectURL(url);

    mostrarMensagemSistema("CSV exportado com sucesso.", "sucesso");
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(dataIsoOuDate) {
    return new Date(dataIsoOuDate).toLocaleString("pt-BR");
}
