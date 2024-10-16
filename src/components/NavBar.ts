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
    const actualFilterUser = localStorage.getItem("selectedFilterUser");
    const parsedFilterUser = actualFilterUser
      ? JSON.parse(actualFilterUser)
      : null;

    if (parsedFilterUser === selectedFilterUser) {
      localStorage.removeItem("selectedFilterUser");
    } else {
      localStorage.setItem(
        "selectedFilterUser",
        JSON.stringify(selectedFilterUser)
      );
    }
  }
  getTaskSelectedUser() {
    const selectedTaskUser = localStorage.getItem("selectedTaskUser");
    if (!selectedTaskUser) {
      return null;
    }
    return JSON.parse(selectedTaskUser);
  }
  setTaskSelectedUser(selectedTaskUser: string) {
    const actualTaskUser = localStorage.getItem("selectedTaskUser");
    const parsedTaskUser = actualTaskUser ? JSON.parse(actualTaskUser) : null;

    if (parsedTaskUser === selectedTaskUser) {
      localStorage.removeItem("selectedTaskUser");
    } else {
      localStorage.setItem(
        "selectedTaskUser",
        JSON.stringify(selectedTaskUser)
      );
    }
  }
}
export default class NavBar {
  selectedTag: string;
  selectedFilterUser: string;
  selectedTaskUser: string;
  $header: HTMLElement;
  $filterMenu: HTMLDivElement;
  $filterMenuContainer: HTMLDivElement;
  $usersFilterMenu: HTMLDivElement;
  $usersFilterMenuContainer: HTMLDivElement;
  $selectedUserTaskContainer: HTMLDivElement;
  $usersTaskMenu: HTMLDivElement;
  $tagsMenu: HTMLDivElement;
  $tagsContainer: HTMLDivElement;
  tags: string[];

