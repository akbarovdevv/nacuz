<?php
// Xavfsizlik va CORS (Boshqa domenlardan kirishga ruxsat)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Baza sozlamalari (Siz bergan ma'lumotlar)
$servername = "176.9.111.172";
$username = "s_67_nac";
$password = "Admin";
$dbname = "s_67_nac";

// Bazaga ulanish
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Jadval yaratish (Agar yo'q bo'lsa)
// Bu jadval xuddi papka kabi ishlaydi: 'name' bu fayl nomi, 'content' bu ichidagi JSON
$sql = "CREATE TABLE IF NOT EXISTS json_store (
    name VARCHAR(50) PRIMARY KEY,
    content LONGTEXT
)";
$conn->query($sql);

$method = $_SERVER['REQUEST_METHOD'];

// MA'LUMOT OLISH (GET)
if ($method === 'GET') {
    $file = isset($_GET['file']) ? $conn->real_escape_string($_GET['file']) : '';
    
    if ($file) {
        $sql = "SELECT content FROM json_store WHERE name = '$file'";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo $row['content']; // JSON ni qaytarish
        } else {
            echo "[]"; // Bo'sh massiv
        }
    } else {
        echo json_encode(["message" => "File name required"]);
    }
}

// MA'LUMOT YOZISH (POST)
if ($method === 'POST') {
    // Reactdan kelgan ma'lumotni olish
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (isset($input['file']) && isset($input['data'])) {
        $file = $conn->real_escape_string($input['file']);
        // JSON formatga o'tkazib bazaga yozamiz
        $data = $conn->real_escape_string(json_encode($input['data'], JSON_UNESCAPED_UNICODE));
        
        // Agar bor bo'lsa yangilaydi, yo'q bo'lsa yaratadi
        $sql = "INSERT INTO json_store (name, content) VALUES ('$file', '$data') 
                ON DUPLICATE KEY UPDATE content = '$data'";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

$conn->close();
?>
