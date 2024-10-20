import CardEntity from "../models/cardEntity";
import { formatCurrentDate } from "../utils/formatDate";

export default class FormComponent {
  $kanbanFormContainer: HTMLDivElement;
  $kanbanForm: HTMLFormElement;
  constructor() {
    this.$kanbanForm = document.querySelector("#formCard") as HTMLFormElement;
    this.$kanbanFormContainer = document.createElement("div");
    this.$kanbanFormContainer.id = "form-card-container";

    //CLASSES DO FORMULARIO (id = formCard)
    this.$kanbanFormContainer.classList.add("container-fluid", "text-center");

    this.init();
  }
  render() {
    const app = document.querySelector("#app") as HTMLDivElement;
    const formString: string = /*HTML*/ `
      <div id="modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40">
        <form id="formCard" method="post" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg z-50">
            <div class="add w-fit px-5 py-5 rounded-xl flex flex-col gap-4 justify-center bg-zinc-300">
              <h2 class="text-xl font-semibold py-3">Adicionar uma tarefa</h2>
              <select name="tag" id="tag" required class="p-2 rounded-md bg-white">
                <option value="" disabled selected>Selecione uma Tag</option>
                <option value="Front-End">Frontend</option>
                <option value="Back-End">Backend</option>
                <option value="Data">Data</option>
                <option value="UX / UI">UX / UI</option>
              </select>
              <input type="text" name="name" id="name" placeholder="Nome" required class="p-2 rounded-md"/>
              <input type="text" name="description" id="description" placeholder="Descrição" class="p-2 rounded-md">
              <button type="submit" class="py-2 rounded-md bg-slate-600 text-white">Confirmar</button>
              <button type="button" id="cancel-button" class="py-2 rounded-md bg-rose-800 text-white">Cancelar</button>
            </div>
        </form>
      </div>
    `;
    this.$kanbanFormContainer.innerHTML = formString;
    if (app) app.append(this.$kanbanFormContainer);
  }
  async init() {
    this.render();
    await this.loadContent();
    this.addEventListener();
  }
  async loadContent() {
    this.$kanbanForm = document.querySelector("#formCard") as HTMLFormElement;
  }
  addEventListener() {
    this.$kanbanForm.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();

      const target = event.target as any; //Need to be changed

      const arrayCards: Array<CardEntity> = JSON.parse(
        localStorage.getItem("arrayCards") ?? "[]"
      );
      const idCard = Date.now();
      const currentDate = formatCurrentDate();

      const createdById = localStorage.getItem("selectedTaskUser");
      let userId: number;
      let parsedCreatedBy: string = "";
      if (createdById) {
        userId = Number(JSON.parse(createdById));
        switch (userId) {
          case 0:
            parsedCreatedBy = "pikachu";
            break;
          case 1:
            parsedCreatedBy = "charizard";
            break;
          case 2:
            parsedCreatedBy = "blastoise";
            break;
          case 3:
            parsedCreatedBy = "bulbasaur";
            break;
        }
      } else {
        parsedCreatedBy = "Anônimo";
      }

      arrayCards.push({
        id: idCard,
        status: "Para Fazer",
        tag: target?.elements["tag"].value,
        name: target?.elements["name"].value,
        description: target?.elements["description"].value,
        createdAt: currentDate,
        createdBy: parsedCreatedBy,
      });

      localStorage.setItem("arrayCards", JSON.stringify(arrayCards));

      this.$kanbanForm.remove();
    });

    const $cancelButton = document.querySelector('#cancel-button')
    $cancelButton?.addEventListener("click", (event) => {
      event.preventDefault();
      this.$kanbanFormContainer.remove();
    });
  }
}
