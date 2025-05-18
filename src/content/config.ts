import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { feedLoader } from '@ascorbic/feed-loader'
import { githubReleasesLoader } from 'astro-loader-github-releases'
import { githubPrsLoader } from 'astro-loader-github-prs'
import { notionLoader } from 'notion-astro-loader'
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from 'notion-astro-loader/schemas'

import {
  pageSchema,
  postSchema,
  projectsSchema,
  friendsSchema,
  streamsSchema,
} from './schema'

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/pages' }),
  schema: pageSchema,
})

const blog = defineCollection({
  type: 'content',
  schema: postSchema,
})

const projects = defineCollection({
  type: 'data',
  schema: projectsSchema,
})

const changelog = defineCollection({
  type: 'content',
  schema: postSchema,
})

const streams = defineCollection({
  type: 'data',
  schema: streamsSchema,
})

// const feeds = defineCollection({
//   loader: feedLoader({
//     url: 'https://astro.build/rss.xml',
//   }),
// })

// const releases = defineCollection({
//   loader: githubReleasesLoader({
//     loadMode: 'repoList',
//     modeConfig: {
//       repos: [
//         'withastro/astro',
//         'withastro/starlight',
//         'lin-stephanie/astro-loaders',
//         'lin-stephanie/astro-antfustyle-theme',
//       ],
//       monthsBack: 3,
//       entryReturnType: 'byRelease',
//     },
//   }),
// })

// const prs = defineCollection({
//   loader: githubPrsLoader({
//     search:
//       'repo:withastro/astro repo:withastro/starlight repo:lin-stephanie/astro-antfustyle-theme',
//     monthsBack: 2,
//   }),
// })

const home = defineCollection({
  type: 'content',
  schema: postSchema,
})

const about = defineCollection({
  type: 'content',
  schema: postSchema,
})

const calligraphy = defineCollection({
  type: 'content',
  schema: postSchema,
})

const photographs = defineCollection({
  type: 'content',
  schema: postSchema,
})

const news = defineCollection({
  type: 'content',
  schema: postSchema,
})

const friends = defineCollection({
  type: 'data',
  schema: friendsSchema,
})

const notion = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_DB_ID,
    filter: {
      property: 'published',
      checkbox: { equals: true },
    },
    schema: notionPageSchema({
      properties: z.object({
        Name: transformedPropertySchema.title,
        created: propertySchema.created_time.optional(),
        tags: transformedPropertySchema.multi_select,
        slug: transformedPropertySchema.rich_text,
      }),
    }),
  }),
})

export const collections = {
  pages,
  blog,
  friends,
  projects,
  changelog,
  streams,
  home,
  about,
  calligraphy,
  photographs,
  news,
  // feeds,
  // releases,
  // prs,
}
