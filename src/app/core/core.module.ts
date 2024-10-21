import { CardService } from "./services/card.service";
import { UserService } from "./services/user.service";
import { CommentService } from "./services/comment.service";
import { LayoutComponent } from "@app/layout";

export class CoreModule {
  private static instance: CoreModule | null = null;

  constructor() {
    if (CoreModule.instance) {
      throw new Error(
        "CoreModule já foi carregado. Importe-o apenas no AppModule!"
      );
    }

    CoreModule.instance = this;
    this.initModules();
  }

  private initModules() {
    document.addEventListener("DOMContentLoaded", () => {
      new LayoutComponent();
    });

    const cardService = new CardService();
    const userService = new UserService();
    const commentService = new CommentService();

    const initialCards = cardService.getCards();
    const initialUsers = userService.getUsers();
    const initialComments = commentService.getComments();

    console.log("Dados iniciais carregados", {
      cards: initialCards,
      users: initialUsers,
      comments: initialComments,
    });
  }

  static getInstance(): CoreModule {
    if (!CoreModule.instance) {
      CoreModule.instance = new CoreModule();
    }
    return CoreModule.instance;
  }
}
