<?php
require_once __DIR__ . "/classe_pai.php";

class Livro extends ClassePai {

    public $titulo;
    public $autor;
    public $editora;
    public $anoPublicacao;
    public $genero;
    public $localizacao;
    public $issn;
    public $disponibilidade;
    public $url;

    public function toEntity($dados){
        return new Livro(
            $dados['id'],
            $dados['titulo'],
            $dados['autor'],
            $dados['editora'],
            $dados['anoPublicacao'],
            $dados['genero'],
            $dados['localizacao'],
            $dados['issn'],
            $dados['disponibilidade'],
            $dados['url']
        );
    }

    public function __construct(
        $id,
        $titulo,
        $autor,
        $editora,
        $anoPublicacao,
        $genero,
        $localizacao,
        $ISSN,
        $disponibilidade,
        $URL
    ) {
        parent::__construct($id, "database/livros.txt");

        $this->titulo = $titulo;
        $this->autor = $autor;
        $this->editora = $editora;
        $this->anoPublicacao = $anoPublicacao;
        $this->genero = $genero;
        $this->localizacao = $localizacao;
        $this->issn = $ISSN;
        $this->disponibilidade = $disponibilidade;
        $this->url = $URL;
    }

    public function cadastrar($conn){
        $SQL = "INSERT INTO livro 
        (titulo, autor, editora, anoPublicacao, genero, localizacao, issn, disponibilidade, url)
        VALUES (
            '$this->titulo',
            '$this->autor',
            '$this->editora',
            '$this->anoPublicacao',
            '$this->genero',
            '$this->localizacao',
            '$this->issn',
            '$this->disponibilidade',
            '$this->url'
        )";

        $resultado = $conn->query($SQL);

        if($resultado){
            $this->id = $conn->insert_id;
        }
    }

    public function alterar($conn){
        $SQL = "UPDATE livro SET 
            titulo = '$this->titulo',
            autor = '$this->autor',
            editora = '$this->editora',
            anoPublicacao = '$this->anoPublicacao',
            genero = '$this->genero',
            localizacao = '$this->localizacao',
            issn = '$this->issn',
            url = '$this->url'
        WHERE id = $this->id";

        $conn->query($SQL);
    }

    static public function pegaPorId($id, $conn) {
        $id = intval($id);
        $SQL = "SELECT * FROM livro WHERE id = $id";
        $resultado = $conn->query($SQL);

        if($resultado && $dados = $resultado->fetch_array()){
            return new Livro(
                $dados['id'],
                $dados['titulo'],
                $dados['autor'],
                $dados['editora'],
                $dados['anoPublicacao'],
                $dados['genero'],
                $dados['localizacao'],
                $dados['issn'],
                $dados['disponibilidade'],
                $dados['url']
            );
        }
        return null;
    }

    static public function listar($filtroNome, $conn) {
        $filtroNome = $filtroNome ?? "";
        $SQL = "SELECT * FROM livro WHERE titulo LIKE '%$filtroNome%'";
        $resultado = $conn->query($SQL);

        $retorno = [];

        while($dados = $resultado->fetch_array()){
            $livro = new Livro(
                $dados['id'],
                $dados['titulo'],
                $dados['autor'],
                $dados['editora'],
                $dados['anoPublicacao'],
                $dados['genero'],
                $dados['localizacao'],
                $dados['issn'],
                $dados['disponibilidade'],
                $dados['url']
            );
            array_push($retorno, $livro);
        }
        return $retorno;
    }

public function alterarDisponibilidade($conn) {
    $SQL = "UPDATE livro SET disponibilidade = '$this->disponibilidade' WHERE id = $this->id";
    $conn->query($SQL);
}

public function remover($conn){
    $id = intval($this->id);
    $SQL = "DELETE FROM livro WHERE id = $id";
    return $conn->query($SQL);
}

}
