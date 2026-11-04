export type ArticleStatus = 'Draft' | 'Published';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Paragraphs separated by a blank line. Lines starting with "## " are subheadings. */
  body: string;
  tag: string;
  status: ArticleStatus;
  author: string;
  publishedAt: string;
  updatedAt: string;
  isDemo: true;
  i18n?: { ar?: Partial<Pick<Article, 'title' | 'excerpt' | 'body' | 'tag' | 'author'>> };
}

export type ArticleInput = Omit<Article, 'id' | 'slug' | 'isDemo' | 'updatedAt' | 'publishedAt' | 'author' | 'i18n'> & { slug?: string };

export interface ArticleFilter {
  status?: ArticleStatus;
  search?: string;
}
