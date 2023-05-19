<?php 
namespace LunaMilagros;
require_once("./clases/IParte1.php");
require_once("./clases/IParte2.php");
require_once("./clases/IParte3.php");
require_once("./clases/IParte4.php");
require_once("./clases/accesoDeDatos.php");
require_once("./clases/neumatico.php");
use ManejoDeUsuarios\AccesoDatos;
use IParte1;
use IParte2;
use IParte3;
use IParte4;
use PDO;
use PDOException;
class NeumaticoBd extends Neumatico implements IParte1,IParte2,IParte3,IParte4{

    private int $id;
    private string $pathfoto;
    public function Id():int{
		return $this->id;
	}
	public function Pathfoto():string{
		return $this->pathfoto;
	}
    public function __construct(string $marca="", string $medidas="",float $precio=-1, int $id=-1,string $pathfoto=""){
        parent::__construct($marca,$medidas,$precio);
        $this->id = $id != null ? $id : -1;
        $this->pathfoto = $pathfoto != null ? $pathfoto : "sinFoto";
    }
    public function agregar(): bool{
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
        $consulta =$objetoAccesoDato->retornarConsulta("INSERT INTO neumaticos (marca, medidas, precio, foto)"
                                                  . "VALUES(:marca, :medidas, :precio , :foto)");        
        $consulta->bindValue(':marca', $this->marca, PDO::PARAM_STR);
        $consulta->bindValue(':medidas', $this->medidas, PDO::PARAM_STR);        
		$consulta->bindValue(':precio', $this->precio, PDO::PARAM_INT);
        $consulta->bindValue(':foto', $this->pathfoto, PDO::PARAM_STR);
        return $consulta->execute();  
    }
    public static function traer():array{
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
        $neumaticos = array();
        $consulta =$objetoAccesoDato->retornarConsulta("SELECT * FROM  neumaticos");
        $consulta->execute();
        while($fila = $consulta->fetch())
        {
            $id =  $fila[0];   
            $marca = $fila[1];
            $medidas = $fila[2];
            $precio = $fila[3];
            $foto = $fila[4];
            if($foto != null){
                $item= new NeumaticoBD($marca,$medidas,$precio,$id,$foto); 
            }else{
                $item= new NeumaticoBD($marca,$medidas,$precio,$id,"sinFoto");
            }
            array_push($neumaticos, $item);
        }
		return $neumaticos;  
    }
    public function traerUno(){
        $array = NeumaticoBd::traer();
        $retorno = null;
        if(count($array) > 0){
            foreach($array as $item) {
                if($this->marca == $item->marca && $this->medidas == $item->medidas){
                    $retorno = $item;
                    break;
                }
            }
        }
        return $retorno;
    }
    public function modificar():bool{
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
        $consulta = $objetoAccesoDato->retornarConsulta("UPDATE neumaticos SET marca = :marca, medidas = :medidas, precio = :precio, foto = :foto WHERE id = :id");
        $consulta->bindValue(':marca', $this->Marca(), PDO::PARAM_STR);
        $consulta->bindValue(':medidas', $this->Medidas(), PDO::PARAM_STR);        
		$consulta->bindValue(':precio', $this->Precio(), PDO::PARAM_INT);
        $consulta->bindValue(':foto', $this->Pathfoto(), PDO::PARAM_STR);
        $consulta->bindValue(':id', $this->Id(), PDO::PARAM_INT);
       
        $modificado = $consulta->execute();   
        if ($modificado && $consulta->rowCount() > 0) return true;
        else return false;    
    }
    public static function eliminar(int $id):bool{
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();
        $consulta = $objetoAccesoDato->retornarConsulta("DELETE FROM neumaticos WHERE id = :id");    
        $consulta->bindValue(':id', $id, PDO::PARAM_INT);
        $modificado = $consulta->execute();   
        if ($modificado && $consulta->rowCount() > 0) return true;
        else return false; 
    }
    public function existe($neumaticosBD):bool{
        $retorno = false;
        if(count($neumaticosBD) > 0){           
            foreach($neumaticosBD as $item) {
                if($this->marca == $item->marca && $this->medidas == $item->medidas){
                    $retorno = true;
                    break;
                }
            }
        }
        return $retorno; 
    }
    function guardarEnArchivo():string{
        $retorno = "";		
		$ar = fopen("./archivos/neumaticosbd_borrados.txt", "a");
		$cant = fwrite($ar, "\r\n" . $this->__toString());		
		if($cant > 0)
		{
			$retorno= '{"exito" : true,"mensaje": "usuario agregado"}';
		}
		else{
			$retorno= '{"exito" : false,"mensaje": "hubo un problema con el archivo"}';
		}        
		fclose($ar);
		return $retorno;		
    }
    public function __toString(){
        $retorno = "El id:".$this->Id();
        $retorno .= ",La marca:".$this->Marca();
        $retorno .= ",Las medidas:".$this->Medidas();
        $retorno .= ",El precio:".$this->Precio();
        $retorno .= ",La foto:".$this->Pathfoto();
        return $retorno;
    }
    public function toJson(){
        $json = array("id" => $this->id,
        "marca" => $this->marca,
        "medidas" => $this->medidas,
        "precio" => $this->precio,
        "pathfoto" => $this->pathfoto);
    return json_encode($json);
    }
    public static function mostrarBorradosJSON(){
        $contenido = file_get_contents('./archivos/neumaticos_eliminados.json');
        $neumaticosEliminados = explode("\n", $contenido);
        foreach ($neumaticosEliminados as $neumaticoEliminado) {
            $datos = json_decode($neumaticoEliminado, true);   
            if(!empty($datos)){
                echo "Marca: " . $datos['marca'] . "<br>";
                echo "Medidas: " . $datos['medidas'] . "<br>";
                echo "Precio: " . $datos['precio'] . "<br><br>";
            }     
        }
    }
}