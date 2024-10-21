export class SvgIconComponent {
  private iconContainer: HTMLElement;
  private name: string;
  private fill: string;
  private width: number;
  private height: number;

  private iconMap: { [key: string]: string } = {
    BellIcon: "bell",
    QuestionMarkIcon: "questionMark",
    PriorityLowIcon: "priorityLow",
    PriorityHighIcon: "priorityHigh",
    PriorityMediumIcon: "priorityMedium",
    PriorityHighestIcon: "priorityHighest",
    PriorityLowestIcon: "priorityLowest",
    BoardIcon: "board",
    RoadmapIcon: "roadmap",
    CodeIcon: "code",
    ProjectPageIcon: "projectPage",
    ShortcutIcon: "shortcut",
    SettingsIcon: "settings",
    MenuIcon: "menu",
    JiraIcon: "jira",
    JiraSmallIcon: "jiraIcon",
    ArrowDownIcon: "arrowDown",
    ArrowLeftIcon: "arrowLeft",
    ThunderIcon: "thunder",
    StarIcon: "star",
    ThreeDotIcon: "threedot",
    SearchIcon: "search",
    PlusIcon: "plus",
    BugIcon: "bug",
    StoryIcon: "story",
    CircleIndicatorIcon: "circleIndicator",
    BlueCheckIcon: "blueCheck",
    LockIcon: "lock",
    EyeIcon: "eye",
    ThumbUpIcon: "thumbup",
    ShareIcon: "share",
    CloseIcon: "close",
    AttachIcon: "attach",
    HierarchyIcon: "hierarchy",
    LinkIcon: "link",
    DescendingIcon: "descending",
    AscendingIcon: "ascending",
    ConfigIcon: "config",
    CheckIcon: "check",
    BookmarkIcon: "bookmark",
    ThunkIcon: "thunk",
  };

  constructor(
    containerId: string,
    name: string,
    fill: string = "currentColor",
    width: number = 16,
    height: number = 16
  ) {
    this.iconContainer = document.getElementById(containerId) as HTMLElement;
    this.name = this.iconMap[name] || name;
    this.fill = fill;
    this.width = width;
    this.height = height;

    this.render();
  }

  get iconUrl(): string {
    return `#${this.name}`;
  }

  render() {
    if (!this.iconContainer) {
      return;
    }

    this.iconContainer.innerHTML = `
      <svg
        version="1.1"
        width="${this.width}px"
        height="${this.height}px"
        fill="${this.fill}"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <use xlink:href="${this.iconUrl}"></use>
      </svg>
    `;
  }
}
