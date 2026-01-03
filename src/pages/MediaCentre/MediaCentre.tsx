import React, { useState, useRef, useEffect } from 'react'
import { SEO } from '@/components/common/SEO'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections'
import styles from './MediaCentre.module.css'
import searchIcon from '@/assets/search.svg'
import storyIcon1 from '@/assets/story_icon_1.svg'
import storyIcon2 from '@/assets/story_icon_2.svg'
import storyIcon3 from '@/assets/story_icon_3.svg'
import storyIcon4 from '@/assets/story_icon_4.svg'
import storyIcon5 from '@/assets/story_icon_5.svg'
import storyIcon6 from '@/assets/story_icon_6.svg'
import storyIcon7 from '@/assets/story_icon_7.svg'
import letsExploreArrow from '@/assets/lets_explore_arrow.svg'
import videCoedLeft from '@/assets/video_coed_left.svg'
import videCoedRight from '@/assets/vide_coed_right.svg'
import crVideo from '@/assets/OS.mov'
import playIcon from '@/assets/play.svg'
import { fetchMediaCenter, type MediaCenterArticle } from '@/utils/api'

interface MediaCard {
  id: number
  title: string
  source: string
  date: string
  image: string
  sourceLogo: string
  sourceLink: string
}

export const MediaCentre: React.FC = () => {
  const [mediaCards, setMediaCards] = useState<MediaCard[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleRows, setVisibleRows] = useState(1) // Start with 1 page (3 rows)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('Most recent')
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Local state for filters (not applied until search button is clicked)
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [localSelectedFilter, setLocalSelectedFilter] = useState('Most recent')

  // Array of story icons
  const storyIcons = [storyIcon1, storyIcon2, storyIcon3, storyIcon4, storyIcon5, storyIcon6, storyIcon7]

  // Function to get a random icon for each card based on its id
  const getStoryIcon = (cardId: number) => {
    return storyIcons[(cardId - 1) % 7]
  }

  // Fetch media center data from API
  useEffect(() => {
    const loadMediaCenter = async () => {
      try {
        setLoading(true)
        setError(null)
        const articles = await fetchMediaCenter()
        
        // Transform API data to MediaCard format
        const transformedCards: MediaCard[] = articles.map((article: MediaCenterArticle) => ({
          id: article.id,
          title: article.news_title,
          source: article.source_name,
          date: article.date,
          image: article.image,
          sourceLogo: article.source_logo,
          sourceLink: article.source_link,
        }))
        
        setMediaCards(transformedCards)
      } catch (err) {
        console.error('Error loading media center:', err)
        setError('Failed to load media center articles. Please try again later.')
        setMediaCards([])
      } finally {
        setLoading(false)
      }
    }
    
    loadMediaCenter()
  }, [])

  // Filter and sort media cards
  const filteredCards = React.useMemo(() => {
    let filtered = mediaCards.filter(card =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.source.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Apply sorting
    switch (selectedFilter) {
      case 'Most recent':
        filtered = [...filtered].sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateB - dateA // Descending (newest first)
        })
        break
      case 'Oldest first':
        filtered = [...filtered].sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateA - dateB // Ascending (oldest first)
        })
        break
      case 'A-Z':
        filtered = [...filtered].sort((a, b) => 
          a.title.localeCompare(b.title)
        )
        break
      case 'Z-A':
        filtered = [...filtered].sort((a, b) => 
          b.title.localeCompare(a.title)
        )
        break
    }

    return filtered
  }, [mediaCards, searchQuery, selectedFilter])

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== '' || selectedFilter !== 'Most recent'

  // Handle search submit - apply filters (keep modal open)
  const handleSearch = () => {
    setSearchQuery(localSearchQuery)
    setSelectedFilter(localSelectedFilter)
    setVisibleRows(1)
    // Don't close the modal - let user close it manually with × button
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setLocalSearchQuery('')
    setLocalSelectedFilter('Most recent')
    setSearchQuery('')
    setSelectedFilter('Most recent')
    setVisibleRows(1)
  }

  // Cards per page: 4 columns × 3 rows = 12 cards
  const cardsPerPage = 12
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  const currentPage = visibleRows
  const visibleCards = filteredCards.slice(0, currentPage * cardsPerPage)

  const handleLoadMore = () => {
    if (visibleRows < totalPages) {
      setVisibleRows(prev => prev + 1)
    }
  }

  const handleFindOutMore = () => {
    // Show all remaining cards by setting to total pages
    if (visibleRows < totalPages) {
      setVisibleRows(totalPages)
    }
  }

  const hasMore = visibleRows < totalPages && visibleCards.length < filteredCards.length

  // Reset visible rows when search query or filter changes
  useEffect(() => {
    setVisibleRows(1)
  }, [searchQuery, selectedFilter])

  // Sync local state with applied state when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setLocalSearchQuery(searchQuery)
      setLocalSelectedFilter(selectedFilter)
    }
  }, [isSearchOpen, searchQuery, selectedFilter])

  // Toggle video play/pause
  const handleToggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  // Handle video events
  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
  }

  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  }

  // Handle fullscreen
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen()
      } else if ((videoRef.current as any).mozRequestFullScreen) {
        (videoRef.current as any).mozRequestFullScreen()
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen()
      }
    }
  }

  return (
    <>
      <SEO
        title="Media Centre - Sacred Groves"
        description="If you are a member of Media you may contact us at connect@sacredgroves.earth"
      />

      {/* Intro Text Section */}
      <section className={styles.introSection}>
        <div className={styles.introContainer}>
          <p className={styles.introText}>
            If you are a member of Media you may contact us at{' '}
            <a href="mailto:connect@sacredgroves.earth" className={styles.introLink}>
              connect@sacredgroves.earth
            </a>
          </p>
        </div>
      </section>

      {/* Media Cards Section */}
      <section className={styles.mediaSection}>
        <div className={styles.mediaContainer}>
          {/* Search Icon - Initially visible */}
          {!isSearchOpen && (
            <button
              className={styles.searchIconButton}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <img src={searchIcon} alt="Search" className={styles.searchIconImg} />
            </button>
          )}

          {/* Search Popup - Opens on click */}
          {isSearchOpen && (
            <div className={styles.searchBubble}>
              <button
                className={styles.searchCloseButton}
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                ×
              </button>

              <div className={styles.searchBubbleRow}>
                {/* Search our journal */}
                <div className={styles.searchColumn}>
                  <label className={styles.searchLabel}>Search our journal</label>
                  <div className={styles.searchInputWrapper}>
                    <input
                      type="text"
                      placeholder="Search by keyword"
                      value={localSearchQuery}
                      onChange={(e) => {
                        setLocalSearchQuery(e.target.value)
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          handleSearch()
                        }
                      }}
                      className={styles.searchInput}
                    />
                    <img src={searchIcon} alt="" className={styles.searchInputIcon} />
                  </div>
                </div>

                {/* Filter by */}
                <div className={styles.searchColumn}>
                  <label className={styles.searchLabel}>Filter by</label>
                  <select
                    className={styles.searchSelect}
                    value={localSelectedFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setLocalSelectedFilter(e.target.value)
                    }}
                  >
                    <option value="Most recent">Most recent</option>
                    <option value="Oldest first">Oldest first</option>
                    <option value="A-Z">A-Z</option>
                    <option value="Z-A">Z-A</option>
                  </select>
                </div>

                {/* Search Button and Clear Button Row */}
                <div className={styles.searchButtonsRow}>
                  <button
                    className={styles.searchSubmitButton}
                    onClick={handleSearch}
                    aria-label="Search"
                  >
                    <img src={searchIcon} alt="Search" className={styles.searchSubmitIcon} />
                  </button>
                  {/* Clear Filters Button - Icon only, same row */}
                  {hasActiveFilters && (
                    <button
                      className={styles.clearFiltersButtonIcon}
                      onClick={handleClearFilters}
                      aria-label="Clear filters"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State - Inline in listing section */}
          {loading && (
            <div className={styles.inlineLoader}>
              <img 
                src="/assets/img/elephantgif.gif" 
                alt="Loading..." 
                className={styles.loaderGif}
              />
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && visibleCards.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No media articles found. Try adjusting your search.</p>
            </div>
          )}

          {!loading && !error && visibleCards.length > 0 && (
            <div className={styles.mediaGrid}>
              {visibleCards.map((card) => (
                <a
                  key={card.id}
                  href={card.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mediaCard}
                >
                  <div className={styles.mediaCardImageWrapper}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className={styles.mediaCardImage}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.src = `https://picsum.photos/204/257?random=${card.id}`
                      }}
                    />
                  </div>
                  <div className={styles.mediaCardContent}>
                    <div className={styles.mediaCardSourceWrapper}>
                      {card.sourceLogo && (
                        <img
                          src={card.sourceLogo}
                          alt={card.source}
                          className={styles.mediaCardSourceLogo}
                          onError={(e) => {
                            // Hide logo if it fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      )}
                      <div className={styles.mediaCardSource}>{card.source}</div>
                    </div>
                    <div className={styles.mediaCardTitleWrapper}>
                      <h3 className={styles.mediaCardTitle}>{card.title}</h3>
                      <div className={styles.mediaCardIcon}>
                        <img
                          src={getStoryIcon(card.id)}
                          alt="Media icon"
                          className={styles.mediaCardIconImage}
                        />
                      </div>
                    </div>
                    <div className={styles.mediaCardDate}>{card.date}</div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Find Out More Button - Show when there are more cards to load */}
          {hasMore && (
            <div className={styles.findOutMoreContainer}>
              <button
                className={styles.findOutMoreButton}
                onClick={handleLoadMore}
                aria-label="Find out more"
              >
                FIND OUT MORE
                <img
                  src={letsExploreArrow}
                  alt="Arrow"
                  className={styles.findOutMoreArrow}
                />
              </button>
            </div>
          )}

          {/* Find Out More Button - Show when there are more cards to load */}
          {!hasMore && visibleCards.length < filteredCards.length && (
            <div className={styles.findOutMoreContainer}>
              <button
                className={styles.findOutMoreButton}
                onClick={handleFindOutMore}
                aria-label="Find out more"
              >
                FIND OUT MORE
                <img
                  src={letsExploreArrow}
                  alt="Arrow"
                  className={styles.findOutMoreArrow}
                />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <img src={videCoedLeft} alt="Video Icon Left" className={styles.videoIconLeft} />
          <div className={styles.videoCenter} onClick={handleToggleVideo}>
            <video
              ref={videoRef}
              className={styles.videoElement}
              loop
              playsInline
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
            >
              <source src={crVideo} type="video/quicktime" />
              <source src={crVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isVideoPlaying && (
              <button
                className={styles.playButton}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleVideo()
                }}
                aria-label="Play video"
              >
                <img src={playIcon} alt="Play" className={styles.playIcon} />
              </button>
            )}
            <button
              className={styles.fullscreenButton}
              onClick={(e) => {
                e.stopPropagation()
                handleFullscreen()
              }}
              aria-label="Fullscreen"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <img src={videCoedRight} alt="Video Icon Right" className={styles.videoIconRight} />
        </div>
      </section>

      {/* Aligned with UN SDGs Section */}
      <AlignedWithUNSDGs hideLinkedInCarousel={true} />
    </>
  )
}

