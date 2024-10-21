import "./board-container.component.css";

import { ContainerFilterControl, BoardComponent } from "@app/components";
import { SvgIconComponent } from "@app/core/utils/svg-icon.component";
import { CardFilter } from "@app/core/interfaces";

export class BoardContainerComponent {
  private boardId: string;
  private contextMenuVisible: boolean = false;
  private boardComponent!: BoardComponent;
  private clearFiltersVisible: boolean = true;

  constructor(boardId: string) {
    this.boardId = boardId;
    this.render();
  }

  render() {
    const boardContainer = document.getElementById(this.boardId);
    if (!boardContainer) return;

    boardContainer.innerHTML = `
      <div id="app-board-heading" class="board-heading">
        <div class="flex gap-2 mb-1 flex-row">
          <div>Projects</div>
          <div>/</div>
          <a href="/" class="bradcrumb-link text-textGray">Jira Clone</a>
        </div>

        <div class="board-title">
          <textarea class="textarea-inline" rows="1">Agile Board</textarea>

          <div class="flex flex-row items-baseline">
            <button id="thunder-icon" class="square-button"></button>
            <button id="star-icon" class="square-button mx-px"></button>
            <button id="three-dot-icon" class="square-button board-context-menu"></button>
          </div>
        </div>

        <div id="context-menu" class="context-menu hidden">
          <button class="context-menu-item">Manage workflow</button>
          <button class="context-menu-item">Configure board</button>
        </div>
      </div>
      <div id="app-board-action" class="action-container"></div>
      <div id="app-board" class="app-board"></div>
    `;

    new SvgIconComponent("thunder-icon", "ThunderIcon", "currentColor", 32, 24);
    new SvgIconComponent("star-icon", "StarIcon", "currentColor", 32, 24);
    new SvgIconComponent(
      "three-dot-icon",
      "ThreeDotIcon",
      "currentColor",
      32,
      24
    );

    new SvgIconComponent(
      "select-suffix-icon",
      "ArrowDownIcon",
      "currentColor",
      16,
      16
    );

    new ContainerFilterControl(
      "app-board-action",
      this.clearFiltersVisible,
      this.handleFiltersChanged.bind(this)
    );

    this.boardComponent = new BoardComponent("app-board");

    this.initContextMenu();
  }

  async handleFiltersChanged(newFilters: CardFilter) {
    if (this.boardComponent) {
      this.boardComponent.updateFilters(newFilters);
      await this.boardComponent.render();
    } else {
      console.error("BoardComponent is not initialized yet.");
    }
  }

  private toggleContextMenu() {
    const contextMenu = document.getElementById("context-menu");
    if (contextMenu) {
      this.contextMenuVisible = !this.contextMenuVisible;
      contextMenu.classList.toggle("hidden", !this.contextMenuVisible);
    }
  }

  private initContextMenu() {
    const threeDotIcon = document.getElementById("three-dot-icon");
    const contextMenu = document.getElementById("context-menu");

    if (threeDotIcon && contextMenu) {
      threeDotIcon.addEventListener("click", () => this.toggleContextMenu());

      document.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (!threeDotIcon.contains(target) && !contextMenu.contains(target)) {
          this.contextMenuVisible = false;
          contextMenu.classList.add("hidden");
        }
      });

      contextMenu.querySelectorAll(".context-menu-item").forEach((item) => {
        item.addEventListener("click", () => this.toggleContextMenu());
      });
    }
  }
}
