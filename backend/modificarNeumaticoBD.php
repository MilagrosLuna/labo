<?php
require_once "./clases/neumaticoBD.php";
use LunaMilagros\NeumaticoBd;

$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : "no hay";
$neumatico_decode = json_decode($neumatico_json);
//var_dump($neumatico_decode);
$neumatico  = new NeumaticoBd($neumatico_decode->marca,$neumatico_decode->medidas,(float)$neumatico_decode->precio,$neumatico_decode->id);

if($neumatico->modificar()){
    echo '{"exito" : true,"mensaje": "modificado"}';
}else{echo '{"exito" : false,"mensaje": "NO modificado"}'; }
