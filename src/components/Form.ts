export default class FormComponent {
  constructor() {
    const app = document.querySelector("#app");

    if (app) app.innerHTML += this.render();
  }

  render() {
    return `
        <div id="form-burger-container"></div>
            <div class="container-fluid text-center" id="form-card-container"> 
                <form id="formCard" method="post">
                    <div class="add flex justify-center items-center">
                        <select name="tag" id="tag" required>
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
            </div>
        <div id="cards-list" class="row"></div>
        `;
  }
}
