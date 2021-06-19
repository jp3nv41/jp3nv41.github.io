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
const daoPersonal = getFirestore().collection("Personal");
const daoEvaluacion =  getFirestore().collection("Evaluacion");

getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario, ["Superadmin"])) { consulta();
  }
}

function consulta() {
  daoPersonal.orderBy("status").onSnapshot(htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) 
  {
    let evaluacion = [];
    snap.forEach(doc => evaluacion.push(htmlFila(doc)));
    const htmlFilas = await Promise.all(evaluacion);
    //const htmlFilas =await Promise.all(personal);
    html += htmlFilas.join(""); 
  } 
  else{
        html += '<tr><td>SIN DATOS</td><td>-</td><td>-</td></tr>';
  }
  lista.innerHTML = html;
}
/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {
  const data = doc.data();
  const matricula = cod(data.matricula);
  const status = cod(data.status);
  const nombre = cod(data.nombre);
  const parametros = new URLSearchParams();
  parametros.append("id", doc.id);
  const accion='<a class="btn btn-info" href="materia_alumno_form.html?'+parametros+'">Actualizar</a>';
  var perso_mat = await daoEvaluacion.doc(matricula).get();
  //console.log(perso);
  var materia = "";
  var data2 = "";
  var returnval = [];
  if(perso_mat.exists){
    data2 = perso_mat.data();
    materia = data2.materia;
  }
  else
  {
      materia = ["Sin Materias Registradas"];
  }
  for (var x=0; x < materia.length; x++) 
  {
      if(x == 0)
      {
          var datos = '<tr><td>'+nombre+'</td><td>'+materia[x]+'</td><td>'+accion+'</td></tr><p hidden>';
      }
      else
      {
          var datos = '</p><tr><td>'+nombre+'</td><td>'+materia[x]+'</td><td>'+accion+'</td></tr><p hidden>';
      }
      if(status == "Alumno")
          returnval.push(datos);
  }
  return (returnval);
}
/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

