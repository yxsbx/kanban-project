import "./sidebar.component.css";

import { SvgIconComponent } from "@app/core/utils/svg-icon.component";

export class SidebarComponent {
  private sidebarId: string;
  private collapsed: boolean = false;
  private toggleButton!: HTMLElement;

  constructor(sidebarId: string) {
    this.sidebarId = sidebarId;
    this.init();
  }

  init() {
    const mediaQuery = window.matchMedia("(max-width: 959.98px)");
    mediaQuery.addEventListener("change", () => {
      this.collapsed = mediaQuery.matches;
      this.updateCollapseState();
    });

    this.render();
    this.initToggleEvents();
    this.updateCollapseState();
  }

  updateCollapseState() {
    const sidebar = document.getElementById(this.sidebarId);
    if (sidebar) {
      sidebar.classList.toggle("collapsed", this.collapsed);
    }

    if (this.toggleButton) {
      this.toggleButton.classList.toggle("revert", this.collapsed);
    }
  }

  initToggleEvents() {
    this.toggleButton = document.getElementById("toggle-button")!;

    const toggleCollapse = () => {
      this.collapsed = !this.collapsed;
      this.updateCollapseState();
    };

    document
      .getElementById("toggle-button")
      ?.addEventListener("click", toggleCollapse);
    document
      .getElementById("toggle-divider")
      ?.addEventListener("click", toggleCollapse);
  }

  render() {
    const sidebarContainer = document.getElementById(this.sidebarId);

    if (!sidebarContainer) {
      return;
    }

    sidebarContainer.innerHTML = `
      <div class="sidebar">
        <button id="toggle-button" class="resizer">
          <div id="resizer-icon"></div>
        </button>
        <button id="toggle-divider">
            <div class="divider"></div>
        </button>
        <div class="sidebar-content">
          <div class="sidebar-header">
            <div class="project-avatar"></div>
            <div>
              <div class="font-semibold">Jira Clone</div>
              <div class="text-xs text-gray-500">Software project</div>
            </div>
          </div>
          <div class="sidebar-nav">
            ${this.getSidebarItemsHtml()}
          </div>
        </div>
      </div>
    `;

    this.addIcons();
  }

  getSidebarItemsHtml(): string {
    const sidebarItems = [
      {
        label: "Roadmap",
        icon: "RoadmapIcon",
        link: "/roadmap",
        selected: false,
      },
      { label: "Board", icon: "BoardIcon", link: "/board", selected: true },
      { label: "Code", icon: "CodeIcon", link: "/code", selected: false },
      {
        label: "Project pages",
        icon: "ProjectPageIcon",
        link: "/pages",
        selected: false,
      },
      {
        label: "Add shortcut",
        icon: "ShortcutIcon",
        link: "/shortcut",
        selected: false,
      },
      {
        label: "Project settings",
        icon: "SettingsIcon",
        link: "/settings",
        selected: false,
      },
    ];

    return sidebarItems
      .map(
        (item, index) => `
          <a href="${item.link}" class="nav-item ${item.selected ? "active" : ""}">
            <div class="icon" id="icon-${index}" width="24" height="24"></div>
            <div>${item.label}</div>
          </a>`
      )
      .join("");
  }

  addIcons() {
    const sidebarItems = [
      "RoadmapIcon",
      "BoardIcon",
      "CodeIcon",
      "ProjectPageIcon",
      "ShortcutIcon",
      "SettingsIcon",
    ];

    sidebarItems.forEach((icon, index) => {
      new SvgIconComponent(`icon-${index}`, icon, "currentColor", 24, 24);
    });

    new SvgIconComponent(
      "resizer-icon",
      "ArrowLeftIcon",
      "currentColor",
      24,
      24
    );
  }
}
