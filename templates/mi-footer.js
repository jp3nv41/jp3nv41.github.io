class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
        `<p>
            Copyright 2020 <br> Dominguez Sanchez Jose Ignacio<br>
            Secuencia: 3NV41<br>
            Boleta: 2014130331
        </p>`;
    }
}

customElements.define(
  "mi-footer", MiFooter);
