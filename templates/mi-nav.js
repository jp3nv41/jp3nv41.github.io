import {
  cargaRoles
} from "../js/seguridad.js";
import {
  getAuth
} from "../bibliotecas/coneccion.js";
import {
  muestraError
} from "../bibliotecas/funciones.js";

class MiNav extends HTMLElement {
  connectedCallback() {
      var menusss=location.pathname.split('/');
      var long=menusss.length - 1;
      var activo="";
      var compa=menusss[long];
        if(compa=="index.html")
            activo='class="active"';
        this.innerHTML = /* html */
            '<ul class="main-menu"><li '+activo+'><a href="index.html"> Inicio </a></li></ul>';
        this.ul = this.querySelector("ul");
        getAuth().onAuthStateChanged(usuario => this.cambiaUsuario(usuario,compa),muestraError);
  }

  /**
   * @param {import(
      "../lib/tiposFire.js").User}
      usu */
    async cambiaUsuario(usu,compa) {
        var pag_1="";
        var pag_2="";
        var pag_3="";
        var pag_4="";
        var pag_5="";
        switch (compa){
            case "alta_usuario.html":
                pag_1='class="active"';
            break;
            case "alta_materia.html":
                pag_2='class="active"';
            break;
            case "materia_alumno.html":
                pag_3='class="active"';
            break;
            case "registrar_calificacion.html":
                pag_4='class="active"';
            break;
            case "ver_calificacion.html":
                pag_5='class="active"';
            break;
        }
        if (usu && usu.email) 
        {
            let html = "";
            const roles = await cargaRoles(usu.email);

            if (roles.has("Superadmin")) 
            {
                html += /* html */
                '<li '+pag_1+'><a href="alta_usuario.html"> Usuario </a></li>\n\
                <li '+pag_2+'><a href="alta_materia.html"> Materia </a></li>\n\
                <li '+pag_3+'><a href="materia_alumno.html"> Registrar materias a alumnos </a></li>\n\
                <li '+pag_4+'><a href="registrar_calificacion.html"> Registrar calificaciones </a></li>\n\
                <li '+pag_5+'><a href="ver_calificacion.html"> Ver calificaciones </a></li>';
            }

            if (roles.has("Profesor")) 
            {
            html += /* html */
                '<li '+pag_4+'><a href="registrar_calificacion.html"> Registrar calificaciones </a></li>'
            }

            if (roles.has("Alumno")) 
            {
            html += /* html */
                '<li '+pag_5+'><a href="ver_calificacion.html"> Ver calificaciones </a></li>';
            }
            
            this.ul.innerHTML += html;
        }
    }
}

customElements.define("mi-nav", MiNav);
