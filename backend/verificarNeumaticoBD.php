<?php
require_once "./clases/neumaticoBD.php";

use LunaMilagros\Neumatico;
use LunaMilagros\NeumaticoBd;

$obj_neumatico = isset($_POST["obj_neumatico"]) ? $_POST["obj_neumatico"] : "sin obj_neumatico";

$neumatico_decode = json_decode($obj_neumatico);
$neumatico = new NeumaticoBD($neumatico_decode->marca,$neumatico_decode->medidas);

$array_neumaticos = NeumaticoBd::traer();
$retorno = "{}";
if($neumatico->existe($array_neumaticos)){
    $item = $neumatico->traerUno();
    if($item != null){        
        $retorno = $item->toJson();
    }
}

echo $retorno;
