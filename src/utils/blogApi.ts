/**
 * Blog API
 * Functions to interact with WordPress Blog API
 */

const BLOG_API_BASE = 'https://www.sacredgroves.earth/blog/journaldata/wp/v2'
const BLOG_AUTH_TOKEN = 'Basic am91cm5hbGFwaTpQYXNzIXdvcmRASm91cm5hQVBJIzM0ODk='

// Types
export interface BlogPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  categories?: number[]
  tags?: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      media_details: {
        sizes: {
          full?: {
            source_url: string
          }
          large?: {
            source_url: string
          }
          medium?: {
            source_url: string
          }
          thumbnail?: {
            source_url: string
          }
        }
      }
      alt_text: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
      taxonomy: string
    }>>
  }
}

export interface BlogCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
}

export interface BlogTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
}

export interface FetchBlogsParams {
  search?: string
  categories?: number
  tags?: number
  per_page?: number
  page?: number
  order?: 'asc' | 'desc'
  orderby?: 'date' | 'title' | 'relevance'
  slug?: string
}

/**
 * Fetch all blog posts with optional filters
 */
export async function fetchAllBlogs(params: FetchBlogsParams = {}): Promise<BlogPost[]> {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.search) {
      queryParams.append('search', params.search)
    }
    
    if (params.categories) {
      queryParams.append('categories', params.categories.toString())
    }
    
    if (params.tags) {
      queryParams.append('tags', params.tags.toString())
    }
    
    if (params.per_page) {
      queryParams.append('per_page', params.per_page.toString())
    } else {
      queryParams.append('per_page', '100')
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString())
    }
    
    if (params.order) {
      queryParams.append('order', params.order)
    }
    
    if (params.orderby) {
      queryParams.append('orderby', params.orderby)
    }
    
    // Add _embed to get featured images and terms
    queryParams.append('_embed', 'true')
    
    const url = `${BLOG_API_BASE}/posts?${queryParams.toString()}`
    const response = await fetch(url, {
      headers: {
        'Authorization': BLOG_AUTH_TOKEN
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }
}

/**
 * Fetch a single blog post by ID
 */
export async function fetchBlogById(id: number): Promise<BlogPost | null> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('_embed', 'true')
    
    const url = `${BLOG_API_BASE}/posts/${id}?${queryParams.toString()}`
    const response = await fetch(url, {
      headers: {
        'Authorization': BLOG_AUTH_TOKEN
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching blog by ID:', error)
    throw error
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('slug', slug)
    queryParams.append('_embed', 'true')
    
    const url = `${BLOG_API_BASE}/posts?${queryParams.toString()}`
    const response = await fetch(url, {
      headers: {
        'Authorization': BLOG_AUTH_TOKEN
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    throw error
  }
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<BlogCategory[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('per_page', '100')
    queryParams.append('hide_empty', 'false')
    
    const url = `${BLOG_API_BASE}/categories?${queryParams.toString()}`
    const response = await fetch(url, {
      headers: {
        'Authorization': BLOG_AUTH_TOKEN
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

/**
 * Fetch all tags
 */
export async function fetchTags(): Promise<BlogTag[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('per_page', '100')
    queryParams.append('hide_empty', 'false')
    
    const url = `${BLOG_API_BASE}/tags?${queryParams.toString()}`
    const response = await fetch(url, {
      headers: {
        'Authorization': BLOG_AUTH_TOKEN
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error
  }
}

/**
 * Helper function to extract plain text from HTML
 */
export function extractPlainText(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

/**
 * Helper function to get featured image URL from blog post
 */
export function getFeaturedImageUrl(blog: BlogPost): string | null {
  if (blog._embedded?.['wp:featuredmedia']?.[0]) {
    const media = blog._embedded['wp:featuredmedia'][0]
    return media.media_details?.sizes?.full?.source_url || 
           media.media_details?.sizes?.large?.source_url ||
           media.media_details?.sizes?.medium?.source_url ||
           media.source_url ||
           null
  }
  return null
}

/**
 * Helper function to get tags from blog post
 */
export function getBlogTags(blog: BlogPost): Array<{ id: number; name: string; slug: string; taxonomy: string }> {
  if (blog._embedded?.['wp:term']) {
    const tags = blog._embedded['wp:term'].find(terms => 
      terms.length > 0 && terms[0].taxonomy === 'post_tag'
    )
    return tags || []
  }
  return []
}

/**
 * Helper function to get categories from blog post
 */
export function getBlogCategories(blog: BlogPost): Array<{ id: number; name: string; slug: string; taxonomy: string }> {
  if (blog._embedded?.['wp:term']) {
    const categories = blog._embedded['wp:term'].find(terms => 
      terms.length > 0 && terms[0].taxonomy === 'category'
    )
    return categories || []
  }
  return []
}

