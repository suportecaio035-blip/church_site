# Configuração do Supabase

Este projeto agora roda como site estático: HTML, CSS e JavaScript. Ele pode ser hospedado no GitHub Pages.

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto.
3. Abra o menu SQL Editor.
4. Copie o conteúdo de `supabase-schema.sql`.
5. Cole no SQL Editor e execute.

Isso cria as tabelas:

- `familias`
- `membros`

## 2. Configurar a conexão no site

No Supabase, vá em:

Project Settings -> Data API

Copie:

- Project URL
- anon public key

Depois edite o arquivo:

```txt
static/js/supabase-config.js
```

E troque:

```js
export const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SUPABASE";
export const SUPABASE_ANON_KEY = "COLE_AQUI_A_CHAVE_ANON_PUBLIC_DO_SUPABASE";
```

pelos valores do seu projeto.

## 3. Rodar localmente

Como o projeto usa JavaScript modules, abra com uma extensão de servidor estático, por exemplo o Live Server do VS Code.

Depois acesse a URL local que a extensão mostrar no navegador.

## 4. Publicar no GitHub Pages

1. Faça commit dos arquivos.
2. Suba para o GitHub.
3. Vá em Settings -> Pages.
4. Em Source, escolha a branch principal e a pasta root.
5. Salve.

O GitHub vai gerar uma URL pública para o site.

## Observação sobre segurança

O login atual continua sendo simples no JavaScript, igual ao projeto original. Isso funciona para uso interno e pequeno, mas não é uma autenticação forte. Como o banco está no Supabase, as permissões do arquivo `supabase-schema.sql` permitem leitura e cadastro usando a chave pública do site.

Para uma versão mais segura, o próximo passo seria usar Supabase Auth.
