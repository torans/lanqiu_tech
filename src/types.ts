/* SITE */
export type Url = `http://${string}` | `https://${string}`
type Path = `/${string}`

export interface Site {
  /**
   * Specifies the final deployed URL, which must start with `http://` or `https://`. It will be passed to the
   * {@link https://docs.astro.build/en/reference/configuration-reference/#site `site`} config in Astro,
   * used for generating canonical URLs, `rss.xml` and other features.
   */
  website: Url

  /**
   * Specifies the base path for your site, which must start with `/`. It wiil be passed to the
   * {@link https://docs.astro.build/en/reference/configuration-reference/#base `base`} config in Astro,
   * used when deploying to a subdirectory.
   *
   * @example
   * `/my-site/` (for a site deployed to `https://example.com/my-site/`)
   */
  base: Path

  /**
   * Specifies the site name for formatting the `title` in the frontmatter as `<pageTitle> - <siteTitle>`.
   * Used for the title and meta tags, found in `src/components/base/Head.astro`.
   */
  title: string

  /**
   * Specifies the default content for meta tags, found in `src/components/base/Head.astro`.
   */
  description: string

  /**
   * Specifies your name for meta tags, found in `src/components/base/Head.astro`.
   */
  author: string

  /**
   * Specifies the primary language of the document content, found in `src/layouts/BaseLayout.astro`.
   *
   * @description
   * It must be a single 'language tag' in the format defined in
   * {@link https://datatracker.ietf.org/doc/html/rfc5646#appendix-A RFC 5646: Tags for Identifying Languages} (also known as BCP 47).
   *
   * @example
   * 'zh-Hant' (Chinese written using the Traditional Chinese script)
   * 'fr' (French)
   */
  lang: string

  /**
   * Specifies the page content's language and region for better content display on social platforms,
   * found in `src/components/base/Head.astro`.
   *
   * @description
   * It must be in `language_TERRITORY` format, which you can find in
   * {@link https://www.unicode.org/cldr/charts/44/supplemental/language_territory_information.html Language-Territory Information}.
   *
   * @example
   * 'zh_CN'
   * 'fr_FR'
   */
  ogLocale: string
}

/* UI */
export type Icon = `i-${string}-${string}` | `i-${string}:${string}`
export type RepoWithOwner = `${string}/${string}`

interface BaseNavItem {
  /**
   * Specifies the navigation path. It must start with `/`.
   *
   * @example
   * '/blog'、'/blog/'
   */
  path: Path

  /**
   * Sets the content displayed on hover for accessibility.
   */
  title: string
}

interface TextNavItem extends BaseNavItem {
  /**
   * Defines how the navigation item is displayed responsively. Allowed values:
   *  - 'alwaysText': Always display text, regardless of screen size.
   *  - 'alwaysIcon': Always display as a chart, regardless of screen size.
   *  - 'textHiddenOnMobile': Display text when viewport is ≥768px, hide text when <768px.
   *  - 'iconHiddenOnMobile': Display icon when viewport is ≥768px, hide icon when <768px.
   *  - 'textToIconOnMobile': Display text when viewport is ≥768px, switch to icon when <768px.
   *  - 'iconToTextOnMobile': Display icon when viewport is ≥768px, switch to text when <768px.
   *
   * @remark
   * The `text` property is required for 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   * The `icon` property is required for 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   */
  displayMode: 'alwaysText' | 'textHiddenOnMobile'

  /**
   * Sets the text displayed for the navigation item.
   * Required for `displayMode` values 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   */
  text: string
}

export interface IconNavItem extends BaseNavItem {
  /**
   * Defines how the navigation item is displayed responsively. Allowed values:
   *  - 'alwaysText': Always display text, regardless of screen size.
   *  - 'alwaysIcon': Always display as a chart, regardless of screen size.
   *  - 'textHiddenOnMobile': Display text when viewport is ≥768px, hide text when <768px.
   *  - 'iconHiddenOnMobile': Display icon when viewport is ≥768px, hide icon when <768px.
   *  - 'textToIconOnMobile': Display text when viewport is ≥768px, switch to icon when <768px.
   *  - 'iconToTextOnMobile': Display icon when viewport is ≥768px, switch to text when <768px.
   *
   * @remark
   * The `text` property is required for 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   * The `icon` property is required for 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   */
  displayMode: 'alwaysIcon' | 'iconHiddenOnMobile'

