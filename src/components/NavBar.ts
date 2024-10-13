class TagManager {
  getSelectedTag() {
    const selectedTag = localStorage.getItem("selectedTag");
    if (!selectedTag) {
      return null;
    }
    return JSON.parse(selectedTag);
  }

  setTag(selectedTag: string) {
    if (selectedTag === this.getSelectedTag()) {
      localStorage.setItem("selectedTag", JSON.stringify(""));
    } else {
      localStorage.setItem("selectedTag", JSON.stringify(selectedTag));
    }
  }
}
class FilterTaskUserManager {
  getFilterSelectedUser() {
    const selectedFilterUser = localStorage.getItem("selectedFilterUser");
    if (!selectedFilterUser) {
      return null;
    }
    return JSON.parse(selectedFilterUser);
  }
  setFilterSelectedUser(selectedFilterUser: string) {
    localStorage.setItem(
      "selectedFilterUser",
      JSON.stringify(selectedFilterUser)
    );
  }
  getTaskSelectedUser() {
    const selectedTaskUser = localStorage.getItem("selectedTaskUser");
    if (!selectedTaskUser) {
      return null;
    }
    return JSON.parse(selectedTaskUser);
  }
  setTaskSelectedUser(selectedTaskUser: string) {
    localStorage.setItem("selectedTaskUser", JSON.stringify(selectedTaskUser));
  }
}
export default class NavBar {
  selectedTag: string;
  selectedFilterUser: string;
  selectedTaskUser: string;
  $header: HTMLElement;
  tags: string[];

