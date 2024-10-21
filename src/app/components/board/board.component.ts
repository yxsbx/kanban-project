import "./board.component.css";

import Sortable from "sortablejs";

import { PartialCard, CardFilter, Card } from "@app/core/interfaces";
import { CardService } from "@app/core/services";
import { SvgIconComponent } from "@app/core/utils/svg-icon.component";
import { CreateIssueComponent, BoardCardComponent } from "@app/components";

export class BoardComponent {
  private boardId: string;
  private cardService: CardService;
  private selectedFilters: CardFilter = {
    assignees: [],
    labels: [],
    types: [],
  };

  constructor(boardId: string) {
    this.boardId = boardId;
    this.cardService = new CardService();
    this.render();
  }

  async updateFilters(newFilters: CardFilter) {
    this.selectedFilters = newFilters;
    this.cardService.updateFilter(this.selectedFilters);
    await this.renderColumns();
  }

  async render() {
    const boardContainer = document.getElementById(this.boardId);
    if (!boardContainer) return;

    boardContainer.innerHTML = `<div class="board space-be" id="app-column-container"></div>`;
    await this.renderColumns();
  }

  async renderColumns() {
    const columnsContainer = document.getElementById("app-column-container");
    if (columnsContainer) {
      columnsContainer.innerHTML = "";

      const columnsData = [
        {
          id: "1",
          name: "TO DO",
          bgBadge: "#dfe1e6",
          textColor: "#42526e",
          issuesCount: 0,
        },
        {
          id: "2",
          name: "IN PROGRESS",
          bgBadge: "#deebff",
          textColor: "#0747a6",
          issuesCount: 0,
        },
        {
          id: "3",
          name: "BLOCKED",
          bgBadge: "#ffcecc",
          textColor: "#0747a6",
          issuesCount: 0,
        },
        {
          id: "4",
          name: "DONE",
          bgBadge: "#e3fcef",
          textColor: "#006644",
          issuesCount: 0,
        },
      ];

      const allCards = await this.cardService.getCards();
      const filteredCards = this.cardService.filterCards(allCards);

      columnsData.forEach((columnData) => {
        const columnElement = this.renderColumn(columnsContainer, columnData);

        const columnCards = filteredCards.filter(
          (card: PartialCard) => card.columnId === columnData.id
        );

        columnCards.forEach((card: PartialCard) => {
          new BoardCardComponent(columnElement.id, card);
        });

        this.initSortable(columnElement, columnData.id);

        columnData.issuesCount = columnCards.length;
        this.updateColumnHeader(columnElement, columnData);
      });
    }
  }

  renderColumn(parentElement: HTMLElement, columnData: any): HTMLElement {
    const columnElement = document.createElement("div");
    columnElement.id = `board-column-${columnData.id}`;
    columnElement.classList.add("board-column");

    columnElement.innerHTML = `
      <div class="board-column-header" style="background-color: ${columnData.bgBadge}; color: ${columnData.textColor}">
        <div class="board-column-header-name">
          <span>${columnData.name}</span>
          <span class="issues-count">${columnData.issuesCount} ${columnData.issuesCount > 1 ? "issues" : "issue"}</span>
        </div>
        <button id="threedot-icon-${columnData.id}" class="square-button">
          <div id="three-dot-icon-${columnData.id}"></div>
        </button>
      </div>

      <div class="board-column-content" id="board-column-content-${columnData.id}"></div>

      <div class="board-column-footer">
        <button class="btn-create-issue flex items-center" id="btn-create-issue-${columnData.id}">
          <div id="plus-icon-${columnData.id}" class="mr-2"></div>
          <span>Create issue</span>
        </button>
      </div>
    `;

    parentElement.appendChild(columnElement);

    new SvgIconComponent(
      `threedot-icon-${columnData.id}`,
      "ThreeDotIcon",
      "currentColor",
      32,
      32
    );
    new SvgIconComponent(
      `plus-icon-${columnData.id}`,
      "PlusIcon",
      "currentColor",
      16,
      16
    );

    const createIssueButton = document.getElementById(
      `btn-create-issue-${columnData.id}`
    );
    if (createIssueButton) {
      createIssueButton.addEventListener("click", () => {
        this.openCreateIssueModal(columnData.id);
      });
    }

    return columnElement;
  }

  initSortable(columnElement: HTMLElement, columnId: string) {
    const boardColumnContent = columnElement.querySelector(
      ".board-column-content"
    );
    if (boardColumnContent) {
      new Sortable(boardColumnContent as HTMLElement, {
        group: "shared",
        animation: 150,
        onEnd: (event: any) => {
          const cardId = event.item.getAttribute("data-card-id");
          const targetColumnId = columnId;

          console.log(`Card ${cardId} moved to column ${targetColumnId}`);

          const card = this.cardService
            .getCardsFromStorage()
            .find((c) => c.id === cardId);

          if (card && card.columnId !== targetColumnId) {
            card.columnId = targetColumnId;
            this.cardService.updateCard(card);
            this.renderColumns();
          }
        },
      });
    }
  }

  openCreateIssueModal(columnId: string) {
    new CreateIssueComponent(
      "create-issue-modal",
      columnId,
      (newIssue: Card) => {
        this.renderColumns();
      }
    );
  }

  updateColumnHeader(columnElement: HTMLElement, columnData: any) {
    const issuesCountElement = columnElement.querySelector(".issues-count");
    if (issuesCountElement) {
      issuesCountElement.textContent = `${columnData.issuesCount} ${
        columnData.issuesCount === 1 ? "issue" : "issues"
      }`;
    }
  }
}