  /**
   * Sets the icon displayed for the navigation item.
   * Required for `displayMode` values 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   *
   * @description
   * Icon must be in the format `i-<collection>-<icon>` or `i-<collection>:<icon>`
   * as per {@link https://unocss.dev/presets/icons UnoCSS} specs.
   *
   * @example
   * "i-ri:twitter-x-fill", "i-ri-twitter-x-fill", "i-mdi:github", "i-mdi-github"
   *
   * @see {@link https://icon-sets.iconify.design/ Check all available icons}
   */
  icon: Icon
}

export interface ResponsiveNavItem extends BaseNavItem {
  /**
   * Defines how the navigation item is displayed responsively. Allowed values:
   *  - 'alwaysText': Always display text, regardless of screen size.
   *  - 'alwaysIcon': Always display as a chart, regardless of screen size.
   *  - 'textHiddenOnMobile': Display text when viewport is ≥768px, hide text when <768px.
   *  - 'iconHiddenOnMobile': Display icon when viewport is ≥768px, hide icon when <768px.
   *  - 'textToIconOnMobile': Display text when viewport is ≥768px, switch to icon when <768px.
   *  - 'iconToTextOnMobile': Display icon when viewport is ≥768px, switch to text when <768px.
   *
   * @remark
   * The `text` property is required for 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   * The `icon` property is required for 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   */
  displayMode: 'textToIconOnMobile' | 'iconToTextOnMobile'

  /**
   * Sets the text displayed for the navigation item.
   * Required for `displayMode` values 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   */
  text: string

  /**
   * Sets the icon displayed for the navigation item.
   * Required for `displayMode` values 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   *
   * @description
   * Icon must be in the format `i-<collection>-<icon>` or `i-<collection>:<icon>`
   * as per {@link https://unocss.dev/presets/icons UnoCSS} specs.
   *
   * @example
   * "i-ri:twitter-x-fill", "i-ri-twitter-x-fill", "i-mdi:github", "i-mdi-github"
   *
   * @see {@link https://icon-sets.iconify.design/ Check all available icons}
   */
  icon: Icon
}

export type InternalNav = TextNavItem | IconNavItem | ResponsiveNavItem

interface BaseSocialItem {
  /**
   * Set the URL to the social platform.
   */
  link: Url

  /**
   * Sets the content displayed on hover for accessibility.
   *
   * @description
   * You can use template literals to reference other configuration items.
   *
   * @example
   * `Follow ${SITE.author} on Twitter`
   */
  title: string
}

interface TextSocialItem extends BaseSocialItem {
  /**
   * Defines how the social item is displayed responsively. Allowed values:
   *  - 'alwaysText': Always display text, regardless of screen size.
   *  - 'alwaysIcon': Always display as a chart, regardless of screen size.
   *  - 'textHiddenOnMobile': Display text when viewport is ≥768px, hide text when <768px.
   *  - 'iconHiddenOnMobile': Display icon when viewport is ≥768px, hide icon when <768px.
   *  - 'textToIconOnMobile': Display text when viewport is ≥768px, switch to icon when <768px.
   *  - 'iconToTextOnMobile': Display icon when viewport is ≥768px, switch to text when <768px.
   *
   * @remark
   * The `text` property is required for 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile'.
   * The `icon` property is required for 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   */
  displayMode: 'alwaysText' | 'textHiddenOnMobile'

  /**
   * Sets the text displayed for the social item.
   * Required for `displayMode` values 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   */
  text: string
}

export interface IconSocialItem extends BaseSocialItem {
  /**
   * Defines how the social item is displayed responsively. Allowed values:
   *  - 'alwaysText': Always display text, regardless of screen size.
   *  - 'alwaysIcon': Always display as a chart, regardless of screen size.
   *  - 'textHiddenOnMobile': Display text when viewport is ≥768px, hide text when <768px.
   *  - 'iconHiddenOnMobile': Display icon when viewport is ≥768px, hide icon when <768px.
   *  - 'textToIconOnMobile': Display text when viewport is ≥768px, switch to icon when <768px.
   *  - 'iconToTextOnMobile': Display icon when viewport is ≥768px, switch to text when <768px.
   *
   * @remark
   * The `text` property is required for 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   * The `icon` property is required for 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   */
  displayMode: 'alwaysIcon' | 'iconHiddenOnMobile'

  /**
   * Sets the icon displayed the social platform.
   * Required for `displayMode` values 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   *
   * @description
   * Icon must be in the format `i-<collection>-<icon>` or `i-<collection>:<icon>`
   * as per {@link https://unocss.dev/presets/icons UnoCSS} specs.
   *
   * @example
   * "i-ri:twitter-x-fill", "i-ri-twitter-x-fill", "i-mdi:github", "i-mdi-github"
   *
   * @see {@link https://icon-sets.iconify.design/ Check all available icons}
   */
  icon: Icon
}

