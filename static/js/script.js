// 1. Pega todos os links (tags <a>) que estão dentro da sua nav_bar
const links = document.querySelectorAll('.nav_bar a');

// 2. Descobre qual é a rota atual no Django.
const normalizarRota = (rota) => {
    if (!rota || rota === "/") {
        return "/";
    }

    return rota.endsWith("/") ? rota.slice(0, -1) : rota;
};

const paginaAtiva = normalizarRota(window.location.pathname);

links.forEach(link => {
    // 3. Verifica se o 'href' do link bate com a rota atual.
    if (normalizarRota(link.pathname) === paginaAtiva) {
        // 4. Adiciona a classe .active ao BOTÃO que está dentro desse link.
        const botao = link.querySelector('.btn_bar');
        if (botao) {
            botao.classList.add('active');
        }
    }
});


const botao = document.getElementById("submit");
const campoUser = document.getElementById("usuario");
const campoPass = document.getElementById("senha");

const LOGIN_VALIDO = "igreja_adm";
const SENHA_VALIDA = "301621";

const abrirCadastroMembro = document.getElementById("abrirCadastroMembro");
const fecharCadastroMembro = document.getElementById("fecharCadastroMembro");
const cadastroMembro = document.getElementById("cadastroMembro");

if (abrirCadastroMembro && cadastroMembro) {
    abrirCadastroMembro.addEventListener("click", () => {
        cadastroMembro.showModal();
    });
}

if (fecharCadastroMembro && cadastroMembro) {
    fecharCadastroMembro.addEventListener("click", () => {
        cadastroMembro.close();
    });
}

if (botao && campoUser && campoPass) {
    botao.addEventListener("click", () => {

        const userDigitado = campoUser.value;
        const passDigitado = campoPass.value;

        if (userDigitado === LOGIN_VALIDO && passDigitado === SENHA_VALIDA) {
            window.location.href = "/membros/";
        }
        else {
            alert("Usuário ou senha inválidos!");
            campoUser.value = "";
            campoPass.value = "";
        }
    });
}
