import { ArticleDocsPage } from '@/components/ArticleDocsPage'
import { CategoryDocsPage } from '@/components/CategoryDocsPage'
import { SectionDocsPage } from '@/components/SectionDocsPage'
import { getDb } from '@/utils/ContentDatabase'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

async function getContentForPath(path: string) {
	const db = await getDb()

	const section = await db.db.get(`SELECT * FROM sections WHERE sections.path = ?`, path)
	if (section) return { type: 'section', section } as const

	const category = await db.db.get(`SELECT * FROM categories WHERE categories.path = ?`, path)
	if (category) return { type: 'category', category } as const

	const article = await db.db.get(`SELECT * FROM articles WHERE articles.path = ?`, path)
	if (article) return { type: 'article', article } as const

	throw Error(`No content found for ${path}`)
}

export async function generateMetadata({ params }: { params: { id: string | string[] } }) {
	const path = typeof params.id === 'string' ? [params.id] : params.id
	const pathString = '/' + path.join('/')
	const content = await getContentForPath(pathString)

	if (!content) return {}

	let title: string | undefined
	let description: string | undefined
	let hero: string | undefined

	switch (content.type) {
		case 'section': {
			const { section } = content
			title = section.title
			description = section.description ?? undefined
			hero = section.hero ?? undefined
			break
		}
		case 'category': {
			const { category } = content
			title = category.title
			description = category.description ?? undefined
			hero = category.hero ?? undefined
			break
		}
		case 'article': {
			const { article } = content
			title = article.title
			description = article.description ?? undefined
			hero = article.hero ?? undefined
			break
		}
	}

	const metadata: Metadata = {
		title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			images: hero,
		},
		twitter: {
			description: description,
			images: hero,
		},
	}

	return metadata
}

export async function generateStaticParams() {
	const db = await getDb()

	const sections = await db.db.all(`SELECT * FROM sections`)
	const categories = await db.db.all(`SELECT * FROM categories`)
	const articles = await db.db.all(`SELECT * FROM articles`)

	const paths = [] as string[]

	for (const section of sections) {
		paths.push(section.path)
	}

	for (const category of categories) {
		paths.push(category.path)
	}

	for (const article of articles) {
		paths.push(article.path)
	}

	return paths.map((path) => ({ params: { id: path.split('/').filter((p) => p) } }))
}

export default async function ContentPage({ params }: { params: { id: string | string[] } }) {
	const path = typeof params.id === 'string' ? [params.id] : params.id
	const pathString = '/' + path.join('/')
	const content = await getContentForPath(pathString)
	if (!content) throw notFound()

	switch (content.type) {
		case 'section': {
			return <SectionDocsPage section={content.section} />
		}
		case 'category': {
			return <CategoryDocsPage category={content.category} />
		}
		case 'article': {
			return <ArticleDocsPage article={content.article} />
		}
		default: {
			throw notFound()
		}
	}
}
