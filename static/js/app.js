import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config.js";

const LOGIN_VALIDO = "igreja_adm";
const SENHA_VALIDA = "301621";
const CONFIG_PENDENTE = SUPABASE_URL.includes("COLE_AQUI") || SUPABASE_ANON_KEY.includes("COLE_AQUI");
const supabase = CONFIG_PENDENTE ? null : createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function paginaAtual() {
    const nome = window.location.pathname.split("/").pop();
    return nome || "index.html";
}

function ativarMenuAtual() {
    const pagina = paginaAtual();

    $$(".nav_bar a").forEach((link) => {
        const href = link.getAttribute("href");
        const botao = link.querySelector(".btn_bar");

        if (botao && href === pagina) {
            botao.classList.add("active");
        }
    });
}

function configurarLogin() {
    const botao = $("#submit");
    const campoUser = $("#usuario");
    const campoPass = $("#senha");

    if (!botao || !campoUser || !campoPass) {
        return;
    }

    botao.addEventListener("click", () => {
        const userDigitado = campoUser.value;
        const passDigitado = campoPass.value;

        if (userDigitado === LOGIN_VALIDO && passDigitado === SENHA_VALIDA) {
            sessionStorage.setItem("logado", "true");
            window.location.href = "land_page.html";
            return;
        }

        alert("Usuário ou senha inválidos!");
        campoUser.value = "";
        campoPass.value = "";
    });
}

function avisarConfigPendente() {
    if (!CONFIG_PENDENTE) {
        return false;
    }

    const paginasComBanco = ["land_page.html", "member.html", "family.html", "rafflew.html", "birthday.html"];
    if (paginasComBanco.includes(paginaAtual())) {
        console.warn("Configure SUPABASE_URL e SUPABASE_ANON_KEY em static/js/supabase-config.js");
    }

    return true;
}

async function buscarFamilias() {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from("familias")
        .select("id, sobrenome, endereco")
        .order("sobrenome", { ascending: true });

    if (error) {
        alert(`Erro ao buscar famílias: ${error.message}`);
        return [];
    }

    return data || [];
}

async function buscarMembros() {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from("membros")
        .select("id, nome, telefone, nascimento, familia_id, familias(sobrenome, endereco)")
        .order("nome", { ascending: true });

    if (error) {
        alert(`Erro ao buscar membros: ${error.message}`);
        return [];
    }

    return data || [];
}

function preencherLista(elemento, itens, renderItem, vazio = "Nenhum registro encontrado.") {
    if (!elemento) {
        return;
    }

    elemento.innerHTML = "";

    if (!itens.length) {
        const item = document.createElement("li");
        item.textContent = vazio;
        elemento.appendChild(item);
        return;
    }

    itens.forEach((registro) => {
        const item = document.createElement("li");
        item.textContent = renderItem(registro);
        elemento.appendChild(item);
    });
}

function abrirEFecharDialog(abrirId, dialogId, fecharId) {
    const abrir = document.getElementById(abrirId);
    const dialog = document.getElementById(dialogId);
    const fechar = document.getElementById(fecharId);

    if (abrir && dialog) {
        abrir.addEventListener("click", () => dialog.showModal());
    }

    if (fechar && dialog) {
        fechar.addEventListener("click", () => dialog.close());
    }
}

