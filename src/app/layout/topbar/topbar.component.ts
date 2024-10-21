import "./topbar.component.css";

import { UserService } from "@app/core/services";
import { SvgIconComponent } from "@app/core/utils/svg-icon.component";
import { User } from "@app/core/interfaces";

export class TopbarComponent {
  private userService: UserService;
  private displayTopbarMenuItems: Array<{ [key: string]: unknown }>;
  private topbarMenuItems: Array<{ name: string; selected: boolean }>;
  private selectedUser: User | null = null;
  private users: User[] = [];
  private topbarId: string;

  constructor(topbarId: string) {
    this.userService = new UserService();
    this.topbarId = topbarId;
    this.topbarMenuItems = [
      { name: "Your work", selected: false },
      { name: "Projects", selected: true },
      { name: "Filters", selected: false },
      { name: "Dashboards", selected: false },
      { name: "People", selected: false },
      { name: "Plans", selected: false },
      { name: "Apps", selected: false },
    ];
    this.displayTopbarMenuItems = this.topbarMenuItems;
    this.init();
  }

  async init() {
    this.render();
    await this.loadSelectedUser();
    await this.loadUsers();
    this.setupBreakpointObserver();
    this.setupDropdownToggle();
  }

  async loadSelectedUser() {
    const users = await this.userService.getUsers();
    this.selectedUser = users.find((user: User) => user.selected) || users[0];
    this.renderAvatar();
  }

  async loadUsers() {
    this.users = await this.userService.getUsers();
    this.render();
  }

  async selectUser(newSelectedUser: User) {
    if (this.selectedUser) {
      this.selectedUser.selected = false;
      await this.userService.updateUser(this.selectedUser);
    }

    newSelectedUser.selected = true;
    this.selectedUser = newSelectedUser;
    await this.userService.updateUser(newSelectedUser);

    this.renderAvatar();
    this.closeDropdown();
  }

  setupDropdownToggle() {
    const dropdownButton = document.getElementById("pokemon-list-button");
    const dropdownMenu = document.getElementById("user-dropdown");

    if (dropdownButton && dropdownMenu) {
      dropdownButton.addEventListener("click", () => {
        dropdownMenu.classList.toggle("hidden");
      });

      document.addEventListener("click", (event) => {
        if (
          !dropdownButton.contains(event.target as Node) &&
          !dropdownMenu.contains(event.target as Node)
        ) {
          dropdownMenu.classList.add("hidden");
        }
      });

      dropdownMenu?.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const userId = target
          .closest(".dropdown-item")
          ?.getAttribute("data-user-id");

        if (userId) {
          const newSelectedUser = this.users.find((user) => user.id === userId);
          if (newSelectedUser) {
            this.selectUser(newSelectedUser);
          }
        }
      });
    }
  }

  closeDropdown() {
    const dropdownMenu = document.getElementById("user-dropdown");
    if (dropdownMenu) {
      dropdownMenu.classList.add("hidden");
    }
  }

  setupBreakpointObserver() {
    const smallBreakpoint = window.matchMedia("(max-width: 599px)");
    const mediumBreakpoint = window.matchMedia(
      "(min-width: 600px) and (max-width: 959px)"
    );
    const largeBreakpoint = window.matchMedia("(min-width: 960px)");

    const handleResize = () => {
      if (smallBreakpoint.matches) {
        this.displayTopbarMenuItems = this.topbarMenuItems.slice(0, 1);
      } else if (mediumBreakpoint.matches) {
        this.displayTopbarMenuItems = this.topbarMenuItems.slice(0, 3);
      } else if (largeBreakpoint.matches) {
        this.displayTopbarMenuItems = this.topbarMenuItems.slice(0, 7);
      }

      this.render();
    };

    smallBreakpoint.addListener(handleResize);
    mediumBreakpoint.addListener(handleResize);
    largeBreakpoint.addListener(handleResize);

    handleResize();
  }

  render() {
    const topbarContentContainer = document.getElementById(this.topbarId);

    if (!topbarContentContainer) {
      return;
    }

    const jiraIconHtml = `
      <div class="icon sm:block md:block xl:hidden" id="jiraIcon-icon"></div>
      <div class="icon hidden xl:block" id="jira-icon"></div>
    `;

    topbarContentContainer.innerHTML = `
        <div class="flex flex-row">
          <div class="brand">
            <div id="menu-icon"></div>
            <a href="/">
              ${jiraIconHtml}
            </a>
          </div>
          <div class="menu flex flex-row items-center">
            ${this.displayTopbarMenuItems
              .map(
                (item) => `
            <div class="menu-item ${item.selected ? "active" : ""}">
                  <button class="button">
                    ${item.name}
                    <div class="icon" id="icon-${item.name}"></div>
                  </button>
                </div>`
              )
              .join("")}
            ${
              this.displayTopbarMenuItems.length < 7
                ? `<button class="button h-8 w-8 bg-primary rounded text-white font-bold ml-2">+</button>`
                : ""
            }
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="search-container hidden md:inline-flex">
            <div id="search-icon"></div>
            <input type="text" placeholder="Search" class="search-input">
          </div>
      
          <button class="circle-icon-button" title="Notifications">
            <div class="icon" id="bell-icon"></div>
          </button>
          <button class="circle-icon-button" title="Help">
            <div class="icon" id="question-mark-icon"></div>
          </button>
          <button class="circle-icon-button" title="Settings">
            <div class="icon" id="config-icon"></div>
          </button>
  
          <div id="pokemon-list" class="relative">
            <button id="pokemon-list-button">
              <img src="${this.selectedUser?.avatar}" alt="${this.selectedUser?.name}" class="avatar-image" />
            </button>
            <div id="user-dropdown" class="hidden absolute right-0 bg-white border border-gray-300 p-2 rounded shadow-md w-60 z-10">
              ${this.users
                .filter((user) => user.id !== this.selectedUser?.id)
                .map(
                  (user) => `
                <div class="dropdown-item p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100" data-user-id="${user.id}">
                  <img src="${user.avatar}" alt="${user.name}" class="avatar-image" />
                  <span>${user.name}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

    new SvgIconComponent("jira-icon", "JiraIcon", "currentColor", 134, 24);
    new SvgIconComponent(
      "jiraIcon-icon",
      "JiraSmallIcon",
      "currentColor",
      24,
      24
    );
    new SvgIconComponent("menu-icon", "MenuIcon", "currentColor", 24, 24);
    this.displayTopbarMenuItems.forEach((item) => {
      new SvgIconComponent(
        `icon-${item.name}`,
        "ArrowDownIcon",
        "currentColor",
        24,
        24
      );
    });
    new SvgIconComponent("search-icon", "SearchIcon", "currentColor", 24, 24);
    new SvgIconComponent("bell-icon", "BellIcon", "currentColor", 24, 24);
    new SvgIconComponent(
      "question-mark-icon",
      "QuestionMarkIcon",
      "currentColor",
      24,
      24
    );
    new SvgIconComponent("config-icon", "ConfigIcon", "currentColor", 24, 24);
  }

  renderAvatar() {
    const pokemonListContainer = document.getElementById("pokemon-list-button");
    if (pokemonListContainer && this.selectedUser) {
      pokemonListContainer.innerHTML = `
        <img src="${this.selectedUser.avatar}" alt="${this.selectedUser.name}" class="avatar-image" />
      `;
    }
  }
}