  constructor() {
    const header = document.querySelector("#js-header") as HTMLElement;
    this.$header = header;

    const filterMenu = document.querySelector(
      "#js-filterMenu"
    ) as HTMLDivElement;
    this.$filterMenu = filterMenu;
    const filterMenuContainer = document.querySelector(
      "#js-filterMenuContainer"
    ) as HTMLDivElement;
    this.$filterMenuContainer = filterMenuContainer;

    const tagsMenu = document.querySelector("#js-tagsMenu") as HTMLDivElement;
    this.$tagsMenu = tagsMenu;
    const tagsContainer = document.querySelector(
      "#js-tagsContainer"
    ) as HTMLDivElement;
    this.$tagsContainer = tagsContainer;

    const usersFilterMenu = document.querySelector(
      "#js-usersFilterMenu"
    ) as HTMLDivElement;
    this.$usersFilterMenu = usersFilterMenu;
    const usersFilterMenuContainer = document.querySelector(
      "#js-usersFilterMenuContainer"
    ) as HTMLDivElement;
    this.$usersFilterMenuContainer = usersFilterMenuContainer;

    const usersTaskMenu = document.querySelector(
      "#js-usersTaskMenu"
    ) as HTMLDivElement;
    this.$usersTaskMenu = usersTaskMenu;
    const selectedUserTaskContainer = document.querySelector(
      "#js-selectedUserTaskContainer"
    ) as HTMLDivElement;
    this.$selectedUserTaskContainer = selectedUserTaskContainer;

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
    this.$filterMenu = document.querySelector(
      "#js-filterMenu"
    ) as HTMLDivElement;
    this.$filterMenuContainer = document.querySelector(
      "#js-filterMenuContainer"
    ) as HTMLDivElement;

    this.$tagsMenu = document.querySelector("#js-tagsMenu") as HTMLDivElement;
    this.$tagsContainer = document.querySelector(
      "#js-tagsContainer"
    ) as HTMLDivElement;

    this.$usersFilterMenu = document.querySelector(
      "#js-usersFilterMenu"
    ) as HTMLDivElement;
    this.$usersFilterMenuContainer = document.querySelector(
      "#js-usersFilterMenuContainer"
    ) as HTMLDivElement;

    this.$usersTaskMenu = document.querySelector(
      "#js-usersTaskMenu"
    ) as HTMLDivElement;
    this.$selectedUserTaskContainer = document.querySelector(
      "#js-selectedUserTaskContainer"
    ) as HTMLDivElement;

    this.addEventListeners();
  }
  renderNavBar(usersFilterHTML: string, usersTasksHTML: string): string {
    return `
      <nav class="pl-10 flex items-center justify-around bg-gray-100 border-b-2">
        <h1 class="font-medium text-lg cursor-default">Lista de Tarefas</h1>
        <div id="js-tags" class="flex items-center justify-beetwen navBar h-16">
          <div id="js-filterMenu" class="relative flex flex-col items-center justify-center w-24 h-full cursor-pointer hover:bg-gray-200 hover:border-4 hover:border-b-indigo-400"">
            <p id="js-textDivFilter" class="font-thin text-lg">Filtros</p>
            <div id="js-filterMenuContainer" class="absolute m-1 top-full shadow-xl hidden items-left justify-center flex-col w-36 h-40">
              <div id="js-tagsMenu" class="flex items-center justify-center bg-gray-200 hover:bg-gray-300 h-full">
                <p class="font-light text-lg">Tags</p> 
                <p class="absolute text-lg left-3/4 translate-x-2">></p>
                ${this.renderTagsForFilter()}
              </div>
              <div id="js-usersFilterMenu" class="rounded-bl-md flex items-center justify-center bg-gray-200 hover:bg-gray-300 h-full">
                <p class="font-light text-lg">Usuário</p>
                <p class="absolute text-lg left-3/4 translate-x-2">></p>
                ${usersFilterHTML}
              </div>
            </div>
          </div>
        </div>
        ${usersTasksHTML}
      </nav>
    `;
  }
  renderTagsForFilter() {
    return `
      <div id="js-tagsContainer" class="shadow-xl cursor-default absolute top-0 bg-gray-300 rounded-br-md left-full h-full w-80 hidden grid-rows-2 grid-cols-2 items-center justify-items-center justify-center">
        ${this.tags
          .map(
            (tag) => `
          <span class="${
            tag === this.selectedTag
              ? "relative bg-slate-600 rounded-lg text-white"
              : ""
          } w-32 flex items-center justify-center h-12 border-2 border-solid border-gray-300 rounded-lg cursor-pointer">${
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
    let selectedUserText: string;
    let display: string;
    if (!this.selectedFilterUser) {
      display = "hidden";
      selectedUserText = `
        <p class="text-center row-start-1 row-span-2 col-start-1 col-span-1">Selecione um usuário:</p>
      `;
    } else {
      display = "block";
      selectedUserText = `
        <p class="absolute bottom-2 row-start-2 row-span-1 col-start-1 col-span-1">Filtro Atual</p>
      `;
    }

