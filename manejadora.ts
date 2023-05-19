/// <reference path="ajax.ts" />
window.addEventListener("load", ():void => {
    LaboParcial.Manejadora.MostrarNeumaticos();
       
}); 
document.addEventListener("DOMContentLoaded", () => {
    const foto = document.getElementById("foto") as HTMLInputElement;
    const previsualizacion = document.getElementById("imgFoto") as HTMLImageElement;
  
    foto.addEventListener("change", () => {
      if (foto.files && foto.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          previsualizacion.src = reader.result as string;
        };
        reader.readAsDataURL(foto.files[0]);
      }
    });
});
namespace LaboParcial{
export class  Manejadora{
    static URL_API : string = "./"; 
    static AJAX : Ajax = new Ajax();
//#region json
    public static AgregarNeumaticoJSON(){
        let marca:string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas:string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let precio:string = (<HTMLInputElement>document.getElementById("precio")).value;        
        let form : FormData = new FormData()
        form.append('marca', marca);
        form.append('medidas', medidas);
        form.append('precio', precio);
        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/altaNeumaticoJSON.php", 
                    Manejadora.AgregarSuccessJSON, 
                    form, 
                    Manejadora.Fail); 
    }
    public static AgregarSuccessJSON(retorno:string):void{
        let respuesta = JSON.parse(retorno);
        console.log("Agregar neumatico json: ", respuesta.mensaje);        
        Manejadora.MostrarNeumaticoJSON();
        alert("Agregar neumatico json: "+respuesta.mensaje);
    }
    public static Fail(retorno:string):void{
        console.error(retorno);
        alert("Ha ocurrido un ERROR!!!");
    }    
    public static VerificarNeumaticoJSON(){
        let marca:string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas:string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let form : FormData = new FormData()    
        form.append('marca', marca);
        form.append('medidas', medidas);
        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/verificarNeumaticoJSON.php", 
                    Manejadora.VerificarSuccess, 
                    form, 
                    Manejadora.Fail); 
    }    
    public static VerificarSuccess(retorno:string):void{
        let respuesta = JSON.parse(retorno);
        console.log("Verificar: ", respuesta.mensaje);        
        Manejadora.MostrarNeumaticoJSON();
        alert("Verificar: "+respuesta.mensaje);
    } 
    public static MostrarNeumaticoJSON(){       
        Manejadora.AJAX.Get(Manejadora.URL_API + "backend/listadoNeumaticosJSON.php", 
                    Manejadora.MostrarListadoSuccess, 
                    "", 
                    Manejadora.Fail); 
    }
    public static MostrarListadoSuccess(data:string):void{

        let obj_array: any[] = JSON.parse(data);

        console.log("Mostrar: ", obj_array);
        let div = <HTMLDivElement>document.getElementById("divTabla");
        let tabla = `<style>
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
        </style>
        <table class="table table-hover">
                        <tr>
                            <th>MARCA</th><th>MEDIDAS</th><th>PRECIO</th>
                        </tr>`;
                    if(obj_array.length < 1){
                        tabla += `<tr><td>---</td><td>---</td><td>---</td><td>---</td>
                            <td>---</td></tr>`;
                    }
                    else {
                        for (let index = 0; index < obj_array.length; index++) {
                            const dato = obj_array[index];
                            tabla += `<tr><td>${dato.marca}</td><td>${dato.medidas}</td><td>${dato.precio}</td></tr>`;
                        }  
                    }
        tabla += `</table>`;
        div.innerHTML = tabla;            
    }
