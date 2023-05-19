<?php
require_once "./clases/neumatico.php";
use LunaMilagros\Neumatico;

$marca = isset($_POST["marca"]) ? $_POST["marca"] : "sin marca"; 
$medidas = isset($_POST["medidas"]) ? $_POST["medidas"] : "sin medidas"; 

$new = new Neumatico($marca,$medidas,0);

$retorno = Neumatico::verificarNeumaticoJSON($new,"./archivos/neumaticos.json");
echo $retorno;