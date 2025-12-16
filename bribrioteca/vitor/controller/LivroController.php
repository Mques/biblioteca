<?php
require_once __DIR__ . "/GenericController.php";
require_once __DIR__ . "/../model/livro.class.php";

class LivroController implements GenericController {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    function cadastrar($dadosRecebidos) {
        $livro = new Livro(
            null,
            $dadosRecebidos->titulo,
            $dadosRecebidos->autor,
            $dadosRecebidos->editora,
            $dadosRecebidos->anoPublicacao,
            $dadosRecebidos->genero,
            $dadosRecebidos->localizacao,
            $dadosRecebidos->issn,
            "Sim",
            $dadosRecebidos->url
        );
        $livro->cadastrar($this->conn);
        return ["sucesso" => true];
    }

    function listar($dadosRecebidos) {
        $filtro = $dadosRecebidos ?? "";
        return Livro::listar($filtro, $this->conn);
    }

    function alterar($dadosRecebidos) {
        $livro = Livro::pegaPorId($dadosRecebidos->id, $this->conn);
        if (!$livro) {
            return ["erro" => true, "mensagem" => "Livro não encontrado"];
        }

        $livro->titulo = $dadosRecebidos->titulo;
        $livro->autor = $dadosRecebidos->autor;
        $livro->editora = $dadosRecebidos->editora;
        $livro->anoPublicacao = $dadosRecebidos->anoPublicacao;
        $livro->genero = $dadosRecebidos->genero;
        $livro->localizacao = $dadosRecebidos->localizacao;
        $livro->issn = $dadosRecebidos->issn;
        $livro->url = $dadosRecebidos->url;

        $livro->alterar($this->conn);
        return ["sucesso" => true];
    }

public function alterarDisponibilidade($dados) {
    $livro = Livro::pegaPorId($dados->id, $this->conn);
    if (!$livro) {
        throw new Exception("Livro não encontrado");
    }
    $livro->disponibilidade = $dados->disponibilidade;
    $livro->alterarDisponibilidade($this->conn);  
}

    function remover($id) {
        $livro = Livro::pegaPorId($id, $this->conn);
        if ($livro) {
            $livro->remover($this->conn);
            return ["sucesso" => true];
        }
        return ["erro" => true, "mensagem" => "Livro não encontrado"];
    }
}
?>
