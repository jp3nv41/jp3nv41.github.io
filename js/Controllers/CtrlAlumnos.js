import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  cod,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  urlStorage
} from "../../bibliotecas/storage.js";
import {
  tieneRol
} from "../seguridad.js";

/** @type {HTMLUListElement} */
const lista = document.querySelector("#lista");
const daoAlumno = getFirestore().collection("Personal");
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) 
{
  if (tieneRol(usuario, ["Superadmin"])) {
    consulta();
  }
}

function consulta() {
  daoAlumno.orderBy("nombre").onSnapshot(htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) 
  {
    let personal = [];
    snap.forEach(doc => personal.push(htmlFila(doc)));
    const htmlFilas = await Promise.all(personal);
    //const htmlFilas =await Promise.all(personal);
    html += htmlFilas.join(""); 
  } 
  else{
        html += '<tr><th scope="row">-</th><td>SIN DATOS</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
  }
  lista.innerHTML = html;
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {    
  const data = doc.data();
  const foto = cod(await urlStorage(doc.id));
  const matricula = cod(data.matricula);
  const nombre = cod(data.nombre);
  const correo = cod(data.correo);
  const status = cod(data.correo);
  const telefono = cod(data.telefono);
  const fecha = cod(data.fecha);
  const parametros = new URLSearchParams();
  parametros.append("id", doc.id);
  const accion='<a class="btn btn-info" href="alta_usuario_form_edit.html?'+parametros+'">Actualizar</a>';
  
  return ('<tr><th scope="row"><img src="'+foto+'"alt="Falta el Avatar" style="height: 50px; width: auto"></th><td>'+matricula+'</td><td>'+nombre+'</td><td>'+correo+'</td><td>'+status+'</td><td>'+telefono+'</td><td>'+fecha+'</td><td>'+accion+'</td></tr>');
}

/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

