import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  getString,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  muestraMaterias
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";

const daoMateria = getFirestore().collection("Materia");
const daoPersonal = getFirestore().collection("Personal");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Superadmin"])) {
    forma.addEventListener("submit", guarda);
    selectPersonal(forma.matricula, "");
  }
}


export function selectPersonal(select,valor){
    valor = valor || "";
    daoPersonal.orderBy("status").onSnapshot(snap => {
        let html = "<option value=''</option>Sin Profesor</option>";
        snap.forEach(doc => html += htmlPersonal(doc, valor));
        select.innerHTML = html;
      },
      e => {
        muestraError(e);
        selectPersonal(select, valor);
      }
    );
}
function htmlPersonal(doc, valor) {
  const selected = doc.id === valor ? "selected" : "";
  /**
   * @type {import("./tipos.js").
                  Pasatiempo} */
  const data = doc.data();
  if(data.status == "Profesor" || data.status == "Superadmin")
  return ('<option value="'+data.matricula+'"'+selected+'>'+data.nombre+'</option>');
}




/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const cantidadhrs = getString(formData, "cantidadhrs").trim();
    const materia = getString(formData, "materia").trim();
    //const profesor = getString(formData, "profesor").trim();
    const matricula = getString(formData, "matricula").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      cantidadhrs,
      materia,
      matricula
      //profesor,
    };
    await daoMateria.
      add(modelo);
    muestraMaterias();
  } catch (e) {
    muestraError(e);
  }
}

