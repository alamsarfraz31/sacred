/**
 * Knowledge Base Category Page Component
 * Displays all documents in a specific category
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SEO } from '@/components/common/SEO'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections'
import { fetchDocsByCategorySlug, fetchCategories, fetchAllDocs } from '@/utils/knowledgeBaseApi'
import type { KnowledgeBaseCategoryType, KnowledgeBaseDoc } from '@/utils/knowledgeBaseApi'
import searchBanner from '@/assets/kb-icons/searchBanner.svg'
import searchIcon from '@/assets/search.svg'
import group1Icon from '@/assets/kb-icons/Group-1.png'
import group400Icon from '@/assets/kb-icons/Group-400-1.png'
import group401Icon from '@/assets/kb-icons/Group-401.png'
import styles from './KnowledgeBaseCategory.module.css'

export const KnowledgeBaseCategory = () => {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<KnowledgeBaseCategoryType | null>(null)
  const [docs, setDocs] = useState<KnowledgeBaseDoc[]>([])
  const [allCategories, setAllCategories] = useState<KnowledgeBaseCategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<KnowledgeBaseDoc[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    if (slug) {
      loadCategoryData()
      loadAllCategories()
    }
  }, [slug])

  const loadCategoryData = async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      const result = await fetchDocsByCategorySlug(slug)
      setCategory(result.category)
      setDocs(result.docs)
    } catch (error) {
      console.error('Error loading category data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllCategories = async () => {
    try {
      const cats = await fetchCategories()
      setAllCategories(cats)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // Handle search on input change
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchTimeout = setTimeout(async () => {
        try {
          setIsSearching(true)
          const results = await fetchAllDocs({
            search: searchQuery,
            per_page: 50
          })
          setSearchResults(results)
        } catch (error) {
          console.error('Error searching:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 300)
      return () => clearTimeout(searchTimeout)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    try {
      setIsSearching(true)
      const results = await fetchAllDocs({
        search: searchQuery,
        per_page: 50
      })
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('getting started') || name.includes('getting-started')) {
      return <img src={group1Icon} alt={categoryName} />
    } else if (name.includes('gifting')) {
      return <img src={group400Icon} alt={categoryName} />
    } else if (name.includes('why do we care') || name.includes('why-do-we-care')) {
      return <img src={group401Icon} alt={categoryName} />
    }
    return <img src={group1Icon} alt={categoryName} />
  }

  if (!loading && !category) {
    return (
      <div className={styles.errorContainer}>
        <h1>Category not found</h1>
        <Link to="/knowledgebase/docs" className={styles.backLink}>
          Back to Knowledge Base
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={category ? `${category.name} - Sacred Groves Knowledge Centre` : 'Knowledge Centre - Sacred Groves'}
        description={category?.description || 'Browse articles in Knowledge Centre'}
      />
      <div className={styles.categoryPageContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.iconsRow}>
            <img src={searchBanner} alt="Knowledge Base Banner" className={styles.searchBanner} />
          </div>
          
          <h1 className={styles.mainTitle}>Frequently Asked Questions</h1>
          
          <div className={styles.subtitleRow}>
            <p className={styles.subtitle}>
              Sacred Groves is a platform dedicated to protecting our natural habitats. Get involved, be inspired and make a difference.
            </p>
            
            {/* Search Icon Button - On the right */}
            {!isSearchOpen && (
              <button
                className={styles.searchIconButton}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <img src={searchIcon} alt="Search" className={styles.searchIconImg} />
              </button>
            )}
          </div>

          {/* Search Popup - Opens on click */}
          {isSearchOpen && (
            <div className={styles.searchBubble}>
              <button
                className={styles.searchCloseButton}
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                  setSearchResults([])
                }}
                aria-label="Close search"
              >
                ×
              </button>

              {/* Search field */}
              <div className={styles.searchColumn}>
                <label className={styles.searchLabel}>Search</label>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    placeholder="Search by keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    autoFocus
                  />
                  <img src={searchIcon} alt="" className={styles.searchInputIcon} />
                </div>
              </div>

              {/* Search Button */}
              <button
                className={styles.searchSubmitButton}
                onClick={handleSearch}
                aria-label="Search"
              >
                <img src={searchIcon} alt="Search" className={styles.searchSubmitIcon} />
              </button>
            </div>
          )}
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className={styles.searchResults}>
            <p>Searching...</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            <h2>Search Results</h2>
            <div className={styles.docsList}>
              {searchResults.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/knowledgebase/docs/${doc.slug}`}
                  className={styles.docItem}
                  onClick={() => setIsSearchOpen(false)}
                >
                  <svg className={styles.docIcon} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.86em" height="1em" style={{ transform: 'rotate(360deg)' }} preserveAspectRatio="xMidYMid meet" viewBox="0 0 1536 1792">
                    <path d="M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528V640H992q-40 0-68-28t-28-68V128H128v1536h1280zM384 800q0-14 9-23t23-9h704q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64zm736 224q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704zm0 256q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704z"></path>
                  </svg>
                  <span>{doc.title.rendered}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!isSearching && searchResults.length === 0 && (
          <div className={styles.contentContainer}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarSection}>
                {allCategories.filter(cat => cat.count > 0).map((cat) => {
                  const isActive = category && cat.id === category.id
                  const categorySlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <Link
                      key={cat.id}
                      to={`/knowledgebase/docs-category/${categorySlug}`}
                      className={`${styles.sidebarCategory} ${isActive ? styles.active : ''}`}
                    >
                      <span className={styles.sidebarIcon}>{getCategoryIcon(cat.name)}</span>
                      <span className={styles.sidebarName}>{cat.name}</span>
                      <span className={styles.sidebarCount}>{cat.count}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loaderWrapper}>
                    <img 
                      src="/assets/img/elephantgif.gif" 
                      className={styles.elephantGif} 
                      alt="Loading..." 
                    />
                    <p className={styles.loadingText}>Please wait...</p>
                  </div>
                </div>
              ) : category ? (
                <>
                  <h2 className={styles.categoryTitle}>{category.name}</h2>
                  <div className={styles.docsList}>
                    {docs.length === 0 ? (
                      <p className={styles.noDocs}>No articles found in this category.</p>
                    ) : (
                      docs.map((doc) => (
                        <Link
                          key={doc.id}
                          to={`/knowledgebase/docs/${doc.slug}`}
                          className={styles.docItem}
                        >
                          <svg className={styles.docIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span>{doc.title.rendered}</span>
                        </Link>
                      ))
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Aligned with UN SDGs Section */}
        <div className={styles.alignedSectionWrapper}>
          <AlignedWithUNSDGs hideLinkedInCarousel={true} />
        </div>

      </div>
    </>
  )
}

