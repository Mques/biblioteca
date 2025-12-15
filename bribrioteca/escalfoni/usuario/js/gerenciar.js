const btnConsultarUsuarios = document.querySelector("#consultarUsuarios");
const btnListarTodosUsuarios = document.querySelector("#listarUsuarios");

const URL_API = "http://localhost/bribrioteca/?modulo=usuario";

function resetarDiv(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function criarTabela(usuarios, div) {
  const tabela = document.createElement("table");
  const nomesColunas = document.createElement("tr");
  ["Nome", "E-mail", "Senha", "Ações"].forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    nomesColunas.appendChild(th);
  });
  tabela.appendChild(nomesColunas);

  usuarios.forEach(usuario => {
    const linha = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = usuario.nome;
    linha.appendChild(tdNome);

    const tdEmail = document.createElement("td");
    tdEmail.textContent = usuario.email;
    linha.appendChild(tdEmail);

    const tdSenha = document.createElement("td");
    tdSenha.textContent = usuario.senha;
    linha.appendChild(tdSenha);

    const tdAcoes = document.createElement("td");
    const btnAlterar = document.createElement("button");
    btnAlterar.textContent = "Alterar";
    btnAlterar.dataset.id = usuario.id;
    btnAlterar.addEventListener("click", carregarDadosAlterar);
    tdAcoes.appendChild(btnAlterar);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.dataset.id = usuario.id;
    btnExcluir.addEventListener("click", excluirUsuario);
    tdAcoes.appendChild(btnExcluir);

    linha.appendChild(tdAcoes);

    tabela.appendChild(linha);
  });

  div.appendChild(tabela);
}

function filtrarUsuarios(usuarios, filtro) {
  filtro = filtro.toLowerCase();
  return usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(filtro) ||
    usuario.email.toLowerCase().includes(filtro)
  );
}

async function consultarUsuarios() {
  const response = await fetch(URL_API);
  const usuarios = await response.json();
  const div = document.querySelector("#saidaBusca");
  const filtro = document.querySelector("#busca").value;
  resetarDiv(div);
  criarTabela(filtrarUsuarios(usuarios, filtro), div);
}

async function listarTodos() {
  const response = await fetch(URL_API);
  const usuarios = await response.json();
  const div = document.querySelector("#saidaBusca");
  resetarDiv(div);
  criarTabela(usuarios, div);
}

async function excluirUsuario() {
  const id = this.dataset.id;
  if (!id) return alert("ID do usuário não encontrado");
  if (!confirm("Deseja realmente excluir este usuário?")) return;

  try {
    const response = await fetch(URL_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    const text = await response.text();
    let resultado = null;

    try {
      resultado = JSON.parse(text);
    } catch (e) {
      throw new Error('Resposta inválida do servidor: ' + text);
    }

    if (resultado.erro) {
      mostrarPopupErro("Erro ao excluir usuário: " + resultado.mensagem);
    } else {
      alert("Usuário excluído com sucesso!");
      listarTodos();
    }
  } catch (e) {
    console.error("Erro ao excluir usuário:", e);
    mostrarPopupErro("Erro ao excluir usuário: " + e.message);
  }
}

function carregarDadosAlterar() {
  const id = this.dataset.id;
  fetch(`${URL_API}&id=${id}`)
    .then(response => response.json())
    .then(usuario => {
      if (usuario) {
        document.querySelector("#editNome").value = usuario.nome;
        document.querySelector("#editEmail").value = usuario.email;
        document.querySelector("#editSenha").value = usuario.senha;

        const form = document.querySelector("#formAlterarUsuario");
        form.style.display = "block";

        const btnSalvar = document.querySelector("#formAlterarUsuario button");
        btnSalvar.onclick = (e) => {
          e.preventDefault();
          alterarUsuario(id);
        };

        const btnCancelar = document.querySelector("#cancelarEdicao");
        btnCancelar.onclick = () => {
          form.style.display = "none";
        };
      } else {
        alert("Usuário não encontrado");
      }
    });
}

async function alterarUsuario(id) {
  const nome = document.querySelector("#editNome").value;
  const email = document.querySelector("#editEmail").value;
  const senha = document.querySelector("#editSenha").value;

  const usuario = { id, nome, email, senha };

  try {
    const response = await fetch(URL_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    const text = await response.text();
    let resultado = null;

    try {
      resultado = JSON.parse(text);
    } catch (e) {
      throw new Error('Resposta inválida do servidor: ' + text);
    }

    if (resultado.erro) {
      mostrarPopupErro("Erro ao alterar usuário: " + resultado.mensagem);
    } else {
      alert("Usuário alterado com sucesso!");
      listarTodos();
      document.querySelector("#formAlterarUsuario").style.display = "none";
    }
  } catch (e) {
    console.error("Erro ao alterar usuário:", e);
    mostrarPopupErro("Erro ao alterar usuário: " + e.message);
  }
}

btnConsultarUsuarios.addEventListener("click", consultarUsuarios);
btnListarTodosUsuarios.addEventListener("click", listarTodos);
