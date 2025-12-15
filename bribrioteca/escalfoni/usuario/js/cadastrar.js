const btnCadastrarUsuario = document.querySelector("#cadastrarUsuario");

function Usuario(nome, email, senha) {
  this.nome = nome;
  this.email = email;
  this.senha = senha;
}

async function cadastrarUsuario(event) {
  event.preventDefault();

  const url = "http://localhost/bribrioteca/?modulo=usuario";

  const nome = document.querySelector("#novoNome").value;
  const email = document.querySelector("#novoEmail").value;
  const senha = document.querySelector("#novaSenha").value;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(new Usuario(nome, email, senha)),
  });

  const retorno = await response.json();
  console.log(retorno);
  alert(retorno.mensagem);
}

btnCadastrarUsuario.addEventListener("click", cadastrarUsuario);
