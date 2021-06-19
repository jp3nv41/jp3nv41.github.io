import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  getString,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  subeStorage
} from "../../bibliotecas/storage.js";
import {
  muestraUsuarios
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";

/** @type {HTMLFormElement} */
const daoAlumno = getFirestore().collection("Personal");
const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario, ["Superadmin"])) {
    forma.addEventListener(
      "submit", guarda);
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
    const Rol = [status];
    const modelo_user = {Rol, matricula};
    const daoUsuario = getFirestore().collection("Usuario").doc(correo);
    await daoUsuario.set(modelo_user);
    const daoAlumno = getFirestore().collection("Personal").doc(matricula);
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
    await daoAlumno.set(modelo);
    await subeStorage(matricula, foto);
    muestraUsuarios();
  } catch (e) {
    muestraError(e);
  }
}