    return `
      <div id="js-usersFilterMenuContainer" class="cursor-default bg-gray-300 shadow-xl w-80 h-full top-0 rounded-bl-md absolute left-full hidden grid-rows-2 grid-cols-3 items-center justify-items-center justify-center"> 
        <div id="js-selectedFilterUser" class="${display} drop-shadow-lg cursor-pointer w-16 h-16 row-start-1 row-span-2 col-start-1 col-span-1">
            <img class="" src="${this.selectedFilterUser}" alt="" />
        </div>
        <div class="drop-shadow-lg cursor-pointer w-12 row-start-1 row-span-1 col-start-2 col-span-1">
          <img src="${img_pikachu}" alt="" />
        </div>
        <div class="drop-shadow-lg cursor-pointer w-12 row-start-2 row-span-1 col-start-2 col-span-1">
          <img src="${img_bulbasaur}" alt="" />
        </div>
        ${selectedUserText}
        <div class="drop-shadow-lg cursor-pointer w-12 row-start-1 row-span-1 col-start-3 col-span-1">
          <img src="${img_charmander}" alt="" />
        </div>
        <div class="drop-shadow-lg cursor-pointer w-12 row-start-2 row-span-1 col-start-3 col-span-1">
          <img src="${img_blastoise}" alt="" />
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
      <div id="js-selectedUserTaskContainer" class="absolute top-1 gap-1 flex flex-col items-center justify-center bg-transparent">
        <div class="w-14 h-14 bg-neutral-300 rounded-full overflow-hidden flex items-center justify-center">
          <div class="flex items-center justify-center w-full h-full rounded-full overflow-hidden cursor-pointer">
            <img class="" src="${this.selectedTaskUser}" alt="" />
          </div>
        </div>
        <div id="js-usersTaskMenu" class="rounded-b-md shadow-xl hidden flex-col items-center justify-center bg-gray-200 w-20 shadow-lg">
          <img class="hover:bg-gray-300 p-2 drop-shadow-lg cursor-pointer" src="${img_pikachu}" alt="" />
          <img class="hover:bg-gray-300 p-2 drop-shadow-lg cursor-pointer" src="${img_bulbasaur}" alt="" />
          <img class="hover:bg-gray-300 p-2 drop-shadow-lg cursor-pointer" src="${img_charmander}" alt="" />
          <img class="hover:bg-gray-300 p-2 drop-shadow-lg cursor-pointer" src="${img_blastoise}" alt="" />
        </div>
      </div>
    `;
  }
  addEventListeners(): void {
    this.$filterMenu?.addEventListener("mouseenter", () => {
      this.$filterMenuContainer?.classList.remove("hidden");
      this.$filterMenuContainer?.classList.add("flex");
      const text = document.querySelector(
        "#js-textDivFilter"
      ) as HTMLParagraphElement;
      text.innerHTML = "Filtrar por:";
    });
    this.$filterMenu?.addEventListener("mouseleave", () => {
      this.$filterMenuContainer?.classList.remove("flex");
      this.$filterMenuContainer?.classList.add("hidden");
      const text = document.querySelector(
        "#js-textDivFilter"
      ) as HTMLParagraphElement;
      text.innerHTML = "Filtros";
    });
    this.$tagsMenu?.addEventListener("mouseenter", () => {
      this.$tagsContainer?.classList.remove("hidden");
      this.$tagsContainer?.classList.add("grid");
    });
    this.$tagsMenu?.addEventListener("mouseleave", () => {
      this.$tagsContainer?.classList.remove("grid");
      this.$tagsContainer?.classList.add("hidden");
    });
    this.$tagsContainer?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const spanElement = target.closest("span");
      if (spanElement) {
        const selectedTag = String(spanElement.textContent?.trim());
        const tagManager = new TagManager();
        tagManager.setTag(selectedTag);
        location.reload(); // fica pro cara do update resolver kkkkk
      }
    });
    this.$usersFilterMenu?.addEventListener("mouseenter", () => {
      this.$usersFilterMenuContainer?.classList.remove("hidden");
      this.$usersFilterMenuContainer?.classList.add("grid");
    });
    this.$usersFilterMenu?.addEventListener("mouseleave", () => {
      this.$usersFilterMenuContainer?.classList.remove("grid");
      this.$usersFilterMenuContainer?.classList.add("hidden");
    });
    this.$usersFilterMenuContainer?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const spanElement = target.closest("img");
      if (spanElement) {
        const selectedFilterUser = String(spanElement.src?.trim());
        const filterTaskUserManager = new FilterTaskUserManager();
        filterTaskUserManager.setFilterSelectedUser(selectedFilterUser);
        location.reload(); // fica pro cara do update resolver kkkkk
      }
    });

    this.$selectedUserTaskContainer?.addEventListener("mouseenter", () => {
      this.$usersTaskMenu.classList.remove("hidden");
      this.$usersTaskMenu.classList.add("flex");
      this.$usersTaskMenu?.addEventListener("click", (event) => {
        if (event.target instanceof HTMLImageElement) {
          const imgSrc = event.target.src;
          const saveUser = new FilterTaskUserManager();
          saveUser.setTaskSelectedUser(imgSrc);

          location.reload(); // fica pro cara do update resolver kkkkk
        }
      });
      this.$selectedUserTaskContainer?.addEventListener("mouseleave", () => {
        this.$usersTaskMenu.classList.remove("flex");
        this.$usersTaskMenu.classList.add("hidden");
      });
    });
  }
}
