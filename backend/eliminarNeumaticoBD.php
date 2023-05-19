<?php
require_once "./clases/neumaticoBD.php";
use LunaMilagros\NeumaticoBd;

$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : "no hay";
$neumatico_decode = json_decode($neumatico_json);
//var_dump($neumatico_decode);
$neumatico  = new NeumaticoBd($neumatico_decode->marca,$neumatico_decode->medidas,(float)$neumatico_decode->precio,$neumatico_decode->id);

$neumaticoEliminado = $neumatico;

if(NeumaticoBd::eliminar($neumatico->Id())){
    
    $retorno = $neumaticoEliminado->guardarJSON("./archivos/neumaticos_eliminados.json");
    if(json_decode($retorno)->exito)
    {        
      echo '{"exito" : true,"mensaje": "eliminado y guardado en archivo de eliminados"}';
    }
}else{echo '{"exito" : false,"mensaje": "NO eliminado"}';}