//#endregion

    public static AgregarNeumatico(){
        let marca:string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas:string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let precio:string = (<HTMLInputElement>document.getElementById("precio")).value;      
        let foto : any = (<HTMLInputElement> document.getElementById("foto"));            
        let info :string = '{"marca":"'+marca+'","medidas":"'+medidas+'","precio":"'+precio+'"}';
        let form : FormData = new FormData()
        if(foto.files && foto.files[0]){            
            form.append('foto', foto.files[0]);
            form.append('marca', marca);
            form.append('medidas', medidas);
            form.append('precio', precio);
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/agregarNeumaticoBD.php",
                    Manejadora.AgregarSuccess, 
                    form, 
                    Manejadora.Fail); 
        }else{    
            
            form.append('neumatico_json', info);        
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/agregarNeumaticoSinFoto.php", 
            Manejadora.AgregarSuccess, 
            form, 
            Manejadora.Fail);  
        }
       
    }
    public static AgregarSuccess(retorno:string):void{
        let respuesta = JSON.parse(retorno);
        console.log("Agregar: ", respuesta.mensaje);        
       Manejadora.MostrarNeumaticos();
        alert("Agregar:"+respuesta.mensaje);
    }
    public static MostrarNeumaticos(){
        Manejadora.AJAX.Get(Manejadora.URL_API + "backend/listadoNeumaticosBD.php",
                    Manejadora.MostrarNeumaticosSuccess, 
                    "tabla=mostrar", 
                    Manejadora.Fail);         
    }
    public static MostrarNeumaticosSuccess(retorno:string):void {        
        let div = <HTMLDivElement>document.getElementById("divTabla");        
        div.innerHTML = retorno;  
        document.getElementsByName("btnModificar").forEach((boton)=>{
            boton.addEventListener("click", ()=>{ 
                let obj : any = boton.getAttribute("data-obj");                
                let obj_dato = JSON.parse(obj);
                console.log(obj_dato);
                (<HTMLInputElement>document.getElementById("id")).value = obj_dato.id;
                (<HTMLInputElement>document.getElementById("marca")).value = obj_dato.marca;
                (<HTMLInputElement>document.getElementById("medidas")).value = obj_dato.medidas;   
                (<HTMLInputElement>document.getElementById("precio")).value = obj_dato.precio;                  
                let btn = (<HTMLInputElement>document.getElementById("btn-modificar"));
                if(obj_dato.pathfoto!=="sinFoto"){
                    //(<HTMLInputElement>document.getElementById("imgFoto")).src = "./backend/neumaticos/imagenes/"+ obj_dato.pathfoto; 
                       const previsualizacion = document.getElementById("imgFoto") as HTMLImageElement;
                       previsualizacion.src = "./backend/neumaticos/imagenes/" +  obj_dato.pathfoto;                 
                     }
                btn.addEventListener("click", ():void=>{
                    Manejadora.ModificarNeumatico();      
                });
            });
        });
        document.getElementsByName("btnEliminar").forEach((boton)=>{
            boton.addEventListener("click", ()=>{ 
                let obj : any = boton.getAttribute("data-obj");                
                let obj_dato = JSON.parse(obj);
                let id : any = obj_dato.id;          
                if(confirm(`¿Seguro de eliminar alumno con id ${id}?`)){                  
                    let form : FormData = new FormData()
                    if(obj_dato.pathfoto=="sinFoto"){                        
                        form.append('neumatico_json', JSON.stringify(obj_dato));             
                        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/eliminarNeumaticoBD.php", 
                        Manejadora.DeleteSuccess, 
                                    form, 
                                    Manejadora.Fail);
                    }else{
                        form.append('neumatico_json', JSON.stringify(obj_dato));             
                        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/eliminarNeumaticoBDFoto.php", 
                        Manejadora.DeleteSuccess, 
                                    form, 
                                    Manejadora.Fail);
                    }
                }                
            });
        }); 
        console.log(retorno);        
        alert(retorno);
    }   
    public static DeleteSuccess(retorno:string):void {
        let respuesta = JSON.parse(retorno);
        console.log("Eliminar: ", respuesta.mensaje);        
        Manejadora.MostrarNeumaticos();
        alert("Eliminar:"+respuesta.mensaje);
    }
    public static ModificarNeumatico(){
        let marca:string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas:string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let precio:string = (<HTMLInputElement>document.getElementById("precio")).value;                    
        let id:string = (<HTMLInputElement>document.getElementById("id")).value;               
        let foto : any = (<HTMLInputElement> document.getElementById("foto"));    
        let form : FormData = new FormData()
        let neumatico_json :string = '{"marca":"'+marca+'","medidas":"'+medidas+'","precio":"'+precio+'","id":"'+id+'"}';
        form.append('neumatico_json', neumatico_json);
        if(foto.files && foto.files[0]){
            form.append('foto', foto.files[0]);
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/modificarNeumaticoBDFoto.php", 
                        Manejadora.ModificarNeumaticoSuccess, 
                        form, 
                        Manejadora.Fail); 
        }else{
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/modificarNeumaticoBD.php", 
                        Manejadora.ModificarNeumaticoSuccess, 
                        form, 
                        Manejadora.Fail); 
        }
    }
    public static ModificarNeumaticoSuccess(retorno:string):void {
        console.log(retorno);
        let respuesta = JSON.parse(retorno);
        console.log("Modificar: ", respuesta.mensaje);        
        Manejadora.MostrarNeumaticos();
        alert("Modificar:"+respuesta.mensaje);
    }
    public static VerificarNeumaticoBD(){
        let marca:string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas:string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let form : FormData = new FormData()                   
        let info :string = '{"marca":"'+marca+'","medidas":"'+medidas+'"}';
        form.append('obj_neumatico', info);
        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/verificarNeumaticoBD.php", 
                    Manejadora.VerificarBDSuccess, 
                    form, 
                    Manejadora.Fail); 
    }    
    public static VerificarBDSuccess(retorno:string):void{
        let respuesta = JSON.parse(retorno);
        if(retorno.trim()=="{}"){
            alert("No existe neumatico con esas caracteristicas");
            console.log("No existe neumatico con esas caracteristicas");   
        }else{            
            console.log("Verificar: existe");        
            Manejadora.MostrarNeumaticos();
            alert("Verificar:existe ");
        }
    } 
    public static MostrarNeumaticosBorrados(){
        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/eliminarNeumaticoBDFoto.php", 
        Manejadora.MostrarNeumaticosBorradosSuccess, 
                    '', 
                    Manejadora.Fail);
    }
    public static MostrarNeumaticosBorradosSuccess(retorno:string):void {       
        let div = <HTMLDivElement>document.getElementById("divTabla");        
        div.innerHTML = retorno; 
        console.log(retorno);        
        alert(retorno);
    }   
    public static MostrarNeumaticosBorradosJSON(){
        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/mostrarBorradosJSON.php", 
        Manejadora.MostrarNeumaticosBorradosSuccess, 
                    '', 
                    Manejadora.Fail);
    }
    public static MostrarFotosModificados(){
        Manejadora.AJAX.Post(Manejadora.URL_API + "backend/mostrarFotosDeModificados.php", 
        Manejadora.MostrarNeumaticosBorradosSuccess, 
                    '', 
                    Manejadora.Fail);
    }
    

    }
}