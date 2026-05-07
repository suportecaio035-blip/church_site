// 1. Pega todos os links (tags <a>) que estão dentro da sua nav_bar
const links = document.querySelectorAll('.nav_bar a');

// 2. Descobre qual é o nome do arquivo atual (ex: member.html)
const pathAtual = window.location.pathname.split("/").pop();

// 3. Se o caminho estiver vazio (ex: apenas o domínio), define como index.html
const paginaAtiva = pathAtual === "" ? "index.html" : pathAtual;

links.forEach(link => {
    // 4. Verifica se o 'href' do link contém o nome da página atual
    if (link.getAttribute('href') === paginaAtiva) {
        // 5. Adiciona a classe .active ao BOTÃO que está dentro desse link
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
const SENHA_VALIDA = "301621"

botao.addEventListener("click", () => {

    const userDigitado = campoUser;
    const passDigitado = campoPass;

    if (userDigitado === LOGIN_VALIDO && passDigitado === SENHA_VALIDA){
        alert("Login realizado");
        window.location.href = "../html/land_page.html";
    }
    else{
        alert("Usuário ou senha inválidos!");
        campoPass.value = "";
        campoPass.value = "";
    }
});