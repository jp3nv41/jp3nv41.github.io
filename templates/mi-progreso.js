class MiProgeso
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
        `<div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Cargando...</div>
        </div>`;
  }
}

customElements.define(
  "mi-progreso", MiProgeso);
