import loadComponent from "../utils/loadComponent";
import FormComponent from "./Form";


export class AddButton {
  constructor() {
    loadComponent(this.render());
    this.addEventListener();
  }

  render() {
    return /*HTML*/ `
    <button id="add-button" class="w-fit p-2.5 rounded-xl " style="background-color: #4f5966; color: white">Adicionar</button>
    `;
  }

  addEventListener() {
    const $addButton = document.querySelector("#add-button");
    $addButton?.addEventListener("click", () => {
      new FormComponent();
    });
  }
}