async function iniciarFamilias() {
    const listaFamilias = $("#listaFamilias");
    const formFamilia = $("#formFamilia");
    const cadastroFamilia = $("#cadastroFamilia");
    const edicaoFamilia = $("#edicaoFamilia");
    const formEditarFamilia = $("#formEditarFamilia");
    const selectFamiliaEditar = $("#familiaEditar");
    const sobrenomeEditar = $("#sobrenomeEditar");
    const enderecoEditar = $("#enderecoEditar");
    const excluirFamilia = $("#excluirFamilia");

    if (!listaFamilias && !formFamilia) {
        return;
    }

    if (avisarConfigPendente()) {
        preencherLista(listaFamilias, [], () => "", "Configure o Supabase para carregar as famílias.");
        return;
    }

    let familias = [];

    abrirEFecharDialog("abrirCadastroFamilia", "cadastroFamilia", "fecharCadastroFamilia");
    abrirEFecharDialog("abrirEdicaoFamilia", "edicaoFamilia", "fecharEdicaoFamilia");

    function preencherSelectEdicao() {
        if (!selectFamiliaEditar) {
            return;
        }

        selectFamiliaEditar.innerHTML = '<option value="">Selecione uma família</option>';
        familias.forEach((familia) => {
            const option = document.createElement("option");
            option.value = familia.id;
            option.textContent = familia.sobrenome;
            selectFamiliaEditar.appendChild(option);
        });
    }

    async function renderizar() {
        familias = await buscarFamilias();
        preencherLista(listaFamilias, familias, (familia) => `${familia.sobrenome} - ${familia.endereco}`);
        preencherSelectEdicao();
    }

    if (selectFamiliaEditar) {
        selectFamiliaEditar.addEventListener("change", () => {
            const familia = familias.find((item) => item.id === Number(selectFamiliaEditar.value));

            sobrenomeEditar.value = familia?.sobrenome || "";
            enderecoEditar.value = familia?.endereco || "";
        });
    }

    if (formEditarFamilia) {
        formEditarFamilia.addEventListener("submit", async (event) => {
            event.preventDefault();

            const id = Number(selectFamiliaEditar.value);
            if (!id) {
                alert("Selecione uma família para editar.");
                return;
            }

            const { error } = await supabase
                .from("familias")
                .update({
                    sobrenome: sobrenomeEditar.value.trim(),
                    endereco: enderecoEditar.value.trim(),
                })
                .eq("id", id);

            if (error) {
                alert(`Erro ao editar família: ${error.message}`);
                return;
            }

            formEditarFamilia.reset();
            edicaoFamilia.close();
            await renderizar();
        });
    }

    if (excluirFamilia) {
        excluirFamilia.addEventListener("click", async () => {
            const id = Number(selectFamiliaEditar.value);
            const familia = familias.find((item) => item.id === id);

            if (!id || !familia) {
                alert("Selecione uma família para excluir.");
                return;
            }

            const confirmou = confirm(`Excluir a família ${familia.sobrenome}? Os membros vinculados a ela também serão excluídos.`);
            if (!confirmou) {
                return;
            }

            const { error } = await supabase
                .from("familias")
                .delete()
                .eq("id", id);

            if (error) {
                alert(`Erro ao excluir família: ${error.message}`);
                return;
            }

            formEditarFamilia.reset();
            edicaoFamilia.close();
            await renderizar();
        });
    }

    if (formFamilia) {
        formFamilia.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(formFamilia);
            const familia = {
                sobrenome: formData.get("sobrenome").trim(),
                endereco: formData.get("endereco").trim(),
            };

            const { error } = await supabase.from("familias").insert(familia);
            if (error) {
                alert(`Erro ao cadastrar família: ${error.message}`);
                return;
            }

            formFamilia.reset();
            cadastroFamilia.close();
            await renderizar();
        });
    }

    await renderizar();
}

