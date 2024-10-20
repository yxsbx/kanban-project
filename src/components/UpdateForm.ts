import CardEntity from "../models/cardEntity";
import { Tag } from "../utils/filterTasts";
import loadComponent from "../utils/loadComponent";

export default class UpdateForm {
  private taskId: number;

  constructor(taskId: number) {
    this.taskId = taskId;
    loadComponent(this.render());
    this.addEventListener();
    this.loadTaskFromLocalStorage(taskId);
  }

  render() {
    return /*HTML*/ `
      <div id="modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40">
        <form id="formCard" method="post" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg z-50">
          <div class="add w-fit px-5 py-5 rounded-xl flex flex-col gap-4 justify-center bg-zinc-300">
            <h2 class="text-xl font-semibold py-3 text-center">Editar uma tarefa</h2>
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
  }

  loadTaskFromLocalStorage(id: number) {
    const tasks: CardEntity[] = JSON.parse(
      localStorage.getItem("arrayCards") ?? "[]"
    );
    const taskIndex = tasks.findIndex((tasks) => +tasks.id === +id);
    if (taskIndex !== -1) {
      const selectedTask = tasks[taskIndex];
      this.populateFormFields(selectedTask);
    }
    return taskIndex;
  }

  populateFormFields(task: CardEntity) {
    const tagField = document.querySelector("#tag") as HTMLSelectElement;
    const nameField = document.querySelector("#name") as HTMLInputElement;
    const descriptionField = document.querySelector(
      "#description"
    ) as HTMLInputElement;

    if (tagField && nameField && descriptionField) {
      tagField.value = task.tag;
      nameField.value = task.name;
      descriptionField.value = task.description;
    }
  }

  setLocalStorageTask(updatedTask: CardEntity) {
    const tasks: CardEntity[] = JSON.parse(localStorage.getItem("arrayCards") ?? "[]");
    const taskIndex = tasks.findIndex((task) => +task.id === +updatedTask.id);

    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      localStorage.setItem("arrayCards", JSON.stringify(tasks));
    }
  }

  addEventListener() {
    const $updateForm = document.querySelector("#formCard");

    $updateForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      
      const tagField = document.querySelector("#tag") as HTMLSelectElement;
      const nameField = document.querySelector("#name") as HTMLInputElement;
      const descriptionField = document.querySelector("#description") as HTMLInputElement;

      if (tagField && nameField && descriptionField) {
      const tasks: CardEntity[] = JSON.parse(localStorage.getItem("arrayCards") ?? "[]");
      const existingTask = tasks.find(task => +task.id === this.taskId);

      if (existingTask) {
        const updatedTask: CardEntity = {
        ...existingTask,
        tag: tagField.value as Tag,
        name: nameField.value,
        description: descriptionField.value,
        };

        this.setLocalStorageTask(updatedTask);
      }
      }

      window.alert("A tarefa foi editada com sucesso!");

      $updateForm.remove();
    });
    const $cancelButton = document.querySelector('#cancel-button')
    $cancelButton?.addEventListener("click", (event) => {
      const $modal = document.querySelector("#modal")
      event.preventDefault();
      $modal?.remove();
    });
  }
}
