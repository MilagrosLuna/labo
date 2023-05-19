<?php
require_once "./clases/neumatico.php";
use LunaMilagros\Neumatico;

$retorno = Neumatico::traerJSON("./archivos/neumaticos.json");

$neumaticos = array(); 

foreach($retorno as $neumatico) {
    $neumatico_data = array(
        "marca" => $neumatico->Marca(),
        "medidas" => $neumatico->Medidas(),
        "precio" => $neumatico->Precio()
    );
    $neumaticos[] = $neumatico_data;
}
echo(json_encode($neumaticos));

