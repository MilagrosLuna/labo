"use strict";
window.addEventListener("load", () => {
    LaboParcial.Manejadora.MostrarNeumaticos();
});
document.addEventListener("DOMContentLoaded", () => {
    const foto = document.getElementById("foto");
    const previsualizacion = document.getElementById("imgFoto");
    foto.addEventListener("change", () => {
        if (foto.files && foto.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                previsualizacion.src = reader.result;
            };
            reader.readAsDataURL(foto.files[0]);
        }
    });
});
var LaboParcial;
(function (LaboParcial) {
    class Manejadora {
        static AgregarNeumaticoJSON() {
            let marca = document.getElementById("marca").value;
            let medidas = document.getElementById("medidas").value;
            let precio = document.getElementById("precio").value;
            let form = new FormData();
            form.append('marca', marca);
            form.append('medidas', medidas);
            form.append('precio', precio);
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/altaNeumaticoJSON.php", Manejadora.AgregarSuccessJSON, form, Manejadora.Fail);
        }
        static AgregarSuccessJSON(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Agregar neumatico json: ", respuesta.mensaje);
            Manejadora.MostrarNeumaticoJSON();
            alert("Agregar neumatico json: " + respuesta.mensaje);
        }
        static Fail(retorno) {
            console.error(retorno);
            alert("Ha ocurrido un ERROR!!!");
        }
        static VerificarNeumaticoJSON() {
            let marca = document.getElementById("marca").value;
            let medidas = document.getElementById("medidas").value;
            let form = new FormData();
            form.append('marca', marca);
            form.append('medidas', medidas);
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/verificarNeumaticoJSON.php", Manejadora.VerificarSuccess, form, Manejadora.Fail);
        }
        static VerificarSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Verificar: ", respuesta.mensaje);
            Manejadora.MostrarNeumaticoJSON();
            alert("Verificar: " + respuesta.mensaje);
        }
        static MostrarNeumaticoJSON() {
            Manejadora.AJAX.Get(Manejadora.URL_API + "backend/listadoNeumaticosJSON.php", Manejadora.MostrarListadoSuccess, "", Manejadora.Fail);
        }
        static MostrarListadoSuccess(data) {
            let obj_array = JSON.parse(data);
            console.log("Mostrar: ", obj_array);
            let div = document.getElementById("divTabla");
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
            if (obj_array.length < 1) {
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
        static AgregarNeumatico() {
            let marca = document.getElementById("marca").value;
            let medidas = document.getElementById("medidas").value;
            let precio = document.getElementById("precio").value;
            let foto = document.getElementById("foto");
            let info = '{"marca":"' + marca + '","medidas":"' + medidas + '","precio":"' + precio + '"}';
            let form = new FormData();
            if (foto.files && foto.files[0]) {
                form.append('foto', foto.files[0]);
                form.append('marca', marca);
                form.append('medidas', medidas);
                form.append('precio', precio);
                Manejadora.AJAX.Post(Manejadora.URL_API + "backend/agregarNeumaticoBD.php", Manejadora.AgregarSuccess, form, Manejadora.Fail);
            }
            else {
                form.append('neumatico_json', info);
                Manejadora.AJAX.Post(Manejadora.URL_API + "backend/agregarNeumaticoSinFoto.php", Manejadora.AgregarSuccess, form, Manejadora.Fail);
            }
        }
        static AgregarSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Agregar: ", respuesta.mensaje);
            Manejadora.MostrarNeumaticos();
            alert("Agregar:" + respuesta.mensaje);
        }
        static MostrarNeumaticos() {
            Manejadora.AJAX.Get(Manejadora.URL_API + "backend/listadoNeumaticosBD.php", Manejadora.MostrarNeumaticosSuccess, "tabla=mostrar", Manejadora.Fail);
        }
        static MostrarNeumaticosSuccess(retorno) {
            let div = document.getElementById("divTabla");
            div.innerHTML = retorno;
            document.getElementsByName("btnModificar").forEach((boton) => {
                boton.addEventListener("click", () => {
                    let obj = boton.getAttribute("data-obj");
                    let obj_dato = JSON.parse(obj);
                    console.log(obj_dato);
                    document.getElementById("id").value = obj_dato.id;
                    document.getElementById("marca").value = obj_dato.marca;
                    document.getElementById("medidas").value = obj_dato.medidas;
                    document.getElementById("precio").value = obj_dato.precio;
                    let btn = document.getElementById("btn-modificar");
                    if (obj_dato.pathfoto !== "sinFoto") {
                        const previsualizacion = document.getElementById("imgFoto");
                        previsualizacion.src = "./backend/neumaticos/imagenes/" + obj_dato.pathfoto;
                    }
                    btn.addEventListener("click", () => {
                        Manejadora.ModificarNeumatico();
                    });
                });
            });
            document.getElementsByName("btnEliminar").forEach((boton) => {
                boton.addEventListener("click", () => {
                    let obj = boton.getAttribute("data-obj");
                    let obj_dato = JSON.parse(obj);
                    let id = obj_dato.id;
                    if (confirm(`¿Seguro de eliminar alumno con id ${id}?`)) {
                        let form = new FormData();
                        if (obj_dato.pathfoto == "sinFoto") {
                            form.append('neumatico_json', JSON.stringify(obj_dato));
                            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/eliminarNeumaticoBD.php", Manejadora.DeleteSuccess, form, Manejadora.Fail);
                        }
                        else {
                            form.append('neumatico_json', JSON.stringify(obj_dato));
                            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/eliminarNeumaticoBDFoto.php", Manejadora.DeleteSuccess, form, Manejadora.Fail);
                        }
                    }
                });
            });
            console.log(retorno);
            alert(retorno);
        }
        static DeleteSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            console.log("Eliminar: ", respuesta.mensaje);
            Manejadora.MostrarNeumaticos();
            alert("Eliminar:" + respuesta.mensaje);
        }
        static ModificarNeumatico() {
            let marca = document.getElementById("marca").value;
            let medidas = document.getElementById("medidas").value;
            let precio = document.getElementById("precio").value;
            let id = document.getElementById("id").value;
            let foto = document.getElementById("foto");
            let form = new FormData();
            let neumatico_json = '{"marca":"' + marca + '","medidas":"' + medidas + '","precio":"' + precio + '","id":"' + id + '"}';
            form.append('neumatico_json', neumatico_json);
            if (foto.files && foto.files[0]) {
                form.append('foto', foto.files[0]);
                Manejadora.AJAX.Post(Manejadora.URL_API + "backend/modificarNeumaticoBDFoto.php", Manejadora.ModificarNeumaticoSuccess, form, Manejadora.Fail);
            }
            else {
                Manejadora.AJAX.Post(Manejadora.URL_API + "backend/modificarNeumaticoBD.php", Manejadora.ModificarNeumaticoSuccess, form, Manejadora.Fail);
            }
        }
        static ModificarNeumaticoSuccess(retorno) {
            console.log(retorno);
            let respuesta = JSON.parse(retorno);
            console.log("Modificar: ", respuesta.mensaje);
            Manejadora.MostrarNeumaticos();
            alert("Modificar:" + respuesta.mensaje);
        }
        static VerificarNeumaticoBD() {
            let marca = document.getElementById("marca").value;
            let medidas = document.getElementById("medidas").value;
            let form = new FormData();
            let info = '{"marca":"' + marca + '","medidas":"' + medidas + '"}';
            form.append('obj_neumatico', info);
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/verificarNeumaticoBD.php", Manejadora.VerificarBDSuccess, form, Manejadora.Fail);
        }
        static VerificarBDSuccess(retorno) {
            let respuesta = JSON.parse(retorno);
            if (retorno.trim() == "{}") {
                alert("No existe neumatico con esas caracteristicas");
                console.log("No existe neumatico con esas caracteristicas");
            }
            else {
                console.log("Verificar: existe");
                Manejadora.MostrarNeumaticos();
                alert("Verificar:existe ");
            }
        }
        static MostrarNeumaticosBorrados() {
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/eliminarNeumaticoBDFoto.php", Manejadora.MostrarNeumaticosBorradosSuccess, '', Manejadora.Fail);
        }
        static MostrarNeumaticosBorradosSuccess(retorno) {
            let div = document.getElementById("divTabla");
            div.innerHTML = retorno;
            console.log(retorno);
            alert(retorno);
        }
        static MostrarNeumaticosBorradosJSON() {
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/mostrarBorradosJSON.php", Manejadora.MostrarNeumaticosBorradosSuccess, '', Manejadora.Fail);
        }
        static MostrarFotosModificados() {
            Manejadora.AJAX.Post(Manejadora.URL_API + "backend/mostrarFotosDeModificados.php", Manejadora.MostrarNeumaticosBorradosSuccess, '', Manejadora.Fail);
        }
    }
    Manejadora.URL_API = "./";
    Manejadora.AJAX = new LaboParcial.Ajax();
    LaboParcial.Manejadora = Manejadora;
})(LaboParcial || (LaboParcial = {}));
//# sourceMappingURL=manejadora.js.map