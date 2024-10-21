import "./create-issue.component.css";

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

export class CreateIssueComponent {
  private modalId: string;
  private columnId: string;
  private cardService: CardService;
  private userService: UserService;
  private users: User[] = [];
  private onIssueCreated: Function;

  constructor(modalId: string, columnId: string, onIssueCreated: Function) {
    this.modalId = modalId;
    this.columnId = columnId;
    this.cardService = new CardService();
    this.userService = new UserService();
    this.onIssueCreated = onIssueCreated;
    this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.userService.getUsers();
    this.render();
  }

  render() {
    const modalContainer = document.createElement("div");
    modalContainer.id = this.modalId;
    modalContainer.classList.add("modal");
    modalContainer.innerHTML = `
      <div class="modal-content">
        <span id="close-modal" class="close">&times;</span>
        <h2>Create a new issue</h2>
        <form id="create-issue-form">
          <div class="form-group">
            <label for="issue-title">Title</label>
            <input type="text" id="issue-title" placeholder="Issue title" required />
          </div>
          <div class="form-group">
            <label for="issue-description">Description</label>
            <textarea id="issue-description" placeholder="Issue description" required></textarea>
          </div>
          <div class="form-group">
            <label for="issue-type">Type</label>
            <select id="issue-type" required>
              <option value="${CardTypesEnum.TASK}">Task</option>
              <option value="${CardTypesEnum.BUG}">Bug</option>
              <option value="${CardTypesEnum.STORY}">Story</option>
            </select>
          </div>
          <div class="form-group">
            <label for="issue-priority">Priority</label>
            <select id="issue-priority" required>
              ${CardPriorities.map((priority) => `<option value="${priority.name}">${priority.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="issue-assignee">Assignee</label>
            <select id="issue-assignee" required>
              ${this.users.map((user) => `<option value="${user.id}" ${user.selected ? "selected" : ""}>${user.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="issue-labels">Labels</label>
            <div id="label-list" class="label-checkbox-group-labels">
              ${predefinedLabels
                .map(
                  (label) => `
                    <label class="label-item-labels">
                      <input type="checkbox" value="${label}" /> 
                      <span>${label}</span>
                    </label>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="form-group">
            <label for="issue-start-date">Start Date</label>
            <input type="date" id="issue-start-date" required />
          </div>
          <div class="form-group">
            <label for="issue-due-date">Due Date</label>
            <input type="date" id="issue-due-date" required />
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
    const createIssueForm = document.getElementById("create-issue-form");

    if (closeModalButton) {
      closeModalButton.addEventListener("click", () => {
        this.closeModal();
      });
    }

    if (createIssueForm) {
      createIssueForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.saveIssue();
      });
    }

    window.addEventListener("click", (event) => {
      if (event.target === modalElement) {
        this.closeModal();
      }
    });
  }

  saveIssue() {
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
    const reporterId = this.getSelectedUser().id;
    const labelCheckboxes = document.querySelectorAll(
      "#label-list input[type='checkbox']"
    );
    const issueLabels: string[] = [];
    labelCheckboxes.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked) {
        issueLabels.push((checkbox as HTMLInputElement).value);
      }
    });
    const startDate = (
      document.getElementById("issue-start-date") as HTMLInputElement
    ).value;
    const dueDate = (
      document.getElementById("issue-due-date") as HTMLInputElement
    ).value;

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const issueId = this.generateId();

    const newIssue: Card = {
      id: issueId,
      title: issueTitle,
      type: issueType,
      columnId: this.columnId,
      priority: issuePriority,
      assigneeId: assigneeId,
      reporterId: reporterId,
      labels: issueLabels,
      description: issueDescription,
      startDate: startDate,
      dueDate: dueDate,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    console.log("Saved Issue:", newIssue);
    this.cardService.addCard(newIssue);
    this.onIssueCreated(newIssue);

    this.closeModal();
  }

  generateId() {
    return "card-" + Math.random().toString(36).substr(2, 9);
  }

  getSelectedUser(): User {
    return this.users.find((user) => user.selected) || this.users[0];
  }

  closeModal() {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      modalElement.remove();
    }
  }
}
