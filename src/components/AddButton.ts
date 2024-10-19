import FormComponent from "./Form";

function loadComponent(component: string, id?: string) {
  const wrapper = document.querySelector<HTMLDivElement>(id ? id : "#app");

  if (wrapper) {
    wrapper.insertAdjacentHTML("beforeend", component);
  }
}

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
