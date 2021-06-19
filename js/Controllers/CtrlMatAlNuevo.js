import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  getString,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  muestraMateriasalumno
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";

const daoMateria = getFirestore().collection("Materia");
const daoEvaluacion = getFirestore().collection("Evaluacion");
const daoPersonal = getFirestore().collection("Personal");
/** @type {HTMLFormElement} */
const params = new URL(location.href).searchParams;
const id = params.get("id");
const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario, ["Superadmin"])) {
    busca();
    //const doc = await daoEvaluacion.doc("2014130333").get();
    
  }
}


export function selectMateria(select,valor){
    valor = valor || "";
    daoMateria.orderBy("materia").onSnapshot(snap => {
        let html = "";
        snap.forEach(doc => html += htmlMateria(doc, valor));
        select.innerHTML = html;
      },
      e => {
        muestraError(e);
        selectMateria(select, valor);
      }
    );
}
function htmlMateria(doc, valor) {
  const data_materia = doc.data();
  const data_valor = valor;
  //const check = data_materia.materia === valor ? "checked" : "";
  var check =  ""
  for (var x=0; x < valor.length; x++) 
  {
      if(valor[x] == data_materia.materia)
      {
          check = 'checked';
          break
      }
      else
      {
          check = '';
      }
  }
  return ('<input type="checkbox" '+check+' name="checkbox[]"  id="'+data_materia.materia+'" value="'+data_materia.materia+'"> '+data_materia.materia+'<br>');
}




async function busca() {
  try {
    const doc = await daoPersonal.doc(id).get();
    const doc2 = await daoEvaluacion.doc(id).get();
    if (doc.exists) 
    {
      /**
       * @type {
          import("./tipos.js").
                  Alumno} */
      const data = doc.data();
      const data2 = doc2.data();
      var arr_mat = [];
      if(doc2.exists)
      {
          arr_mat = data2.materia;
      }
      else
      {
          arr_mat = [];
      }
      forma.matricula.value = data.matricula || "";
      forma.nombre.value = data.nombre || "";
      forma.correo.value = data.correo || "";
      //selectMateria(forma.matricula, data.matricula);
      //console.log(data2.materia)
      selectMateria(document.getElementById("materiadiv"), arr_mat);
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } else {
      throw new Error("No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraMateriasalumno();
  }
}



/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);  
    const matricula = getString(formData, "matricula").trim();
    
    const calificacion = [];
    const materia = [];
    const cont = "-"; 
    const checkboxes = document.getElementsByName('checkbox[]').length;
    var materias = '';
    var chkds = '';

    for (var x=0; x < checkboxes; x++) 
    {
        materias = document.getElementsByName('checkbox[]')[x].value;
        chkds = document.getElementsByName('checkbox[]')[x];
        //const materias = document.getElementsByName('checkbox');
        if(chkds.checked)  
        {
            console.log(materias)
            calificacion.push(cont);
            materia.push(materias);   
        }   
         
    }
    console.log(materia)
    //console.log(materias)
    //console.log(checkboxes)
    //const profesor = getString(formData, "profesor").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
        calificacion,
        materia
      //profesor,
    };
    const daoEvaluacion = getFirestore().collection("Evaluacion").doc(matricula);
    await daoEvaluacion.set(modelo);
    
    muestraMateriasalumno();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
        if (confirm("Desa eliminar?")) 
        {
          await daoEvaluacion.doc(id).delete();
          muestraMateriasalumno();
        }
    } catch (e) {
        muestraError(e);
    }
}




