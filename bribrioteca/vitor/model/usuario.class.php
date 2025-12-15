<?php
require_once __DIR__ . "/classe_pai.php";

class Usuario extends ClassePai {

    public $id;
    public $nome;
    public $email;
    public $senha;

    public function toEntity($dados) {
        return new Usuario(
            $dados['id'],
            $dados['nome'],
            $dados['email'],
            $dados['senha']
        );
    }

    public function cadastrar($conn) {
        $SQL = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($SQL);
        $stmt->bind_param("sss", $this->nome, $this->email, $this->senha);
        $resultado = $stmt->execute();

        if ($resultado) {
            $this->id = $conn->insert_id;
        }
    }

    public function alterar($conn) {
        $SQL = "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?";
        $stmt = $conn->prepare($SQL);
        $stmt->bind_param("sssi", $this->nome, $this->email, $this->senha, $this->id);
        $stmt->execute();
    }

    static public function pegaPorId($id, $conn) {
        $id = intval($id);
        $SQL = "SELECT * FROM usuarios WHERE id = ?";
        $stmt = $conn->prepare($SQL);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado && $dados = $resultado->fetch_array()) {
            return new Usuario(
                $dados['id'],
                $dados['nome'],
                $dados['email'],
                $dados['senha']
            );
        }
        return null;
    }

    public function __construct($id, $nome, $email, $senha) {
        parent::__construct($id, "database/usuarios.txt");
        $this->nome = $nome;
        $this->email = $email;
        $this->senha = $senha;
    }

    static public function listar($filtroNome, $conn) {
        $SQL = "SELECT * FROM usuarios WHERE nome LIKE ?";
        $stmt = $conn->prepare($SQL);
        $filtroNome = "%$filtroNome%";
        $stmt->bind_param("s", $filtroNome);
        $stmt->execute();
        $resultado = $stmt->get_result();

        $retorno = [];
        while ($dados = $resultado->fetch_array()) {
            $usuario = new Usuario(
                $dados['id'],
                $dados['nome'],
                $dados['email'],
                $dados['senha']
            );
            array_push($retorno, $usuario);
        }
        return $retorno;
    }

    public function remover($conn) {
        $SQL = "DELETE FROM usuarios WHERE id = ?";
        $stmt = $conn->prepare($SQL);
        $stmt->bind_param("i", $this->id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            return true;
        } else {
            throw new Exception("Erro ao excluir usuário.");
        }
    }
}
?>
