import "./container-filter-control.css";

import { UserService } from "@app/core/services/user.service";
import { User } from "@app/core/interfaces";
import { SvgIconComponent } from "@app/core/utils/svg-icon.component";
import { CardTypesEnum } from "@app/core/enums";
import { CardFilter } from "@app/core/interfaces";

export class ContainerFilterControl {
  private containerId: string;
  private clearFiltersVisible: boolean;
  private selectedFilters: CardFilter = {
    assignees: [],
    labels: [],
    types: [],
  };
  private users: Array<User> = [];
  private labels: Array<string> = [];
  private cardTypes: { label: CardTypesEnum; icon: string }[] = [
    { label: CardTypesEnum.TASK, icon: "BlueCheckIcon" },
    { label: CardTypesEnum.BUG, icon: "BugIcon" },
    { label: CardTypesEnum.STORY, icon: "StoryIcon" },
  ];
  private onChanged: Function;

  private contextMenuVisible = {
    label: false,
    type: false,
  };

  constructor(
    containerId: string,
    clearFiltersVisible: boolean,
    onChanged: Function
  ) {
    this.containerId = containerId;
    this.clearFiltersVisible = clearFiltersVisible;
    this.onChanged = onChanged;
    this.loadUsers();
    this.labels = this.loadLabels();
    this.render();
  }

  async loadUsers() {
    const userService = new UserService();
    this.users = await userService.getUsers();
    this.render();
  }

  loadLabels(): string[] {
    return [
      "Important",
      "Deployed",
      "Discussion",
      "Testing",
      "Urgent",
      "Later",
    ];
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const labelButtonClass =
      this.selectedFilters.labels.length > 0
        ? "trigger-button active"
        : "trigger-button";
    const typeButtonClass =
      this.selectedFilters.types.length > 0
        ? "trigger-button active"
        : "trigger-button";

    container.innerHTML = `
      <form id="filter-form" class="flex flex-row items-center">
        <div class="search-container hidden md:inline-flex">
          <div id="search-icon-action"></div>
          <input type="text" placeholder="Search" class="search-input">
        </div>
        <div id="app-filter-control">
            <div class="action-container">
        <div class="contributors">
          ${this.users.map((user) => this.renderAvatar(user)).join("")}
        </div>
        <div class="relative">
          <button class="${labelButtonClass}" id="label-filter-button">
            Label
            <div id="label-arrow-icon" class="icon"></div>
          </button>
          <div class="dropdown-menu" id="label-menu">
            <div class="filter-options">
              ${this.labels.map((label) => this.renderLabelOption(label)).join("")}
            </div>
          </div>
        </div>
        <div class="relative">
          <button class="${typeButtonClass}" id="type-filter-button">
            Type
            <div id="type-arrow-icon" class="icon"></div>
          </button>
          <div class="dropdown-menu" id="type-menu">
            <div class="filter-options">
              ${this.cardTypes.map((type) => this.renderTypeOption(type)).join("")}
            </div>
          </div>
        </div>
        ${this.clearFiltersVisible ? `<button id="clear-filters-button" class="clear-filters">Clear Filters</button>` : ""}
      </form>
    `;

    new SvgIconComponent(
      "search-icon-action",
      "SearchIcon",
      "currentColor",
      24,
      24
    );
    new SvgIconComponent(
      "label-arrow-icon",
      "ArrowDownIcon",
      "currentColor",
      16,
      16
    );
    new SvgIconComponent(
      "type-arrow-icon",
      "ArrowDownIcon",
      "currentColor",
      16,
      16
    );

    this.initAssigneeEventListeners();
    this.initLabelEventListeners();
    this.initTypeEventListeners();
    this.initClearFiltersEventListener();
  }

  renderAvatar(user: User): string {
    return `
      <button class="avatar-container app-avatar" id="avatar-${user.id}" style="background-image: url('${user.avatar}');" aria-label="${user.name}">
        <div class="tooltip">${user.name}</div>
      </button>
    `;
  }

