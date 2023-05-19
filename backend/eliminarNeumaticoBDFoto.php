<?php
require_once "./clases/neumaticoBD.php";

use LunaMilagros\Neumatico;
use LunaMilagros\NeumaticoBd;


$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : "sin json"; 
if(count($_POST) > 0 ){

    $neumaticoobj = json_decode($neumatico_json);

    $neumaticoviejo = new NeumaticoBd($neumaticoobj->marca,$neumaticoobj->medidas,$neumaticoobj->precio,$neumaticoobj->id,$neumaticoobj->pathfoto);
    
    $pathAMover= "./neumaticos/imagenes/" . ObtenerPathViejo($neumaticoviejo);
    
    $destinoModificado = "./neumaticosBorrados/" .$neumaticoobj->id.'.'. $neumaticoobj->marca.".borrado.".date("His").".jpg";
    
    $new_foto_name = $neumaticoobj->id.'.'. $neumaticoobj->marca.".borrado.".date("His").".jpg";
    
    $retorno ='{"exito" : false,"mensaje": "neumatico no borrado"}';
    
    if($neumaticoviejo->eliminar($neumaticoobj->id)){    
        $neumatico = new NeumaticoBd($neumaticoobj->marca,$neumaticoobj->medidas,$neumaticoobj->precio,$neumaticoobj->id,$new_foto_name);
        if($neumatico->guardarEnArchivo()){
            rename($pathAMover,$destinoModificado);   
            $retorno ='{"exito" : true,"mensaje": "neumatico borrado"}';
        }
    }
    
    echo $retorno;
    
}
else{
    if(file_exists("./archivos/neumaticosbd_borrados.txt")){
    echo "<style>
    table {
    border-collapse: collapse; 
    width: 80%; 
    padding: 10px;
    margin: 50px auto;
    text-align: center;
    }
    td, th {
    border: 1px solid black;
    padding: 8px; 
    text-align: center;
    }
    </style>";
    echo "
    <table >
        <thead>
            <tr>
                <th>ID</th>
                <th>MARCA</th>
                <th>MEDIDAS</th>
                <th>PRECIO</th>
                <th>PATH</th>
                <th>Foto</th>
            </tr>
        </thead>"; 
        $tabla = "";
        $contenido = file_get_contents('./archivos/neumaticosbd_borrados.txt');
        $lineas = explode("\n", $contenido);
        foreach ($lineas as $linea) {
            // Dividir la línea en campos usando la coma como separador
            $campos = explode(',', $linea);
          
            // Crear una fila de la tabla con los datos
            echo '<tr>';
            foreach ($campos as $campo) {
              // Dividir el campo en clave y valor usando el dos puntos como separador
              $datos = explode(':', $campo);
             // if($datos[0]!=""){                
                $clave = trim($datos[0]);
                $valor = trim($datos[1]);
                if($clave == "La foto"){
                    $valor .= '</td><td><img src=./backend/neumaticosBorrados/'.urlencode($valor).' width="200" height="200"></td>';
                }
             // }          
              // Mostrar el valor en la celda correspondiente
              echo '<td>' . $valor . '</td>';
            }
            echo '</tr>';
        }
        $tabla .= "</table>";
    
        echo $tabla;
    }
}


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