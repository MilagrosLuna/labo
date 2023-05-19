<?php
require_once "./clases/neumatico.php";
use LunaMilagros\Neumatico;

$marca = isset($_POST["marca"]) ? $_POST["marca"] : "sin marca"; 
$medidas = isset($_POST["medidas"]) ? $_POST["medidas"] : "sin medidas"; 
$precio = isset($_POST["precio"]) ? $_POST["precio"] : 0; 

$new = new Neumatico($marca,$medidas,$precio);

$retorno = $new->guardarJSON("./archivos/neumaticos.json");
echo $retorno;
