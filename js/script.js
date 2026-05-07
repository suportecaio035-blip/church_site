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