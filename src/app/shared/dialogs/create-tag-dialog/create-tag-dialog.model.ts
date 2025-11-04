import { Article } from '../../services/article.service';
import { Tag } from '../../services/tag.service';

export interface CreateTagDialogData {
  tag?: Tag; // existing tag if the user is editing a tag
  favouriteArticles: Article[];
}

export interface CreateTagDialogResult {
  tagName: string;
  selectedArticleIds: string[];
}
