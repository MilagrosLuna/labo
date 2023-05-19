<?php
require_once "./clases/neumaticoBD.php";

use LunaMilagros\Neumatico;
use LunaMilagros\NeumaticoBd;


$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : "sin json"; 
$neumaticoobj = json_decode($neumatico_json);

$neumaticoviejo = new NeumaticoBd($neumaticoobj->marca,$neumaticoobj->medidas,$neumaticoobj->precio,$neumaticoobj->id);
$pathAMover = "";
if(ObtenerPathViejo($neumaticoviejo)!=="sinFoto"){
$pathAMover= "./neumaticos/imagenes/" . ObtenerPathViejo($neumaticoviejo);
}

$destinoModificado = "./neumaticosModificados/" .$neumaticoobj->id.'.'. $neumaticoobj->marca.".modificado.".date("His").".jpg";


//region validacion foto
$foto_name = $_FILES['foto']['name'];
$foto_tmp_name = $_FILES['foto']['tmp_name'];
$foto_extension = pathinfo($foto_name, PATHINFO_EXTENSION);
$hora = date('His');
$new_foto_name = $neumaticoviejo->Marca().'.'.$hora . '.' . $foto_extension;

$destinoFoto = "./neumaticos/imagenes/" . $new_foto_name;

$uploadOk = TRUE;
if (file_exists($destinoFoto)) {
    //echo "El archivo ya existe. Verifique!!!";
    $uploadOk = FALSE;
}
if ($_FILES["foto"]["size"] > 5000000 ) {
    //echo "El archivo es demasiado grande. Verifique!!!";
    $uploadOk = FALSE;
}
$tipoArchivo = pathinfo($destinoFoto, PATHINFO_EXTENSION);
if($tipoArchivo != "jpg" && $tipoArchivo != "jpeg" && $tipoArchivo != "gif"
    && $tipoArchivo != "png") {
    //echo "Solo son permitidas imagenes con extension JPG, JPEG, PNG o GIF.";
    $uploadOk = FALSE;
}
//endregion

$retorno ='{"exito" : false,"mensaje": "neumatico no modificado"}';
$neumatico = new NeumaticoBd($neumaticoobj->marca,$neumaticoobj->medidas,$neumaticoobj->precio,$neumaticoobj->id,$new_foto_name);

//var_dump($neumatico);

if($neumatico->modificar()){     
    move_uploaded_file($foto_tmp_name, $destinoFoto);
    if($pathAMover!=""){        
    rename($pathAMover,$destinoModificado); 
    }  
    $retorno ='{"exito" : true,"mensaje": "neumatico modificado"}';    
}

echo $retorno;

function ObtenerPathViejo (NeumaticoBd $neumatico) : null | string{
    $retorno = null;
    $neumaticos = NeumaticoBd::Traer();
    foreach($neumaticos as $item){
        if($neumatico->Id() == $item->Id()){
            $retorno = $item->Pathfoto();
        }
    }
    return $retorno;
}