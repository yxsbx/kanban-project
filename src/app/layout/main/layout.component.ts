import "./layout.component.css";

import { BoardContainerComponent } from "@app/components";
import { SvgDefinitionsComponent } from "@app/core/utils/svg-definitions.component";
import { SidebarComponent, TopbarComponent } from "@app/layout";

export class LayoutComponent {
  constructor() {
    this.render();
  }

  async render() {
    const mainContentContainer = document.getElementById("main-content");

    if (!mainContentContainer) {
      console.error('Contêiner "#main-content" não encontrado.');
      return;
    }

    mainContentContainer.classList.add("app-layout-container");

    const topbarContainer = document.createElement("div");
    topbarContainer.id = "topbar-container";
    topbarContainer.classList.add("app-topbar-container");
    mainContentContainer.appendChild(topbarContainer);

    new TopbarComponent("topbar-container");

    const svgDefinitions = document.createElement("div");
    svgDefinitions.id = "svg-definitions-container";
    svgDefinitions.classList.add("app-svg-definitions");
    mainContentContainer.appendChild(svgDefinitions);

    new SvgDefinitionsComponent("svg-definitions-container");

    const layoutFlexContainer = document.createElement("div");
    layoutFlexContainer.classList.add("app-content-container");
    mainContentContainer.appendChild(layoutFlexContainer);

    const sidebarContainer = document.createElement("div");
    sidebarContainer.id = "sidebar-container";
    sidebarContainer.classList.add("app-sidebar-container");
    layoutFlexContainer.appendChild(sidebarContainer);

    new SidebarComponent("sidebar-container");

    const boardContainer = document.createElement("div");
    boardContainer.id = "board-container";
    boardContainer.classList.add("app-board-container");
    layoutFlexContainer.appendChild(boardContainer);

    new BoardContainerComponent("board-container");

    this.initializeComponents();
  }

  initializeComponents() {
    console.log("Componentes de layout inicializados com sucesso.");
  }
}
