import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  getString,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  eliminaStorage,
  urlStorage,
  subeStorage
} from "../../bibliotecas/storage.js";
import {
  muestraMateriasalumnocal
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";


const daoPersonal = getFirestore().collection("Personal");
const daoMateria = getFirestore().collection("Materia");
const daoEvaluacion = getFirestore().collection("Evaluacion");
const daoUsuario =  getFirestore().collection("Usuario");
const params = new URL(location.href).searchParams;
const id = params.get("id");
const materia = params.get("materia");
const cal_actual = params.get("cal_actual");
const pocision = params.get("pocision");
const longitud = params.get("longitud");
const arreglo_mat = params.get("arreglo_mat");
const arreglo_cal = params.get("arreglo_cal");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario, ["Superadmin", "Profesor"])) {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  var cal = "";
  try {
    const doc = await daoPersonal.doc(id).get();
    const doc2 = await daoEvaluacion.doc(id).get();
    if (doc.exists) 
    {
      const data = doc.data();
      const data2 = doc2.data();
      forma.matricula.value = data.matricula || "";
      forma.nombre.value = data.nombre || "";
      forma.correo.value = data.correo || "";
      forma.materia.value = materia || "";
      if(cal_actual == "-")
      {cal = ""}
      else
      {cal = cal_actual}
      forma.calificacion.value = cal || "";
      forma.addEventListener("submit", guarda);
      //forma.eliminar.addEventListener("click", elimina);
    } else {
      throw new Error("No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraMateriasalumnocal();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    var calificaciones = "";
    var res_materia = arreglo_mat.split(",");
    var res_cal = arreglo_cal.split(",");
    var calificacion = [];
    var materia = [];
    for (var x=0; x < longitud; x++)
    {
        if(x == pocision)
        {
            calificaciones = await getString(formData, "calificacion").trim();
            calificacion.push(calificaciones);
        }
        else
        {
            calificaciones = res_cal[x];
            calificacion.push(calificaciones);
        }
        materia.push(res_materia[x])
    }
    console.log(calificacion);
    console.log(materia);
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      calificacion,
      materia
    };
    const daoEvaluacion = getFirestore().collection("Evaluacion").doc(id);
    await daoEvaluacion.set(modelo);
    muestraMateriasalumnocal();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoEvaluacion.doc(id).delete();
      muestraMateriasalumnocal();
    }
  } catch (e) {
    muestraError(e);
  }
}

