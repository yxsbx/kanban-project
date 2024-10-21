import { CardTypesEnum } from "../enums";
import { Card, CardFilter } from "../interfaces";
import { LocalStorageService } from "./local-storage.service";

const CARDS_KEY = "cards";

export class CardService {
  private filters: CardFilter = { assignees: [], labels: [], types: [] };

  async getCards(): Promise<Card[]> {
    let cards = LocalStorageService.getFromLocalStorage<Card[]>(CARDS_KEY);

    if (!cards || cards.length === 0) {
      cards = this.loadDefaultCards();
      LocalStorageService.saveToLocalStorage(CARDS_KEY, cards);
    }

    return cards;
  }

  updateFilter(newFilter: Partial<CardFilter>) {
    this.filters = { ...this.filters, ...newFilter };
  }

  filterCards(cards: Card[]): Card[] {
    return cards.filter((card) => {
      const filterAssignees =
        this.filters.assignees.length === 0 ||
        this.filters.assignees.some((assignee) => assignee === card.assigneeId);

      const filterLabels =
        this.filters.labels.length === 0 ||
        (card.labels &&
          card.labels.some((label) => this.filters.labels.includes(label)));

      const filterTypes =
        this.filters.types.length === 0 ||
        this.filters.types.includes(card.type);

      return filterAssignees && filterLabels && filterTypes;
    });
  }

  addCard(card: Card): void {
    const cards = this.getCardsFromStorage();
    cards.push(card);
    LocalStorageService.saveToLocalStorage(CARDS_KEY, cards);
  }

  updateCard(updatedCard: Card): void {
    const cards = this.getCardsFromStorage();
    const updatedCards = cards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );
    LocalStorageService.saveToLocalStorage(CARDS_KEY, updatedCards);
  }

  deleteCard(cardId: string): void {
    const cards = this.getCardsFromStorage();
    const updatedCards = cards.filter((card) => card.id !== cardId);
    LocalStorageService.saveToLocalStorage(CARDS_KEY, updatedCards);
  }

  public getCardsFromStorage(): Card[] {
    return LocalStorageService.getFromLocalStorage<Card[]>(CARDS_KEY) || [];
  }

  private loadDefaultCards(): Card[] {
    return [
      {
        id: "0208b70a-761b-11ec-90d6-0242ac120003",
        title: "Responsive layout",
        type: CardTypesEnum.TASK,
        columnId: "1",
        priority: "High",
        labels: ["Important"],
        assigneeId: "1",
        reporterId: "8",
        description:
          "Currently, we didn't apply the Responsive Web Design to the application. So it's just beautiful on desktop screen.",
        startDate: "",
        dueDate: "",
        createdAt: "2022-01-04T17:00:00.000Z",
        updatedAt: "2022-01-04T17:00:00.000Z",
      },
      {
        id: "32a7db2a-761b-11ec-90d6-0242ac120003",
        title: "Update README.MD",
        type: CardTypesEnum.TASK,
        columnId: "3",
        priority: "Highest",
        assigneeId: "2",
        labels: ["Urgent"],
        reporterId: "6",
        description: "The README needs to be updated.",
        startDate: "",
        dueDate: "",
        createdAt: "2022-01-04T19:30:00.000Z",
        updatedAt: "2022-01-04T19:30:00.000Z",
      },
      {
        id: "4f69764c-761b-11ec-90d6-0242ac120003",
        title: "The sidebar can be resized by dragging.",
        type: CardTypesEnum.TASK,
        columnId: "2",
        priority: "Medium",
        assigneeId: "8",
        labels: ["Urgent"],
        reporterId: "5",
        description:
          "The sidebar can be resizable by dragging the border between the sidebar and the main content.",
        startDate: "",
        dueDate: "",
        createdAt: "2022-01-12T07:35:00.000Z",
        updatedAt: "2022-01-12T07:35:00.000Z",
      },
      {
        id: "d77d2f56-77a1-11ec-90d6-0242ac120003",
        title: "Receive feedbacks and contributions",
        type: CardTypesEnum.STORY,
        columnId: "4",
        priority: "Medium",
        labels: ["Important", "Discussion", "Later"],
        assigneeId: "2",
        reporterId: "3",
        description:
          "I create this project just for practicing and improving my coding skills. Of course, this project has many things that need to be improved/refactored.Any contributions are welcome :)",
        startDate: "",
        dueDate: "",
        createdAt: "2022-01-11T13:34:00.000Z",
        updatedAt: "2022-01-11T13:34:00.000Z",
      },
      {
        id: "020504bc-77a5-11ec-90d6-0242ac120003",
        title: "Create static data",
        type: CardTypesEnum.TASK,
        columnId: "4",
        priority: "Medium",
        labels: [],
        assigneeId: "4",
        reporterId: "8",
        description:
          "Create JSON files that contain all static data of the application.",
        startDate: "",
        dueDate: "",
        createdAt: "2022-01-11T18:12:00.000Z",
        updatedAt: "2022-01-11T18:12:00.000Z",
      },
      {
        id: "872bc79c-77a6-11ec-90d6-0242ac120003",
        title: "Refactor API integration",
        type: CardTypesEnum.TASK,
        columnId: "2",
        priority: "High",
        labels: ["Refactor", "API"],
        assigneeId: "1",
        reporterId: "4",
        description:
          "Refactor the current API integration to be more modular and to follow best practices for error handling and logging.",
        startDate: "2022-02-01",
        dueDate: "2022-02-10",
        createdAt: "2022-01-15T08:00:00.000Z",
        updatedAt: "2022-01-15T08:00:00.000Z",
      },
      {
        id: "b6d3a894-77a6-11ec-90d6-0242ac120003",
        title: "Fix login issue",
        type: CardTypesEnum.BUG,
        columnId: "1",
        priority: "Highest",
        labels: ["Critical", "Login"],
        assigneeId: "3",
        reporterId: "5",
        description:
          "Users are unable to login on mobile devices due to a bug in the authentication flow.",
        startDate: "2022-01-20",
        dueDate: "2022-01-22",
        createdAt: "2022-01-18T10:15:00.000Z",
        updatedAt: "2022-01-18T10:15:00.000Z",
      },
      {
        id: "de5b5cc4-77a6-11ec-90d6-0242ac120003",
        title: "Implement Dark Mode",
        type: CardTypesEnum.STORY,
        columnId: "3",
        priority: "Medium",
        labels: ["Feature", "UI"],
        assigneeId: "6",
        reporterId: "2",
        description:
          "Add support for dark mode across the application, allowing users to toggle between light and dark themes.",
        startDate: "",
        dueDate: "",
        createdAt: "2022-01-25T09:00:00.000Z",
        updatedAt: "2022-01-25T09:00:00.000Z",
      },
      {
        id: "fbd19442-77a6-11ec-90d6-0242ac120003",
        title: "Optimize database queries",
        type: CardTypesEnum.TASK,
        columnId: "2",
        priority: "High",
        labels: ["Performance", "Backend"],
        assigneeId: "7",
        reporterId: "1",
        description:
          "Optimize slow database queries affecting the performance of the user dashboard.",
        startDate: "2022-02-05",
        dueDate: "2022-02-12",
        createdAt: "2022-01-30T12:00:00.000Z",
        updatedAt: "2022-01-30T12:00:00.000Z",
      },
    ];
  }
}
