<?php

require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;

define('SECRET_KEY', 'sua_chave_secreta');

function gerarToken($usuario_id)
{
    $payload = array(
        "usuario_id" => $usuario_id,
        "exp" => time() + 3600
    );

    return JWT::encode($payload, SECRET_KEY, 'HS256');
}


$servidor = "localhost";
$usuario_bd = "root";
$senha_bd = "";
$banco_de_dados = "gestor_atividades";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

try {
    $conexao = new PDO("mysql:host=$servidor;dbname=$banco_de_dados", $usuario_bd, $senha_bd);
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["mensagem" => "Erro na conexão com o banco de dados: " . $e->getMessage()]);
    exit();
}

$metodo_requisicao = $_SERVER["REQUEST_METHOD"];
switch ($metodo_requisicao) {
    case 'OPTIONS':
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        break;
    case 'POST':
        $dados = file_get_contents("php://input");
        $credenciais = json_decode($dados, true);

        $consulta = $conexao->prepare("SELECT id FROM usuarios WHERE login = :login AND senha = :senha");
        $consulta->bindParam(':login', $credenciais['login']);
        $consulta->bindParam(':senha', $credenciais['senha']);
        $consulta->execute();
        $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            $token = gerarToken($usuario['id']);
            echo json_encode(array("token" => $token));
            exit;
        } else {
            http_response_code(401);
            echo json_encode(array("mensagem" => "Credenciais inválidas"));
            exit;
        }
    default:
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido']);
        break;
}

exit;
?>