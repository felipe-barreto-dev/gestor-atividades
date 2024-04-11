<?php
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

// Função para obter todas as atividades
function obterAtividades($conexao) {
    $consulta = $conexao->prepare("SELECT * FROM atividades");
    $consulta->execute();
    $resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($resultados);
}

// Função para adicionar uma nova atividade
function adicionarAtividade($conexao, $dados) {
    $atividade = json_decode($dados, true);
    $consulta = $conexao->prepare("INSERT INTO atividades (titulo, data_criacao, id_usuario) VALUES (:titulo, :data_criacao, :id_usuario)");
    $consulta->bindParam(':titulo', $atividade['titulo']);
    $consulta->bindValue(':data_criacao', date('Y-m-d H:i:s')); // data de criação atual
    $consulta->bindParam(':id_usuario', $atividade['id_usuario']);
    $consulta->execute();
    return json_encode(['mensagem' => 'Atividade adicionada com sucesso']);
}

// Roteamento das solicitações
$metodo_requisicao = $_SERVER["REQUEST_METHOD"];
switch ($metodo_requisicao) {
    case 'GET':
        echo obterAtividades($conexao);
        break;
    case 'POST':
        $dados = file_get_contents("php://input");
        echo adicionarAtividade($conexao, $dados);
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