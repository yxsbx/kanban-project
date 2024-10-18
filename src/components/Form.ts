export default class FormComponent {
  constructor() {
    const form = document.querySelector("#form-burger-container");

    if (form) form.innerHTML = this.render();
  }

  render() {
    return `
            <form id="formCard" method="post"><div class="add">
                    <select name="tag" id="tag">
                        <option value="frontend" selected>Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="ux">UX</option>
                    </select>
                    <textarea name="description" id="description"></textarea>
                    <button type="submit">Adicionar</button>
                </div>
            </form>
        `;
  }
}
