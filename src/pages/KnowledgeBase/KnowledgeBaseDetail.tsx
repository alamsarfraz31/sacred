/**
 * Knowledge Base Detail Page Component
 * Displays individual article content
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SEO } from '@/components/common/SEO'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections'
import { fetchDocBySlug, fetchCategories, fetchAllDocs } from '@/utils/knowledgeBaseApi'
import type { KnowledgeBaseCategoryType, KnowledgeBaseDoc } from '@/utils/knowledgeBaseApi'
import searchBanner from '@/assets/kb-icons/searchBanner.svg'
import searchIcon from '@/assets/search.svg'
import group1Icon from '@/assets/kb-icons/Group-1.png'
import group400Icon from '@/assets/kb-icons/Group-400-1.png'
import group401Icon from '@/assets/kb-icons/Group-401.png'
import styles from './KnowledgeBaseDetail.module.css'

export const KnowledgeBaseDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [doc, setDoc] = useState<KnowledgeBaseDoc | null>(null)
  const [allCategories, setAllCategories] = useState<KnowledgeBaseCategoryType[]>([])
  const [relatedDocs, setRelatedDocs] = useState<KnowledgeBaseDoc[]>([])
  const [prevDoc, setPrevDoc] = useState<KnowledgeBaseDoc | null>(null)
  const [nextDoc, setNextDoc] = useState<KnowledgeBaseDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<KnowledgeBaseDoc[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    if (slug) {
      loadDocData()
      loadAllCategories()
    }
  }, [slug])

  const loadDocData = async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      const document = await fetchDocBySlug(slug)
      setDoc(document)
      
      if (document) {
        // Load related docs from same category
        if (document.doc_category && document.doc_category.length > 0) {
          const related = await fetchAllDocs({
            doc_category: document.doc_category[0],
            per_page: 50,
            order: 'asc',
            orderby: 'date'
          })
          setRelatedDocs(related)
          
          // Find prev/next docs
          const currentIndex = related.findIndex(d => d.id === document.id)
          if (currentIndex > 0) {
            setPrevDoc(related[currentIndex - 1])
          }
          if (currentIndex < related.length - 1) {
            setNextDoc(related[currentIndex + 1])
          }
        }
      }
    } catch (error) {
      console.error('Error loading doc data:', error)
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

  if (!loading && !doc) {
    return (
      <div className={styles.errorContainer}>
        <h1>Article not found</h1>
        <Link to="/knowledgebase/docs" className={styles.backLink}>
          Back to Knowledge Base
        </Link>
      </div>
    )
  }

  // Get current category
  const currentCategory = doc ? allCategories.find((cat) => 
    doc.doc_category && doc.doc_category.includes(cat.id)
  ) : null

  return (
    <>
      <SEO
        title={doc ? `${doc.title.rendered} - Sacred Groves Knowledge Centre` : 'Knowledge Centre - Sacred Groves'}
        description={doc ? doc.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160) : 'Knowledge Centre'}
      />
      <div className={styles.detailPageContainer}>
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
                  const isActive = currentCategory?.id === cat.id
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
              
              {/* Related Articles in Sidebar */}
              {relatedDocs.length > 0 && doc && (
                <div className={styles.relatedSection}>
                  <h3 className={styles.relatedTitle}>Related Articles</h3>
                  <div className={styles.relatedList}>
                    {relatedDocs
                      .filter(related => related.id !== doc.id)
                      .slice(0, 10)
                      .map((related) => (
                        <Link
                          key={related.id}
                          to={`/knowledgebase/docs/${related.slug}`}
                          className={`${styles.relatedItem} ${related.id === doc.id ? styles.active : ''}`}
                        >
                          <svg className={styles.docIcon} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.86em" height="1em" style={{ transform: 'rotate(360deg)' }} preserveAspectRatio="xMidYMid meet" viewBox="0 0 1536 1792">
                            <path d="M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528V640H992q-40 0-68-28t-28-68V128H128v1536h1280zM384 800q0-14 9-23t23-9h704q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64zm736 224q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704zm0 256q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704z"></path>
                          </svg>
                          <span>{related.title.rendered}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
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
              ) : doc ? (
                <>
                  <h1 className={styles.articleTitle}>{doc.title.rendered}</h1>
                  
                  {/* Article Content */}
                  <div 
                    className={styles.articleContent}
                    dangerouslySetInnerHTML={{ __html: doc.content.rendered }}
                  />

                  {/* Update Date */}
                  {doc.modified && (
                    <div className={styles.updateDate}>
                      Updated on {new Date(doc.modified).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className={styles.navigation}>
                    {prevDoc && (
                      <Link to={`/knowledgebase/docs/${prevDoc.slug}`} className={styles.navLink}>
                        <span className={styles.navArrow}>←</span>
                        <span>{prevDoc.title.rendered}</span>
                      </Link>
                    )}
                    {nextDoc && (
                      <Link to={`/knowledgebase/docs/${nextDoc.slug}`} className={`${styles.navLink} ${styles.navLinkRight}`}>
                        <span>{nextDoc.title.rendered}</span>
                        <span className={styles.navArrow}>→</span>
                      </Link>
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

