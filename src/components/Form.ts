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
                        <select name="tag" id="tag">
                            <option value="frontend" selected>Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="data">Data</option>
                            <option value="ux / ui">UX / UI</option>
                        </select>
                        <label for="name">Nome
                            <input type="text" name="name" id="name"/>
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
