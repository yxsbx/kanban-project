export default class FormComponent {
  constructor() {
    const form = document.querySelector("#form-burger-container");

    if (form) form.innerHTML = this.render();
  }

  render() {
    return `
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
        `;
  }
}