async function iniciarMembros() {
    const listaMembros = $("#listaMembros");
    const selectFamilia = $("#familia");
    const formMembro = $("#formMembro");
    const cadastroMembro = $("#cadastroMembro");
    const buscaFamilia = $("#buscaFamilia");
    const exportarMembros = $("#exportarMembros");
    const formEditarMembro = $("#formEditarMembro");
    const edicaoMembro = $("#edicaoMembro");
    const selectMembroEditar = $("#membroEditar");
    const nomeEditar = $("#nomeEditar");
    const selectFamiliaEditarMembro = $("#familiaEditarMembro");
    const telefoneEditar = $("#telefoneEditar");
    const nascimentoEditar = $("#nascimentoEditar");
    const excluirMembro = $("#excluirMembro");

    if (!listaMembros && !formMembro) {
        return;
    }

    if (avisarConfigPendente()) {
        preencherLista(listaMembros, [], () => "", "Configure o Supabase para carregar os membros.");
        return;
    }

    let membros = [];
    let familias = [];

    abrirEFecharDialog("abrirCadastroMembro", "cadastroMembro", "fecharCadastroMembro");
    abrirEFecharDialog("abrirEdicaoMembro", "edicaoMembro", "fecharEdicaoMembro");

    function preencherSelectFamilias(select, textoInicial = "Selecione uma família") {
        if (!select) {
            return;
        }

        select.innerHTML = `<option value="">${textoInicial}</option>`;
        familias.forEach((familia) => {
            const option = document.createElement("option");
            option.value = familia.id;
            option.textContent = familia.sobrenome;
            select.appendChild(option);
        });
    }

    function preencherSelectMembros() {
        if (!selectMembroEditar) {
            return;
        }

        selectMembroEditar.innerHTML = '<option value="">Selecione um membro</option>';
        membros.forEach((membro) => {
            const option = document.createElement("option");
            option.value = membro.id;
            option.textContent = membro.nome;
            selectMembroEditar.appendChild(option);
        });
    }

    async function carregarFamiliasNoSelect() {
        familias = await buscarFamilias();
        preencherSelectFamilias(selectFamilia);
        preencherSelectFamilias(selectFamiliaEditarMembro);
    }

    function renderizar(lista = membros) {
        preencherLista(listaMembros, lista, (membro) => `${membro.nome} - ${membro.telefone}`);
        preencherSelectMembros();
    }

    async function carregarMembros() {
        membros = await buscarMembros();
        renderizar();
    }

    if (selectMembroEditar) {
        selectMembroEditar.addEventListener("change", () => {
            const membro = membros.find((item) => item.id === Number(selectMembroEditar.value));

            nomeEditar.value = membro?.nome || "";
            telefoneEditar.value = membro?.telefone || "";
            nascimentoEditar.value = membro?.nascimento || "";
            selectFamiliaEditarMembro.value = membro?.familia_id || "";
        });
    }

    if (formEditarMembro) {
        formEditarMembro.addEventListener("submit", async (event) => {
            event.preventDefault();

            const id = Number(selectMembroEditar.value);
            if (!id) {
                alert("Selecione um membro para editar.");
                return;
            }

            const { error } = await supabase
                .from("membros")
                .update({
                    nome: nomeEditar.value.trim(),
                    telefone: telefoneEditar.value.trim(),
                    nascimento: nascimentoEditar.value,
                    familia_id: Number(selectFamiliaEditarMembro.value),
                })
                .eq("id", id);

            if (error) {
                alert(`Erro ao editar membro: ${error.message}`);
                return;
            }

            formEditarMembro.reset();
            edicaoMembro.close();
            await carregarMembros();
        });
    }

    if (excluirMembro) {
        excluirMembro.addEventListener("click", async () => {
            const id = Number(selectMembroEditar.value);
            const membro = membros.find((item) => item.id === id);

            if (!id || !membro) {
                alert("Selecione um membro para excluir.");
                return;
            }

            const confirmou = confirm(`Excluir o membro ${membro.nome}?`);
            if (!confirmou) {
                return;
            }

            const { error } = await supabase
                .from("membros")
                .delete()
                .eq("id", id);

            if (error) {
                alert(`Erro ao excluir membro: ${error.message}`);
                return;
            }

            formEditarMembro.reset();
            edicaoMembro.close();
            await carregarMembros();
        });
    }

    if (formMembro) {
        formMembro.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(formMembro);
            const membro = {
                nome: formData.get("nome").trim(),
                telefone: formData.get("telefone").trim(),
                nascimento: formData.get("nascimento"),
                familia_id: Number(formData.get("familia")),
            };

            const { error } = await supabase.from("membros").insert(membro);
            if (error) {
                alert(`Erro ao cadastrar membro: ${error.message}`);
                return;
            }

            formMembro.reset();
            cadastroMembro.close();
            await carregarMembros();
        });
    }

    if (buscaFamilia) {
        buscaFamilia.addEventListener("input", () => {
            const busca = buscaFamilia.value.trim().toLowerCase();
            const filtrados = membros.filter((membro) => {
                const familia = membro.familias?.sobrenome || "";
                return familia.toLowerCase().includes(busca);
            });
            renderizar(filtrados);
        });
    }

    if (exportarMembros) {
        exportarMembros.addEventListener("click", () => exportarCsv(membros));
    }

    await carregarFamiliasNoSelect();
    await carregarMembros();
}

