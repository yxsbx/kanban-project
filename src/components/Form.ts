import CardEntity from "../models/cardEntity";
import { formatCurrentDate } from "../utils/formatDate";

export default class FormComponent {
  $kanbanFormContainer: HTMLDivElement;
  $kanbanForm: HTMLFormElement;
  constructor() {
    this.$kanbanForm = document.querySelector("#formCard") as HTMLFormElement;
    this.$kanbanFormContainer = document.createElement("div");
    this.$kanbanFormContainer.id = "form-card-container";
    this.$kanbanFormContainer.classList.add("container-fluid", "text-center");

    this.init();
  }
  render() {
    const app = document.querySelector("#app") as HTMLDivElement;
    const formString: string = `
					<form id="formCard" method="post">
							<div class="add flex border-2 justify-center items-center">
									<select name="tag" id="tag" required class="border-2 flex justify-center items-center">
											<option value="" disabled selected>Selecione uma Tag</option>
											<option value="Front-End">Frontend</option>
											<option value="Back-End">Backend</option>
											<option value="Data">Data</option>
											<option value="UX / UI">UX / UI</option>
									</select>
									<label for="name">Nome
											<input type="text" name="name" id="name" required/>
									</label>
									<label for="description">Descrição
											<input type="text" name="description" id="description">
									</label>
									<button type="submit">Adicionar</button>
							</div>
					</form>
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
      console.log(idCard);
      const currentDate = formatCurrentDate();

      arrayCards.push({
        id: idCard,
        status: "Para Fazer",
        tag: target?.elements["tag"].value,
        name: target?.elements["name"].value,
        description: target?.elements["description"].value,
        createdAt: currentDate,
        createdBy: "",
      });

      localStorage.setItem("arrayCards", JSON.stringify(arrayCards));

      this.$kanbanForm.reset();
    });
  }
}
