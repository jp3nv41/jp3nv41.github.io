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
const daoMateria =  getFirestore().collection("Materia");
const daoPersonal =  getFirestore().collection("Personal");

getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Superadmin"])) {
    consulta();
  }
}

function consulta() {
  daoMateria.orderBy("materia").onSnapshot(htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) 
  {
    let materia = [];
    snap.forEach(doc => materia.push(htmlFila(doc)));
    const htmlFilas = await Promise.all(materia);
    //const htmlFilas =await Promise.all(personal);
    html += htmlFilas.join(""); 
  } 
  else{
        html += '<tr><td>SIN DATOS</td><td>-</td><td>-</td><td>-</td></tr>';
  }
  lista.innerHTML = html;
}


async function htmlFila(doc) {    
  const data = doc.data();
  var matricula = cod(data.matricula);
  const materia = cod(data.materia);
  const cantidadhrs = cod(data.cantidadhrs);
  const parametros = new URLSearchParams();
  parametros.append("id", doc.id);
  const accion='<a class="btn btn-info" href="alta_materia_form_edit.html?'+parametros+'">Actualizar</a>';
  var perso = await daoPersonal.doc(matricula).get();
  //console.log(perso);
  var nombre = "";
  var data2 = "";
  if(perso.exists){
    data2 = perso.data();
    nombre = data2.nombre;
  }
  else
  {
      nombre = "Sin Profesor";
  }
  return ('<tr><td>'+materia+'</td><td>'+nombre+'</td><td>'+cantidadhrs+'</td><td>'+accion+'</td></tr>');
}

/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

