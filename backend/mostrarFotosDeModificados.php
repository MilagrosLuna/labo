<?php
require_once "./clases/neumaticoBD.php";
use LunaMilagros\NeumaticoBd;
$directorio = "./neumaticosModificados/";
$archivos = scandir($directorio);
echo'<table style="border-collapse: collapse; width: 80%; padding: 10px; margin: 50px auto; text-aling: center;">';
echo'<tr><th style="border: 1px solid black; padding: 8px;">Nombre</th><th style="border: 1px solid black; padding: 8px;">Foto</th></tr>';

foreach($archivos as $item){

    if($item != "." && $item !=".."){
        echo '<tr>';
        echo '<th style="border: 1px solid black; padding: 8px;">'.$item.'</th>';
        echo '<th style="border: 1px solid black; padding: 8px;"><img src="./backend/'.$directorio.'/'.$item.'" style="width: 80px; height: 80px;"></th>';
        echo '</tr>';
    }
}
echo '</table>';