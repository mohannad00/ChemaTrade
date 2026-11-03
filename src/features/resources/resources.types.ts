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
}

export type ArticleInput = Omit<Article, 'id' | 'slug' | 'isDemo' | 'updatedAt' | 'publishedAt' | 'author'> & { slug?: string };

export interface ArticleFilter {
  status?: ArticleStatus;
  search?: string;
}
