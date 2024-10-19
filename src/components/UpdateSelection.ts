import FormComponent from "./Form";

export default class UpdateSelection {
  constructor() {
    this.loadComponent(this.render());
    this.addEventListener();
  }

  render(): string {
    const taskID: (string | { id: string })[] = JSON.parse(localStorage.getItem("arrayCards") ?? "[]");

    return /*HTML*/ `
    <select id="id-selection" name="id" class="flex">
      <option value="" disabled selected>Selecione o ID</option>
      ${taskID.map((id: string | { id: string }) => {
      if (typeof id === 'object') {
      return `<option value="${id.id}">${id.id}</option>`;
      } else {
      return `<option value="${id}">${id}</option>`;
      }
      })}
    </select>
    `;
  }

  addEventListener() {
    const $idSelection = document.querySelector("#id-selection")
    $idSelection?.addEventListener('change', () => {
      new FormComponent();
    })
  }

  loadComponent(component: string, id?: string) {
    const wrapper = document.querySelector<HTMLDivElement>(id ? id : "#app");

    if (wrapper) {
      wrapper.insertAdjacentHTML("beforeend", component);
    }
  }
}
