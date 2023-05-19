<?php
require_once "./clases/neumaticoBD.php";
use LunaMilagros\NeumaticoBd;

$marca = isset($_POST["marca"]) ? $_POST["marca"] : "sin_marca"; 
$medidas = isset($_POST["medidas"]) ? $_POST["medidas"] : "sin_medidas"; 
$precio = isset($_POST["precio"]) ? $_POST["precio"] : 0; 

//region validacion foto

$foto_name = $_FILES['foto']['name'];
$foto_tmp_name = $_FILES['foto']['tmp_name'];
$foto_extension = pathinfo($foto_name, PATHINFO_EXTENSION);
$hora = date('His');
$new_foto_name = $marca.'.'.$hora . '.' . $foto_extension;

$destinoFoto = "./neumaticos/imagenes/" . $new_foto_name;

$uploadOk = TRUE;
if (file_exists($destinoFoto)) {
    //echo "El archivo ya existe. Verifique!!!";
    $uploadOk = FALSE;
}
if ($_FILES["foto"]["size"] > 5000000 ) {
   // echo "El archivo es demasiado grande. Verifique!!!";
    $uploadOk = FALSE;
}
$tipoArchivo = pathinfo($destinoFoto, PATHINFO_EXTENSION);
if($tipoArchivo != "jpg" && $tipoArchivo != "jpeg" && $tipoArchivo != "gif"
    && $tipoArchivo != "png") {
 //   echo "Solo son permitidas imagenes con extension JPG, JPEG, PNG o GIF.";
    $uploadOk = FALSE;
}
//endregion

if($uploadOk){    
    $neumatico  = new NeumaticoBd($marca,$medidas,$precio,-1,$new_foto_name);
    $array = NeumaticoBd::traer();
    if(!$neumatico->existe($array)){  
        if($neumatico->agregar()){
            if(move_uploaded_file($foto_tmp_name, $destinoFoto)){            
                echo '{"exito" : true,"mensaje": "agregado con foto"}';
            }else{            
                echo '{"exito" : true,"mensaje": "agregado sin foto porq hubo un error"}';
            }        
        }else{echo '{"exito" : false,"mensaje": "NO agregado hubo un error en el agregar"}'; }
    }else{echo '{"exito" : false,"mensaje": "NO agregado, porque ya existe en la Base de datos"}'; }
}else{echo '{"exito" : false,"mensaje": "NO agregado, porque hubo un problema con la carga del archivo"}';}