export interface ResponsiveSocialItem extends BaseSocialItem {
  /**
   * Defines how the social item is displayed responsively. Allowed values:
   *  - 'alwaysText': Always display text, regardless of screen size.
   *  - 'alwaysIcon': Always display as a chart, regardless of screen size.
   *  - 'textHiddenOnMobile': Display text when viewport is ≥768px, hide text when <768px.
   *  - 'iconHiddenOnMobile': Display icon when viewport is ≥768px, hide icon when <768px.
   *  - 'textToIconOnMobile': Display text when viewport is ≥768px, switch to icon when <768px.
   *  - 'iconToTextOnMobile': Display icon when viewport is ≥768px, switch to text when <768px.
   *
   * @remark
   * The `text` property is required for 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   * The `icon` property is required for 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   */
  displayMode: 'textToIconOnMobile' | 'iconToTextOnMobile'

  /**
   * Sets the text displayed for the social item.
   * Required for `displayMode` values 'alwaysText', 'textHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   */
  text: string

  /**
   * Sets the icon displayed the social platform.
   * Required for `displayMode` values 'alwaysIcon', 'iconHiddenOnMobile', 'iconToTextOnMobile' or 'textToIconOnMobile`.
   *
   * @description
   * Icon must be in the format `i-<collection>-<icon>` or `i-<collection>:<icon>`
   * as per {@link https://unocss.dev/presets/icons UnoCSS} specs.
   *
   * @example
   * "i-ri:twitter-x-fill", "i-ri-twitter-x-fill", "i-mdi:github", "i-mdi-github"
   *
   * @see {@link https://icon-sets.iconify.design/ Check all available icons}
   */
  icon: Icon
}

export type SocialLink = TextSocialItem | IconSocialItem | ResponsiveSocialItem

type NavBarComponentType =
  | 'internalNavs'
  | 'socialLinks'
  | 'searchButton'
  | 'themeButton'
  | 'rssLink'

export interface NavBarLayout {
  /**
   * Defines which components ('internalNavs', 'socialLinks', 'searchButton',
   * 'themeButton', 'rssLink') are positioned on the left side of the navigation bar.
   *
   * @remark
   * If you want all components to appear on the right side, leave this array empty.
   * Components in `left` and `right` arrays must not contain duplicates.
   */
  left: NavBarComponentType[]

  /**
   * Defines which components ('internalNavs', 'socialLinks', 'searchButton',
   * 'themeButton', 'rssLink') are positioned on the right side of the navigation bar.
   *
   * @remark
   * If you want all components to appear on the left side, leave this array empty.
   * Components in `left` and `right` arrays must not contain duplicates.
   */
  right: NavBarComponentType[]

  /**
   * Controls whether the 'internalNavs' and 'socialLinks' section are combined into
   * a single navigation menu on mobile, managed through a hamburger icon.
   */
  mergeOnMobile: boolean
}

interface Tab {
  /**
   * Sets the navigation path associated with the tab, which must start with `/`.
   *
   * @example
   * '/blog'、'/blog/'
   */
  path: Path

  /**
   * Sets the content displayed on hover for accessibility.
   */
  title: string
}

export type Tabs = [Tab, Tab, ...Tab[]]

interface GroupView {
  /**
   * Sets the maximum number of columns displayed in the group view.
   * Used in `src/components/views/GroupItem.astro`.
   */
  maxGroupColumns: 2 | 3

  /**
   * Determines whether group item icons display in color when hovered over.
   * Used in `src/components/views/GroupView.astro` and `src/components/base/Categorizer.astro`.
   *
   * @description
   * If `true`, the icon for the group item will display in its original colors on hover.
   */
  showGroupItemColorOnHover: boolean
}

export interface GitHubView {
  /**
   * Defines monorepo repositories using `<owner>/<repo>` format.
   * For monorepos, the tag name is used as the primary text for `/releases` page.
   */
  monorepos: RepoWithOwner[]

  /**
   * Configures main logos for repositories or packages (for monorepos).
   * Defaults to the owner's avatar if no custom logo is set.
   *
   * @remark
   * Matching supports regex or `<owner>/<repo>` format, prioritized by order.
   */
  mainLogoOverrides: [RepoWithOwner | RegExp, Url | Icon][]
}