  constructor() {
    const header = document.querySelector("#js-header") as HTMLElement;
    this.$header = header;

    const tagManager = new TagManager();
    this.selectedTag = tagManager.getSelectedTag();

    const userManager = new FilterTaskUserManager();
    this.selectedFilterUser = userManager.getFilterSelectedUser();
    this.selectedTaskUser = userManager.getTaskSelectedUser();

    this.tags = ["Front-End", "Back-End", "UX / UI", "Data"];
    this.init();
  }
  async init(): Promise<void> {
    const usersFilterHTML = await this.renderUsersForFilter();
    const usersTasksHTML = await this.renderUsersForTasks();

    if (this.$header) {
      this.$header.innerHTML = this.renderNavBar(
        usersFilterHTML,
        usersTasksHTML
      );
    }
    this.addEventListeners();
  }
  renderNavBar(usersFilterHTML: string, usersTasksHTML: string): string {
    return `
      <nav class="pl-10 flex items-center justify-around bg-gray-100">
        <h1>Lista de Tarefas</h1>
        <div id="js-tags" class="flex items-center justify-beetwen navBar h-16">
          <p>Filtros: </p>
          ${this.renderTagsForFilter() + usersFilterHTML}
        </div>
        ${usersTasksHTML}
      </nav>
    `;
  }
  renderTagsForFilter() {
    return `
      <div class="pl-10 pr-10 flex gap-8">
        ${this.tags
          .map(
            (tag) => `
          <span class="${tag === this.selectedTag ? "relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg text-white" : "border-2 border-solid border-gray-300"} rounded-lg pr-4 pl-4 pt-2 pb-2 cursor-pointer">${
            tag === this.selectedTag
              ? `
            <div>${this.selectedTag}</div>`
              : tag
          }
          </span>
        `
          )
          .join("")}
      </div>
    `;
  }
  async getUsersAPI(pokemonName: string) {
    try {
      const response: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const pokemonData: any = await response.json();
      const pokemonImgURL: string =
        pokemonData.sprites.other.dream_world.front_default;

      return pokemonImgURL;
    } catch (error) {
      console.error("Opa, pokemom errado", error);
    }
  }
  async renderUsersForFilter() {
    const img_pikachu: any = await this.getUsersAPI("pikachu");
    const img_charmander: any = await this.getUsersAPI("charizard");
    const img_blastoise: any = await this.getUsersAPI("blastoise");
    const img_bulbasaur: any = await this.getUsersAPI("bulbasaur");
    // console.log(img_pikachu);

    return `
      <div class="dropdown">
        <div id="selectedFilterUser" class="selectedFilterUser">
          <div id="img-wrapper-filter" class="img-wrapper-filter"> <!-- Adicionando um wrapper para a imagem -->
            <img data-id="1" class="img" src="${this.selectedFilterUser}" alt="" />
          </div>
        </div>
        <div class="dropdownContent-filter">
          <img class="img" src="${img_pikachu}" alt="" />
          <img class="img" src="${img_bulbasaur}" alt="" />
          <img class="img" src="${img_charmander}" alt="" />
          <img class="img" src="${img_blastoise}" alt="" />
        </div>
      </div>
    `;
  }
  async renderUsersForTasks() {
    const img_pikachu: any = await this.getUsersAPI("pikachu");
    const img_charmander: any = await this.getUsersAPI("charizard");
    const img_blastoise: any = await this.getUsersAPI("blastoise");
    const img_bulbasaur: any = await this.getUsersAPI("bulbasaur");
    // console.log(img_pikachu);

    return `
      <div class="dropdown ">
        <div id="selectedFilterUser" class="selectedFilterUser">
          <div id="img-wrapper-tasks" class="img-wrapper-tasks"> <!-- Adicionando um wrapper para a imagem -->
            <img data-id="1" class="img" src="${this.selectedTaskUser}" alt="" />
          </div>
        </div>
        <div class="dropdownContent-tasks">
          <img class="img" src="${img_pikachu}" alt="" />
          <img class="img" src="${img_bulbasaur}" alt="" />
          <img class="img" src="${img_charmander}" alt="" />
          <img class="img" src="${img_blastoise}" alt="" />
        </div>
      </div>
    `;
  }
  addEventListeners(): void {
    this.$header?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const spanElement = target.closest("span");

      if (spanElement) {
        const selectedTag = String(spanElement.textContent?.trim());
        const tagManager = new TagManager();
        tagManager.setTag(selectedTag);
        // console.log(selectedTag);
        location.reload(); // fica pro cara do update resolver kkkkk
      }
    });

    //MELHORAR ISSO, MDS QUE COISA HORROROSA
    const dropdownFilter = document.getElementById(
      "img-wrapper-filter"
    ) as HTMLElement;
    const dropdownContentFilter = document.querySelector(
      ".dropdownContent-filter"
    ) as HTMLElement;
    dropdownFilter?.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdownContentFilter.style.display = "flex";
    });
    dropdownContentFilter.addEventListener("click", (event) => {
      if (event.target instanceof HTMLImageElement) {
        const imgSrc = event.target.src;
        const saveUser = new FilterTaskUserManager();
        saveUser.setFilterSelectedUser(imgSrc);
        dropdownContentFilter.style.display = "none";
        location.reload();
      }
    });

    const dropdownTask = document.getElementById(
      "img-wrapper-tasks"
    ) as HTMLElement;
    const dropdownContentTask = document.querySelector(
      ".dropdownContent-tasks"
    ) as HTMLElement;
    dropdownTask?.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdownContentTask.style.display = "flex";
    });
    dropdownContentTask.addEventListener("click", (event) => {
      if (event.target instanceof HTMLImageElement) {
        const imgSrc = event.target.src;
        const saveUser = new FilterTaskUserManager();
        saveUser.setTaskSelectedUser(imgSrc);
        dropdownContentFilter.style.display = "none";
        location.reload();
      }
    });

    //Fecha o menu ao clicar fora do dropdown
    // document.addEventListener("click", (event) => {
    //   if (
    //     event.target instanceof Node &&
    //     !dropdownFilter.contains(event.target)
    //   ) {
    //     dropdownContentFilter.style.display = "none";
    //   }
    //   if (event.target instanceof HTMLImageElement) {
    //     const imgSrc = event.target.src;
    //     const saveUser = new FilterTaskUserManager();
    //     saveUser.setFilterSelectedUser(imgSrc);
    //     location.reload();
    //   }
    // });
  }
}
