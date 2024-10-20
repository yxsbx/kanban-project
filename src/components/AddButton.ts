import loadComponent from "../utils/loadComponent";
import FormComponent from "./Form";

export class AddButton {
  constructor() {
    loadComponent(this.render());
    this.addEventListener();
  }

  render() {
    return /*HTML*/ `
    <button id="add-button" class="w-fit p-2.5 rounded-xl bg-slate-600 text-white">Adicionar</button>
    `;
  }

  addEventListener() {
    const $addButton = document.querySelector("#add-button");
    $addButton?.addEventListener("click", () => {
      const existingForm = document.querySelector("#form-card-container");
      if (existingForm) {
        existingForm.remove();
      }
      new FormComponent();
    });
  }
}
