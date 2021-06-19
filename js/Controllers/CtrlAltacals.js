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
const daoMateria = getFirestore().collection("Materia");
const daoEvaluacion = getFirestore().collection("Evaluacion");
const daoUsuario =  getFirestore().collection("Usuario");
const vec_lista = new Array();
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) 
{
  if (tieneRol(usuario, ["Superadmin", "Profesor"])) 
  { 
      consulta(usuario.email);
  }
}

async function consulta(email_log) {
  //daoPersonal.orderBy("nombre").onSnapshot(htmlLista, errConsulta);
  const user = await daoUsuario.doc(email_log).get();
  const datau = user.data(); //datau.matricula
  var datau_matricula = datau.matricula;
  daoMateria.orderBy("materia").onSnapshot(snap => { 
      let materia_nombre = "";
      snap.forEach(sub => materia_nombre += buscar_materia(sub, datau_matricula));
      
      console.log("1"+daoEvaluacion);
      daoEvaluacion.onSnapshot(snap2 => {
          let evaluacion_matricula = "";
          console.log("2"+materia_nombre);
          console.log("3"+materia_nombre);
          snap2.forEach(sub2 => evaluacion_matricula += buscar_evaluacion(sub2, materia_nombre));
          console.log("7"+evaluacion_matricula);

      }, errConsulta);
      
      
    }, errConsulta);
}
async function pintatabla(tabladata)
{
    let html = "";
    vec_lista.push(tabladata);
    console.log("11"+tabladata);
    html += vec_lista.join("");
    lista.innerHTML = html; 
}

async function buscar_evaluacion(sub2, materia_nombre)
{
    var evaluacion_datos = sub2.data(); 
    var longitud = evaluacion_datos.materia.length;
    var usuario_matricula = "";
    console.log("3"+evaluacion_datos);
    console.log("4"+longitud);
    console.log("5"+usuario_matricula);
    var materia_calif = "-";
    
    for(var x=0; x<longitud; x++)
    {
        console.log("8"+evaluacion_datos.materia[x] +" == "+ materia_nombre);
        if(evaluacion_datos.materia[x] == materia_nombre)
              {
                  usuario_matricula = sub2.id;
                  materia_calif = evaluacion_datos.calificacion[x];
                  console.log("6"+evaluacion_datos.calificacion[x]);
                  break;
              }    
    }
    if(usuario_matricula != "")
    {
        const personal_dato = await daoPersonal.doc(usuario_matricula).get();
              if(personal_dato.exists)
              {
                  var data_per = personal_dato.data();
                  const parametros = usuario_matricula;
                  const accion='<a class="btn btn-info" href="materia_alumno_cal_form.html?id='+parametros+'&materia='+materia_nombre+'&cal_actual='+materia_calif+'&pocision='+x+'&longitud='+longitud+'&arreglo_mat='+evaluacion_datos.materia+'&arreglo_cal='+evaluacion_datos.calificacion+'">Actualizar</a>';
                  var datos = '<tr><td>'+data_per.nombre+'</td><td>'+materia_nombre+'</td><td>'+materia_calif+'</td><td>'+accion+'</td></tr>';

              }
    }
    else
    {
        var datos = '';
    }
    //console.log("10"+datos);
    pintatabla(datos);
    return datos;
              //return (materia_datos.matricula +''+materia_datos.materia);
}



function buscar_materia(sub, datau_matricula)
{
    var materia_datos = sub.data(); 
    if(materia_datos.matricula == datau_matricula)
          {
              //console.log(materia_datos.materia);
              return (materia_datos.materia);
          }
    else
    {
        return("");
    }
              //return (materia_datos.matricula +''+materia_datos.materia);
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
  var calificacion = "";
  var data2 = "";
  var returnval = [];
  if(perso_mat.exists){
    data2 = perso_mat.data();
    materia = data2.materia;
    calificacion = data2.calificacion;
  }
  else
  {
      materia = ["Sin Materias Registradas"];
      calificacion = ["Sin Calificaciones Registradas"];
  }
  
  for (var x=0; x < materia.length; x++) 
  {
      var datos = '<tr><td>'+nombre+'</td><td>'+materia[x]+'</td><td>'+calificacion[x]+'</td><td>'+accion+'</td></tr>';
      if(status == "Alumno" && materia != ["Sin Materias Registradas"])
          returnval.push(datos);
  }
  return (returnval);
  
}
/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

