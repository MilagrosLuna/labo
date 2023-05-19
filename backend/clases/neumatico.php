<?php   
namespace LunaMilagros;
use PDO;
use PDOException;

class Neumatico 
{
    protected string $marca;
    protected string $medidas;
    protected float $precio;
    public function Marca():string{
		return $this->marca;
	}
	public function Medidas():string{
		return $this->medidas;
	}
    public function Precio():float{
		return $this->precio;
	}
    public function __construct(string $marca, string $medidas,float $precio)
    {
        $this->marca = $marca != null ? $marca : "";
        $this->medidas = $medidas != null ? $medidas : "";
        $this->precio = $precio != null ? $precio : 0 ;
    }

    public function toJson(){		
        $json = array("marca" => $this->marca,
            "medidas" => $this->medidas,
            "precio" => $this->precio);
        return json_encode($json);
    }

    public function guardarJSON(string $path) {
		$retorno = "";		
		$ar = fopen($path, "a");
		$cant = fwrite($ar, $this->toJson() ."\r\n");		
		if($cant > 0)
		{
			$retorno= '{"exito" : true,"mensaje": "neumatico agregado al archivo json"}';
		}
		else{
			$retorno= '{"exito" : false,"mensaje": "hubo un problema con el archivo"}';
		}
		fclose($ar);
		return $retorno;		
	}  

    public static function traerJSON(string $path){
		$neumaticos = [];
		$ar = fopen($path, "r");
		while(!feof($ar))
		{
			$linea = fgets($ar);
            $neumatico = json_decode($linea);
			if(isset($neumatico))
			{                
				$marca = $neumatico->marca;
				$medidas = $neumatico->medidas;
				$precio = $neumatico->precio;
				$new = new Neumatico($marca,$medidas,$precio);
				array_push($neumaticos,$new);
			}
		}	
		return $neumaticos;
	} 

    public static function verificarNeumaticoJSON(Neumatico $neumatico, string $path){
		$neumaticos = Neumatico::traerJSON($path);
        $retorno = '{"exito" : false,"mensaje": "el nuematico no existe en el json"}';
        $cant = 0;
		foreach($neumaticos as $item)
		{
			if($item->medidas == $neumatico->medidas && $item->marca == $neumatico->marca)
			{
               $cant = $cant + $item->precio;
			}
		}
        if($cant>0)
        {
            $retorno  = '{"exito" : true,"mensaje": "Existe y la sumatoria de los precios es de $'.$cant.'"}'; 
        }
		return $retorno;
	} 
   
}


