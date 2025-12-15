<?php 
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/vitor/controller/GenericController.php";
require_once __DIR__ . "/vitor/controller/LivroController.php";
require_once __DIR__ . "/vitor/controller/UsuarioController.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$modulo = $_GET['modulo'] ?? null;

$mysqli = new mysqli("localhost", "root", "", "biblioteca");
if ($mysqli->connect_error) {
    echo json_encode(["erro" => true, "mensagem" => "Erro de conexão"]);
    exit; 
}

switch ($modulo) {
    case "usuario":
        $controller = new UsuarioController($mysqli);
        break;
    case "livro":
        $controller = new LivroController($mysqli);
        break;
    default:
        echo json_encode(["erro" => true, "mensagem" => "Módulo inválido"]);
        exit;
}

$dadosRecebidos = json_decode(file_get_contents("php://input"));

switch ($metodo) {
    case "POST":
        try {
            $controller->cadastrar($dadosRecebidos);
            echo json_encode(["erro" => false, "mensagem" => "Cadastrado com sucesso"]);
        } catch (Exception $e) {
            echo json_encode(["erro" => true, "mensagem" => $e->getMessage()]);
        }
        break;

    case "GET":
        try {
            $resultado = $controller->listar($dadosRecebidos);
            echo json_encode($resultado);
        } catch (Exception $e) {
            echo json_encode(["erro" => true, "mensagem" => $e->getMessage()]);
        }
        break;

    case "PUT":
        try {
            // Verificar se a solicitação é para alterar a disponibilidade
            if (isset($dadosRecebidos->id) && isset($dadosRecebidos->disponibilidade)) {
                // Se sim, chamamos o método de alterar a disponibilidade
                $controller->alterarDisponibilidade($dadosRecebidos);
                echo json_encode(["erro" => false, "mensagem" => "Disponibilidade alterada com sucesso"]);
            } else {
                // Se não, é um PUT normal para editar o livro
                $controller->alterar($dadosRecebidos);
                echo json_encode(["erro" => false, "mensagem" => "Alterado com sucesso"]);
            }
        } catch (Exception $e) {
            echo json_encode(["erro" => true, "mensagem" => $e->getMessage()]);
        }
        break;

    case "DELETE":
        try {
            $controller->remover($dadosRecebidos->id ?? null);
            echo json_encode(["erro" => false, "mensagem" => "Removido com sucesso"]);
        } catch (Exception $e) {
            echo json_encode(["erro" => true, "mensagem" => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(["erro" => true, "mensagem" => "Método não suportado"]);
}
exit;
?>
