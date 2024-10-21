import "./board-card.component.css";

import { CardTypesEnum, CardPriorityEnum } from "@app/core/enums";
import { PartialCard } from "@app/core/interfaces";
import { SvgIconComponent } from "@app/core/utils/svg-icon.component";
import { UserService } from "@app/core/services/user.service";
import { CardService } from "@app/core/services/card.service";
import { EditIssueComponent } from "../edit-issue/edit-issue.component";

export class BoardCardComponent {
  private card: PartialCard;
  private cardElement!: HTMLElement;
  private contextMenuVisible: boolean = false;
  private userService: UserService;
  private cardService: CardService;

  constructor(parentElementId: string, card: PartialCard) {
    this.card = card;
    const parentElement = document.getElementById(parentElementId);

    this.userService = new UserService();
    this.cardService = new CardService();

    if (parentElement) {
      this.cardElement = document.createElement("button");
      this.cardElement.classList.add("board-card");
      this.cardElement.setAttribute("data-card-id", this.card.id);
      parentElement.appendChild(this.cardElement);

      this.render();
    }
  }

  async render() {
    const assigneeId = this.card.assigneeId || "";
    let userAvatar = "";

    if (assigneeId) {
      const user = await this.userService.getUserById(assigneeId);
      userAvatar = user?.avatar || "";
    }

    this.cardElement.innerHTML = `
      <div class="flex flex-row justify-between">
        <div class="board-card-name">${this.card.title ?? ""}</div>
        <button id="threedot-icon-${this.card.id}" class="square-button">
          <div id="three-dot-icon-${this.card.id}"></div>
        </button>
      </div>
      <div class="flex gap-1 flex-wrap mt-2">
        ${this.renderLabels()}
      </div>
      <div class="flex flex-row justify-between items-center w-full mt-4">
        <div class="flex flex-row font-medium items-start gap-1">
          <div id="task-icon-${this.card.id}"></div>
        </div>
        <div class="flex flex-row items-center gap-2">
          <div id="priority-icon-${this.card.id}"></div>
          <div class="user-avatar" style="background-image: url('${userAvatar}'); background-size: cover; width: 32px; height: 32px; border-radius: 50%;"></div>
        </div>
      </div>
    `;

    new SvgIconComponent(
      `three-dot-icon-${this.card.id}`,
      "ThreeDotIcon",
      "currentColor",
      24,
      24
    );

    this.renderCardTypeIcon(this.card.type, this.card.id);
    this.renderCardPriorityIcon(this.card.priority, this.card.id);
    this.initContextMenu();
  }

  renderLabels(): string {
    return this.card.labels && this.card.labels.length > 0
      ? this.card.labels
          .map((label) => `<div class="label">${label}</div>`)
          .join("")
      : "";
  }

  renderCardTypeIcon(type?: CardTypesEnum, cardId?: string): void {
    const iconElementId = `task-icon-${cardId}`;
    switch (type) {
      case CardTypesEnum.TASK:
        new SvgIconComponent(
          iconElementId,
          "BlueCheckIcon",
          "currentColor",
          16,
          16
        );
        break;
      case CardTypesEnum.BUG:
        new SvgIconComponent(iconElementId, "BugIcon", "currentColor", 16, 16);
        break;
      case CardTypesEnum.STORY:
        new SvgIconComponent(
          iconElementId,
          "StoryIcon",
          "currentColor",
          16,
          16
        );
        break;
      default:
        break;
    }
  }

  renderCardPriorityIcon(priority?: string, cardId?: string): void {
    const priorityIconId = `priority-icon-${cardId}`;
    switch (priority) {
      case CardPriorityEnum.LOWEST:
        new SvgIconComponent(
          priorityIconId,
          "PriorityLowestIcon",
          "currentColor",
          16,
          16
        );
        break;
      case CardPriorityEnum.LOW:
        new SvgIconComponent(
          priorityIconId,
          "PriorityLowIcon",
          "currentColor",
          16,
          16
        );
        break;
      case CardPriorityEnum.MEDIUM:
        new SvgIconComponent(
          priorityIconId,
          "PriorityMediumIcon",
          "currentColor",
          16,
          16
        );
        break;
      case CardPriorityEnum.HIGH:
        new SvgIconComponent(
          priorityIconId,
          "PriorityHighIcon",
          "currentColor",
          16,
          16
        );
        break;
      case CardPriorityEnum.HIGHEST:
        new SvgIconComponent(
          priorityIconId,
          "PriorityHighestIcon",
          "currentColor",
          16,
          16
        );
        break;
      default:
        break;
    }
  }

  initContextMenu() {
    const threeDotButton = document.getElementById(
      `threedot-icon-${this.card.id}`
    );
    const contextMenu = document.createElement("div");
    contextMenu.classList.add(
      "context-menu",
      "hidden",
      "absolute",
      "top-full",
      "right-0"
    );

    contextMenu.innerHTML = `
      <div class="flex flex-col justify-start items-start w-30 bg-white shadow-lg rounded-md z-50">
        <button class="context-menu-item edit-task py-2 w-30 text-gray-700 hover:bg-gray-100 rounded-md">Edit</button>
        <button class="context-menu-item delete-task py-2 w-30 text-red-600 hover:bg-red-100 rounded-md">Delete</button>
      </div>
    `;

    if (threeDotButton) {
      document.body.appendChild(contextMenu);

      threeDotButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const buttonRect = threeDotButton.getBoundingClientRect();
        contextMenu.style.top = `${buttonRect.bottom + window.scrollY}px`;
        contextMenu.style.left = `${buttonRect.left}px`;

        this.contextMenuVisible = !this.contextMenuVisible;
        contextMenu.classList.toggle("hidden", !this.contextMenuVisible);
      });

      document.addEventListener("click", (event) => {
        if (!threeDotButton.contains(event.target as Node)) {
          this.contextMenuVisible = false;
          contextMenu.classList.add("hidden");
        }
      });

      const editButton = contextMenu.querySelector(".edit-task");
      if (editButton) {
        editButton.addEventListener("click", () => this.openEditIssueModal());
      }

      const deleteButton = contextMenu.querySelector(".delete-task");
      if (deleteButton) {
        deleteButton.addEventListener("click", () => this.showDeleteModal());
      }
    }
  }

  openEditIssueModal() {
    new EditIssueComponent(
      "edit-issue-modal",
      this.card.id,
      (updatedIssue: PartialCard) => {
        this.card = updatedIssue;
        this.render();
      }
    );
  }

  showDeleteModal() {
    const modal = document.createElement("div");
    modal.classList.add(
      "modal",
      "fixed",
      "inset-0",
      "flex",
      "items-center",
      "justify-center",
      "bg-black",
      "bg-opacity-50"
    );

    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p class="text-sm text-gray-600 mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <button id="cancel-button" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Cancel</button>
          <button id="confirm-delete" class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const cancelButton = document.getElementById("cancel-button");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => modal.remove());
    }

    const confirmDeleteButton = document.getElementById("confirm-delete");
    if (confirmDeleteButton) {
      confirmDeleteButton.addEventListener("click", () => {
        this.cardService.deleteCard(this.card.id);
        this.removeCardFromDOM();
        modal.remove();
      });
    }
  }

  removeCardFromDOM() {
    if (this.cardElement && this.cardElement.parentNode) {
      this.cardElement.parentNode.removeChild(this.cardElement);
    }
  }
}
