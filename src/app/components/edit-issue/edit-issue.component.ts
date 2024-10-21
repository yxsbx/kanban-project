import "./edit-issue.component.css";
import { CardTypesEnum } from "@app/core/enums";
import { CardService } from "@app/core/services";
import { UserService } from "@app/core/services/user.service";
import { User, Card } from "@app/core/interfaces";
import { CardPriorities } from "@app/core/constants";

const predefinedLabels = [
  "Important",
  "Deployed",
  "Discussion",
  "Testing",
  "Urgent",
  "Later",
];

export class EditIssueComponent {
  private modalId: string;
  private cardId: string;
  private cardService: CardService;
  private userService: UserService;
  private users: User[] = [];
  private cardData!: Card;
  private onIssueUpdated: Function;

  constructor(modalId: string, cardId: string, onIssueUpdated: Function) {
    this.modalId = modalId;
    this.cardId = cardId;
    this.cardService = new CardService();
    this.userService = new UserService();
    this.onIssueUpdated = onIssueUpdated;

    this.loadCardData();
    this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.userService.getUsers();
    this.render();
  }

  loadCardData() {
    const cards = this.cardService.getCardsFromStorage();
    const foundCard = cards.find((card) => card.id === this.cardId);
    if (!foundCard) {
      throw new Error("Card not found!");
    }
    this.cardData = foundCard;

    if (!this.cardData) {
      console.error("Card not found!");
      return;
    }
  }

  render() {
    const modalContainer = document.createElement("div");
    modalContainer.id = this.modalId;
    modalContainer.classList.add("modal");

    modalContainer.innerHTML = `
      <div class="modal-content">
        <span id="close-modal" class="close">&times;</span>
        <h2>Edit Issue</h2>
        <form id="edit-issue-form">
          <div class="form-group">
            <label for="issue-title">Title</label>
            <input type="text" id="issue-title" value="${this.cardData.title}" required />
          </div>
          <div class="form-group">
            <label for="issue-description">Description</label>
            <textarea id="issue-description" required>${this.cardData.description}</textarea>
          </div>
          <div class="form-group">
            <label for="issue-type">Type</label>
            <select id="issue-type" required>
              <option value="${CardTypesEnum.TASK}" ${this.cardData.type === CardTypesEnum.TASK ? "selected" : ""}>Task</option>
              <option value="${CardTypesEnum.BUG}" ${this.cardData.type === CardTypesEnum.BUG ? "selected" : ""}>Bug</option>
              <option value="${CardTypesEnum.STORY}" ${this.cardData.type === CardTypesEnum.STORY ? "selected" : ""}>Story</option>
            </select>
          </div>
          <div class="form-group">
            <label for="issue-priority">Priority</label>
            <select id="issue-priority" required>
              ${CardPriorities.map((priority) => `<option value="${priority.name}" ${this.cardData.priority === priority.name ? "selected" : ""}>${priority.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="issue-assignee">Assignee</label>
            <select id="issue-assignee" required>
              ${this.users.map((user) => `<option value="${user.id}" ${this.cardData.assigneeId === user.id ? "selected" : ""}>${user.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="issue-column">Column</label>
            <select id="issue-column" required>
              <option value="1" ${this.cardData.columnId === "1" ? "selected" : ""}>Todo</option>
              <option value="2" ${this.cardData.columnId === "2" ? "selected" : ""}>In Progress</option>
              <option value="3" ${this.cardData.columnId === "3" ? "selected" : ""}>Blocked</option>
              <option value="4" ${this.cardData.columnId === "4" ? "selected" : ""}>Done</option>
            </select>
          </div>
          <div class="form-group">
            <label for="issue-labels">Labels</label>
            <div id="label-list" class="label-checkbox-group-labels">
              ${predefinedLabels
                .map(
                  (label) => `
                <label class="label-item-labels">
                  <input type="checkbox" value="${label}" ${this.cardData.labels.includes(label) ? "checked" : ""} /> 
                  <span>${label}</span>
                </label>
              `
                )
                .join("")}
            </div>
          </div>
          <div class="form-group">
            <label for="issue-start-date">Start Date</label>
            <input type="date" id="issue-start-date" value="${this.cardData.startDate}" required />
          </div>
          <div class="form-group">
            <label for="issue-due-date">Due Date</label>
            <input type="date" id="issue-due-date" value="${this.cardData.dueDate}" required />
          </div>
          <div class="form-group">
            <label for="issue-reporter">Reporter</label>
            <input type="text" id="issue-reporter" value="${this.getUserById(this.cardData.reporterId)?.name || ""}" disabled />
          </div>
          <button type="submit" class="btn-save-issue">Save Issue</button>
        </form>
      </div>
    `;

    document.body.appendChild(modalContainer);
    this.initEventListeners();
  }

  initEventListeners() {
    const modalElement = document.getElementById(this.modalId);
    const closeModalButton = document.getElementById("close-modal");
    const editIssueForm = document.getElementById("edit-issue-form");

    if (closeModalButton) {
      closeModalButton.addEventListener("click", () => {
        this.closeModal();
      });
    }

    if (editIssueForm) {
      editIssueForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.updateIssue();
      });
    }

    window.addEventListener("click", (event) => {
      if (event.target === modalElement) {
        this.closeModal();
      }
    });
  }

  updateIssue() {
    const issueTitle = (
      document.getElementById("issue-title") as HTMLInputElement
    ).value;
    const issueDescription = (
      document.getElementById("issue-description") as HTMLTextAreaElement
    ).value;
    const issueType = (
      document.getElementById("issue-type") as HTMLSelectElement
    ).value as CardTypesEnum;
    const issuePriority = (
      document.getElementById("issue-priority") as HTMLSelectElement
    ).value;
    const assigneeId = (
      document.getElementById("issue-assignee") as HTMLSelectElement
    ).value;
    const columnId = (
      document.getElementById("issue-column") as HTMLSelectElement
    ).value;

    const labelInputs = document.querySelectorAll(
      "#label-list input[type='checkbox']"
    );
    const issueLabels: string[] = [];
    labelInputs.forEach((input) => {
      const htmlInput = input as HTMLInputElement;
      if (htmlInput.checked) {
        issueLabels.push(htmlInput.value);
      }
    });

    const startDate = (
      document.getElementById("issue-start-date") as HTMLInputElement
    ).value;
    const dueDate = (
      document.getElementById("issue-due-date") as HTMLInputElement
    ).value;

    const updatedAt = new Date().toISOString();

    const updatedIssue: Card = {
      ...this.cardData,
      title: issueTitle,
      type: issueType,
      priority: issuePriority,
      assigneeId: assigneeId,
      columnId: columnId,
      labels: issueLabels,
      description: issueDescription,
      startDate: startDate,
      dueDate: dueDate,
      updatedAt: updatedAt,
    };

    console.log("Updated Issue:", updatedIssue);
    this.cardService.updateCard(updatedIssue);
    this.onIssueUpdated(updatedIssue);

    this.closeModal();
  }

  getUserById(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  closeModal() {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      modalElement.remove();
    }
  }
}
