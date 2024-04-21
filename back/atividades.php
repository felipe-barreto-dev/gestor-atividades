<?php
require __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('SECRET_KEY', 'sua_chave_secreta');

function verificarToken() {
    $token = null;

    // Obter os cabeçalhos HTTP
    $headers = apache_request_headers();

    // Verificar se o token está presente nos cabeçalhos da requisição
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }
    
    if ($token) {
        try {
            $decoded = JWT::decode($token, new Key(SECRET_KEY, 'HS256'));
            
            // Se o token for válido, você pode acessar os dados do payload
            return $decoded->usuario_id;
        } catch (Exception $e) {
            // Caso o token seja inválido, retornar erro de autenticação
            http_response_code(401); // Unauthorized
            echo json_encode(array("mensagem" => "Token inválido"));
            exit;
        }
    } else {
        // Se o token não estiver presente nos cabeçalhos, retornar erro de autenticação
        http_response_code(401); // Unauthorized
        echo json_encode(array("mensagem" => "Token não fornecido"));
        exit;
    }
}

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
} catch(PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["mensagem" => "Erro na conexão com o banco de dados: " . $e->getMessage()]);
    exit();
}

// Função para obter todas as atividades de um usuário
function obterAtividadesDoUsuario($conexao, $usuario_id) {
    $consulta = $conexao->prepare("SELECT * FROM atividades WHERE id_usuario = :usuario_id");
    $consulta->bindParam(':usuario_id', $usuario_id);
    $consulta->execute();
    $resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($resultados);
}

// Função para adicionar uma nova atividade associada a um usuário
function adicionarAtividade($conexao, $dados, $usuario_id) {
    $atividade = json_decode($dados, true);
    $consulta = $conexao->prepare("INSERT INTO atividades (titulo, data_criacao, id_usuario) VALUES (:titulo, :data_criacao, :id_usuario)");
    $consulta->bindParam(':titulo', $atividade['titulo']);
    $consulta->bindValue(':data_criacao', date('Y-m-d H:i:s')); // data de criação atual
    $consulta->bindParam(':id_usuario', $usuario_id);
    $consulta->execute();
    return json_encode(['mensagem' => 'Atividade adicionada com sucesso']);
}

// Roteamento das solicitações
$metodo_requisicao = $_SERVER["REQUEST_METHOD"];
switch ($metodo_requisicao) {
    case 'OPTIONS':
        // Responder ao preflight request (pré-requisição)
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        break;
    case 'GET':
        // Verificar e obter o ID do usuário a partir do token JWT
        $usuario_id = verificarToken();
        // Obter as atividades associadas ao usuário autenticado
        echo obterAtividadesDoUsuario($conexao, $usuario_id);
        break;
    case 'POST':
        // Verificar e obter o ID do usuário a partir do token JWT
        $usuario_id = verificarToken();
        // Adicionar uma nova atividade associada ao usuário autenticado
        $dados = file_get_contents("php://input");
        echo adicionarAtividade($conexao, $dados, $usuario_id);
        break;
    default:
        // Método não permitido
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido']);
        break;
}

// Fechar a conexão com o banco de dados
$conexao = null;
?>