function escaparCsv(valor) {
    const texto = String(valor ?? "");
    return `"${texto.replaceAll('"', '""')}"`;
}

function exportarCsv(membros) {
    const cabecalho = ["Nome do membro", "Telefone", "Endereco", "Familia"];
    const linhas = membros.map((membro) => [
        membro.nome,
        membro.telefone,
        membro.familias?.endereco || "",
        membro.familias?.sobrenome || "",
    ]);

    const csv = [cabecalho, ...linhas]
        .map((linha) => linha.map(escaparCsv).join(";"))
        .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "membros.csv";
    link.click();
    URL.revokeObjectURL(url);
}

function partesData(data) {
    if (!data) {
        return null;
    }

    const [ano, mes, dia] = data.split("-").map(Number);
    return { ano, mes, dia };
}

function formatarAniversario(membro) {
    const data = partesData(membro.nascimento);
    const familia = membro.familias?.sobrenome ? ` - Família ${membro.familias.sobrenome}` : "";
    return `${membro.nome} - ${String(data.dia).padStart(2, "0")}/${String(data.mes).padStart(2, "0")}${familia}`;
}

async function iniciarAniversarios() {
    const listaHoje = $("#aniversariantesHoje");
    const listaMes = $("#aniversariantesMes");
    const totalMembros = $("#totalMembros");

    if (!listaHoje && !listaMes && !totalMembros) {
        return;
    }

    if (avisarConfigPendente()) {
        preencherLista(listaHoje, [], () => "", "Configure o Supabase para carregar os aniversários.");
        preencherLista(listaMes, [], () => "", "Configure o Supabase para carregar os aniversários.");
        return;
    }

    const membros = await buscarMembros();
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.getMonth() + 1;

    const aniversariantesHoje = membros.filter((membro) => {
        const data = partesData(membro.nascimento);
        return data && data.dia === diaAtual && data.mes === mesAtual;
    });

    const aniversariantesMes = membros
        .filter((membro) => {
            const data = partesData(membro.nascimento);
            return data && data.mes === mesAtual;
        })
        .sort((a, b) => partesData(a.nascimento).dia - partesData(b.nascimento).dia);

    preencherLista(listaHoje, aniversariantesHoje, formatarAniversario, "Nenhum aniversariante hoje.");
    preencherLista(listaMes, aniversariantesMes, formatarAniversario, "Nenhum aniversariante neste mês.");

    if (totalMembros) {
        totalMembros.textContent = membros.length;
    }
}

async function iniciarSorteio() {
    const botaoSortear = $("#sortearFamilia");
    const familiaSorteada = $("#familiaSorteada");
    const enderecoFamiliaSorteada = $("#enderecoFamiliaSorteada");

    if (!botaoSortear) {
        return;
    }

    if (avisarConfigPendente()) {
        return;
    }

    botaoSortear.addEventListener("click", async () => {
        const familias = await buscarFamilias();

        if (!familias.length) {
            familiaSorteada.textContent = "Nenhuma família cadastrada.";
            enderecoFamiliaSorteada.textContent = "";
            return;
        }

        const sorteada = familias[Math.floor(Math.random() * familias.length)];
        familiaSorteada.textContent = sorteada.sobrenome;
        enderecoFamiliaSorteada.textContent = sorteada.endereco;
    });
}

ativarMenuAtual();
configurarLogin();
iniciarFamilias();
iniciarMembros();
iniciarAniversarios();
iniciarSorteio();
