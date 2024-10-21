import { Comment } from "../interfaces";
import { LocalStorageService } from "./local-storage.service";

const COMMENTS_KEY = "comments";

export class CommentService {
  getComments(): Comment[] {
    return (
      LocalStorageService.getFromLocalStorage<Comment[]>(COMMENTS_KEY) || []
    );
  }

  addComment(comment: Comment): void {
    const comments = this.getComments();
    comments.push(comment);
    LocalStorageService.saveToLocalStorage(COMMENTS_KEY, comments);
  }

  deleteComment(commentId: string): void {
    const comments = this.getComments();
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    LocalStorageService.saveToLocalStorage(COMMENTS_KEY, updatedComments);
  }
}
