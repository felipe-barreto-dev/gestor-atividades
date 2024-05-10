<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
// Definindo o cabeçalho para permitir acesso de qualquer origem (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Conexão com o banco de dados
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco_de_dados = "gestor_atividades";

try {
    $conexao = new PDO("mysql:host=$servidor;dbname=$banco_de_dados", $usuario, $senha);
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["mensagem" => "Erro na conexão com o banco de dados: " . $e->getMessage()]);
    exit();
}

// Função para adicionar uma nova usuario
function adicionarUsuario($conexao, $dados)
{
    $usuario = json_decode($dados, true);
    $consulta = $conexao->prepare("INSERT INTO usuarios (login, senha, nome, sobrenome, data_nascimento) VALUES (:login, :senha, :nome, :sobrenome, :data_nascimento)");
    $consulta->bindParam(':login', $usuario['login']);
    $consulta->bindValue(':senha', $usuario['senha']);
    $consulta->bindParam(':nome', $usuario['nome']);
    $consulta->bindParam(':sobrenome', $usuario['sobrenome']);
    $consulta->bindParam(':data_nascimento', $usuario['data_nascimento']);
    $consulta->execute();
    return json_encode(['mensagem' => 'Usuario adicionada com sucesso']);
}

function verificarToken()
{
    $token = null;

    $headers = apache_request_headers();

    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }

    if ($token) {
        try {
            $decoded = JWT::decode($token, new Key(SECRET_KEY, 'HS256'));

            return $decoded->usuario_id;
        } catch (Exception $e) {
            http_response_code(401); // Unauthorized
            echo json_encode(array("mensagem" => "Token inválido"));
            exit;
        }
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(array("mensagem" => "Token não fornecido"));
        exit;
    }
}

// Roteamento das solicitações
$metodo_requisicao = $_SERVER["REQUEST_METHOD"];
switch ($metodo_requisicao) {
    case 'OPTIONS':
        // Requisição preflight, retornar os cabeçalhos CORS permitidos
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        break;
    case 'POST':
        $dados = file_get_contents("php://input");
        echo adicionarUsuario($conexao, $dados);
        break;
    case 'GET':
        $token = $_SERVER["HTTP_AUTHORIZATION"];
        if ($token) {
            try {
                $usuario_id = verificarToken();

                $consulta = $conexao->prepare("SELECT nome FROM usuarios WHERE id = :id");
                $consulta->bindParam(':id', $usuario_id);
                $consulta->execute();
                $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

                if ($usuario) {
                    echo json_encode(array("nome" => $usuario['nome']));
                    exit;
                } else {
                    http_response_code(404);
                    echo json_encode(array("mensagem" => "Usuário não encontrado"));
                    exit;
                }
            } catch (Exception $e) {
                http_response_code(401);
                echo json_encode(array("mensagem" => "Token inválido"));
                exit;
            }
        } else {
            http_response_code(401);
            echo json_encode(array("mensagem" => "Token não fornecido"));
            exit;
        }
    default:
        // Método não permitido
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido']);
        break;
}

// Fechar a conexão com o banco de dados
$conexao = null;
?>