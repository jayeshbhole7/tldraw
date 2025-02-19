export type InputCategory = {
	id: string
	title: string
	description: string
	groups: InputGroup[]
}

export type InputSection = {
	id: string
	title: string
	description: string
	categories: InputCategory[]
	sidebar_behavior: 'show-links' | 'show-title'
}

export type InputGroup = {
	id: string
}

/* --------------------- Authors -------------------- */

export type Authors = Author[]

export interface Author {
	id: string
	name: string
	image: string
	email: string
	twitter: string
}

/* ---------------------- Pages --------------------- */

export interface ContentPage {
	/** The page's id */
	id: string
	/** The id of the page's parent */
	// parentId: string | null
	/** The page's title */
	title: string
	/** The page's description */
	description: string | null
	/** The page's content */
	content: string | null
	/** The page's path */
	path: string | null
	/** The page's type */
	type: 'article' | 'category' | 'section' | 'group'
}

export interface Section extends ContentPage {
	type: 'section'
	/** The index of this section.*/
	index: number
	/** An array of this section's categories. */
	categories: Category[]
	/** How the section should appear in the sidebar. */
	sidebar_behavior: 'show-links' | 'show-title'
}

export interface Category extends ContentPage {
	type: 'category'
	/** The id of this category's section. */
	sectionId: string
	/** The index of this category inside of its section. */
	index: number
	/** The category's groups */
	groups: Group[]
}

export interface Group extends ContentPage {
	type: 'group'
	/** The id of this group's section. */
	sectionId: string
	/** The id of this group's category. */
	categoryId: string
	/** The index of this group inside of its category. */
	index: number
}

export interface Article extends ContentPage {
	type: 'article'
	/** The id of the group to which this article belongs. */
	groupId: string | null
	/** The index of this article inside of the article's group. */
	groupIndex: number
	/** The id of the category to which this article belongs. */
	categoryId: string
	/** The index of this article inside of the article's category. */
	categoryIndex: number
	/** The id of the section to which this article belongs. */
	sectionId: string
	/** The index of this article inside of the article's section. */
	sectionIndex: number
	/** The article's author details (optional). */
	author: Author['id'] | null
	/** The article's hero image (optional). */
	hero: string | null
	/** The article's status (draft, published, hidden, etc) */
	status: ArticleStatus
	/** The date on which the article was published (optional). */
	date: string | null
	/** An array of keywords associated with this article. */
	keywords: string[]
	/** The URL where the article's source can be found. */
	sourceUrl: string | null
}

export enum ArticleStatus {
	Draft = 'draft',
	Published = 'published',
	Unlisted = 'unlisted',
}

/* ---------------- Article Headings ---------------- */

export interface ArticleHeading {
	level: number
	title: string
	slug: string
	isCode: boolean
}

export type ArticleHeadings = ArticleHeading[]

/* ------------------ Article Links ----------------- */

export type ArticleLink = Pick<
	Article,
	'id' | 'title' | 'description' | 'categoryId' | 'sectionId' | 'path'
>

export type ArticleLinks = {
	prev: ArticleLink | null
	next: ArticleLink | null
}

/* --------------------- Sidebar -------------------- */

export interface BaseSidebarLink {
	title: string
	url: string
	type: 'section' | 'category' | 'article'
}

export interface SidebarContentSectionLink extends BaseSidebarLink {
	type: 'section'
	children: SidebarContentLink[]
}

export interface SidebarContentCategoryLink extends BaseSidebarLink {
	type: 'category'
	children: SidebarContentLink[]
}

export interface SidebarContentArticleLink extends BaseSidebarLink {
	type: 'article'
	articleId: string
}

export type SidebarContentLink =
	| SidebarContentSectionLink
	| SidebarContentCategoryLink
	| SidebarContentArticleLink

export type SidebarContentList = {
	sectionId: string | null
	categoryId: string | null
	articleId: string | null
	links: SidebarContentLink[]
}

/* ---------- Finished / generated content ---------- */

/** A table keyed by slug of articles. */
export type Articles = Record<string, Article>

export type GeneratedContent = { sections: Section[]; articles: Articles }
