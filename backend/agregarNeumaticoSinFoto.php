<?php
require_once "./clases/neumaticoBD.php";
use LunaMilagros\NeumaticoBd;

$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : "sin json";

$neumatico_decode = json_decode($neumatico_json);
$neumatico  = new NeumaticoBd($neumatico_decode->marca,$neumatico_decode->medidas,(float)$neumatico_decode->precio);
if($neumatico->agregar()){
    echo '{"exito" : true,"mensaje": "neumatico sin foto agregado"}';
}else{echo '{"exito" : false,"mensaje": "neumatico sin foto NO agregado"}'; }