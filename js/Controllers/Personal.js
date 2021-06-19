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
  muestraPersonales
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";

const daoDoctor =  getFirestore().collection("Doctor");
const daoSucursal = getFirestore().collection("Sucursal");
const params = new URL(location.href).searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["SuperAdmin"])) 
  {
    busca();
  }
}

export function selectSucursal(select,valor){
    valor = valor || "";
    daoSucursal.orderBy("nombre").onSnapshot(snap => {
        let html = "";
        snap.forEach(doc => html += htmlSucursal(doc, valor));
        select.innerHTML = html;
      },
      e => {
        muestraError(e);
        selectSucursal(select, valor);
      }
    );
}
function htmlSucursal(doc, valor) {
  const data = doc.data();
  const selected = data.nombre === valor ? "selected" : "";
  /**
   * @type {import("./tipos.js").
                  Pasatiempo} */
  
  return ('<option value="'+data.nombre+'"'+selected+'>'+data.nombre+'</option>');
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc = await daoDoctor.doc(id).get();
    if (doc.exists) 
    {
      /**
       * @type {
          import("./tipos.js").
                  Alumno} */
      const data = doc.data();
      forma.foto_file.src = await urlStorage(id);
      forma.nombre.value = data.nombre || "";
      forma.paterno.value = data.paterno || "";
      forma.materno.value = data.materno || "";
      forma.email.value = data.email || "";
      var date=data.fecha_nacimiento.toDate();
      var ano=date.getFullYear();
      var mes=date.getMonth()+1;
      var dia=date.getDate();
      if(mes<10)
          mes='0'+mes;
      if(dia<10)
          dia='0'+dia;
      var salida_date=ano+'-'+mes+'-'+dia;
      forma.fecha_nacimiento.value = salida_date || "";      
      forma.cedula.value = data.cedula || "";
      selectSucursal(forma.sucursal, data.sucursal);
      
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } 
    else 
    {
      throw new Error(
        "Dato no Encontrado.");
    }
  } catch (e) {
    muestraError(e);
    muestraPersonales();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const foto = formData.get("foto");
    const nombre = getString(formData, "nombre").trim();  
    const paterno = getString(formData, "paterno").trim();  
    const materno = getString(formData, "materno").trim();  
    const email = getString(formData, "email").trim();  
    const fecha_nacimiento = new Date(getString(formData, "fecha_nacimiento").trim());
    fecha_nacimiento.setDate(fecha_nacimiento.getDate()+ 1);
    const cedula = getString(formData, "cedula").trim();
    const sucursal = getString(formData, "sucursal").trim(); 
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      nombre,
      paterno,
      materno,
      cedula,
      fecha_nacimiento,
      sucursal,
      email
    };
    await daoDoctor.doc(id).set(modelo);
    await subeStorage(id, foto);
    
    muestraPersonales();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
        if (confirm("Desa eliminar?")) 
        {
          await daoDoctor.doc(id).delete();
          await eliminaStorage(id);
          muestraPersonales();
        }
    } catch (e) {
        muestraError(e);
    }
}