  renderLabelOption(label: string): string {
    return `
      <label class="filter-option">
        <input type="checkbox" id="label-${label}" value="${label}" ${
          this.selectedFilters.labels.includes(label) ? "checked" : ""
        } />
        <div class="flex items-center gap-2">
          <span>${label}</span>
        </div>
      </label>
    `;
  }

  renderTypeOption(type: { label: CardTypesEnum; icon: string }): string {
    return `
      <label class="filter-option">
        <input type="checkbox" id="type-${type.label}" value="${type.label}" ${
          this.selectedFilters.types.includes(type.label) ? "checked" : ""
        } />
        <div class="flex items-center gap-2">
          <div id="icon-${type.label}"></div>
          <span>${type.label}</span>
        </div>
      </label>
    `;
  }

  initAssigneeEventListeners() {
    this.users.forEach((user) => {
      const avatarElement = document.getElementById(`avatar-${user.id}`);
      if (avatarElement) {
        avatarElement.addEventListener("click", (event) => {
          event.preventDefault();
          this.toggleAssignee(user.id);
        });
      }
    });
  }

  toggleAssignee(userId: string) {
    if (this.selectedFilters.assignees.includes(userId)) {
      this.selectedFilters.assignees = this.selectedFilters.assignees.filter(
        (id) => id !== userId
      );
    } else {
      this.selectedFilters.assignees = [
        ...this.selectedFilters.assignees,
        userId,
      ];
    }
    this.updateFilters();
  }

  initLabelEventListeners() {
    const button = document.getElementById("label-filter-button");
    const menu = document.getElementById("label-menu");

    if (button) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.contextMenuVisible.label = !this.contextMenuVisible.label;

        if (menu) {
          menu.classList.toggle("active", this.contextMenuVisible.label);
        }
      });
    }

    this.labels.forEach((label) => {
      const labelElement = document.getElementById(`label-${label}`);
      if (labelElement) {
        labelElement.addEventListener("change", () => this.toggleLabel(label));
      }
    });
  }

  toggleLabel(label: string) {
    if (this.selectedFilters.labels.includes(label)) {
      this.selectedFilters.labels = this.selectedFilters.labels.filter(
        (l) => l !== label
      );
    } else {
      this.selectedFilters.labels = [...this.selectedFilters.labels, label];
    }
    this.updateButtonState("label-filter-button");
    this.updateFilters();
  }

  initTypeEventListeners() {
    const button = document.getElementById("type-filter-button");
    const menu = document.getElementById("type-menu");

    if (button) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.contextMenuVisible.type = !this.contextMenuVisible.type;

        if (menu) {
          menu.classList.toggle("active", this.contextMenuVisible.type);
        }
      });
    }

    this.cardTypes.forEach((type) => {
      const typeElement = document.getElementById(`type-${type.label}`);
      if (typeElement) {
        typeElement.addEventListener("change", () =>
          this.toggleType(type.label)
        );
      }
    });
  }

  toggleType(type: CardTypesEnum) {
    if (this.selectedFilters.types.includes(type)) {
      this.selectedFilters.types = this.selectedFilters.types.filter(
        (t) => t !== type
      );
    } else {
      this.selectedFilters.types = [...this.selectedFilters.types, type];
    }
    this.updateButtonState("type-filter-button");
    this.updateFilters();
  }

  updateButtonState(buttonId: string) {
    const button = document.getElementById(buttonId);
    if (button) {
      if (
        buttonId === "type-filter-button" &&
        this.selectedFilters.types.length > 0
      ) {
        button.classList.add("active");
      } else if (
        buttonId === "label-filter-button" &&
        this.selectedFilters.labels.length > 0
      ) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    }
  }

  initClearFiltersEventListener() {
    const clearButton = document.getElementById("clear-filters-button");
    if (clearButton) {
      clearButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.clearFilters();
      });
    }
  }

  clearFilters() {
    this.selectedFilters = {
      assignees: [],
      labels: [],
      types: [],
    };
    this.updateFilters();
    this.render();
  }

  updateFilters() {
    this.onChanged(this.selectedFilters);
  }
}
