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
  muestraUsuarios
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";


const daoAlumno = getFirestore().collection("Personal");
const daousuario = getFirestore().collection("Usuario");
const daoEvaluacion = getFirestore().collection("Evaluacion");
getAuth().onAuthStateChanged(protege, muestraError);const params = new URL(location.href).searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario, ["Superadmin"])) 
  {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc = await daoAlumno.doc(id).get();
    if (doc.exists) {
      const data = doc.data();
      forma.foto_file.src = await urlStorage(id);
      forma.matricula.value = data.matricula || "";
      forma.nombre.value = data.nombre || "";
      forma.correo.value = data.correo || "";
      forma.status.value = data.status || "";
      forma.telefono.value = data.telefono || "";
      forma.fecha.value = data.fecha || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina(data.correo));
    } else {
      throw new Error("No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraUsuarios();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const foto = formData.get("foto");
    const matricula = getString( formData, "matricula").trim();  
    const nombre = getString(formData, "nombre").trim();
    const correo = getString(formData, "correo").trim();
    const telefono = getString(formData, "telefono").trim();
    const fecha = getString(formData, "fecha").trim();
    const status = getString(formData, "status").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      matricula,
      nombre,
      correo,
      telefono,
      fecha,
      status
    };
    await daoAlumno.doc(id).set(modelo);
    await subeStorage(id, foto);
    muestraUsuarios();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina(correo) {
  try {
        if (confirm("Desa eliminar?")) 
        {
          await daousuario.doc(correo).delete();
          await daoAlumno.doc(id).delete();
          await eliminaStorage(id);
          await daoEvaluacion.doc(id).delete();
          muestraUsuarios();
        }
    } catch (e) {
        muestraError(e);
    }
}

