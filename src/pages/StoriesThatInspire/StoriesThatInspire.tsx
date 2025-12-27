import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SEO } from '@/components/common/SEO'
import { PAGE_SEO, BREADCRUMBS } from '@/constants'
import styles from './StoriesThatInspire.module.css'
import storyHeroBg from '@/assets/story_hero_bg.svg'
import heroCenterStory from '@/assets/hero_center_story.svg'
import storyHeroIcon from '@/assets/story_hero_icon.svg'
import rightarrow from '@/assets/right_arrow.svg'
import letsExploreArrow from '@/assets/lets_explore_arrow.svg'
import searchIcon from '@/assets/search.svg'
import storyIcon1 from '@/assets/story_icon_1.svg'
import storyIcon2 from '@/assets/story_icon_2.svg'
import storyIcon3 from '@/assets/story_icon_3.svg'
import storyIcon4 from '@/assets/story_icon_4.svg'
import storyIcon5 from '@/assets/story_icon_5.svg'
import storyIcon6 from '@/assets/story_icon_6.svg'
import storyIcon7 from '@/assets/story_icon_7.svg'
import storyLeftLine from '@/assets/story_left_line.svg'
import storyLeftLogo from '@/assets/story_left_logo.svg'
import storyCenterImage from '@/assets/story_center_image.svg'
import storyRightArrow from '@/assets/story_right_arrow.svg'
import storyRightIcon from '@/assets/story_right_icon.svg'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections'
import { 
    fetchAllBlogs, 
    fetchTags,
    getFeaturedImageUrl,
    type BlogPost,
    type BlogTag
} from '@/utils/blogApi'

export const StoriesThatInspire: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [visibleRows, setVisibleRows] = useState(1) // Start with 1 page (3 rows)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'All tags')
    const [selectedFilter, setSelectedFilter] = useState('Most recent')
    const [blogs, setBlogs] = useState<BlogPost[]>([])
    const [allTags, setAllTags] = useState<BlogTag[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Local state for filters (not applied until search button is clicked)
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('search') || '')
    const [localSelectedTag, setLocalSelectedTag] = useState(searchParams.get('tag') || 'All tags')
    const [localSelectedFilter, setLocalSelectedFilter] = useState('Most recent')

    // Array of story icons
    const storyIcons = [storyIcon1, storyIcon2, storyIcon3, storyIcon4, storyIcon5, storyIcon6, storyIcon7]

    // Function to get a random icon for each card based on its id
    const getStoryIcon = (cardId: number) => {
        return storyIcons[(cardId - 1) % 7]
    }

    // Fetch tags on mount
    useEffect(() => {
        const loadTags = async () => {
            try {
                const tagsData = await fetchTags().catch(() => [])
                setAllTags(tagsData)
            } catch (err) {
                console.error('Error loading tags:', err)
            }
        }
        loadTags()
    }, [])

    // Fetch blogs when filters are applied (from URL params or initial load)
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Build query parameters
                const params: any = {
                    per_page: 100
                }

                // Add search query
                if (searchQuery.trim()) {
                    params.search = searchQuery.trim()
                }

                // Add tag filter
                if (selectedTag !== 'All tags') {
                    const tag = allTags.find(t => t.name === selectedTag || t.slug === selectedTag)
                    if (tag) {
                        params.tags = tag.id
                    }
                }

                // Add order and orderby based on selected filter
                switch (selectedFilter) {
                    case 'Most recent':
                        params.order = 'desc'
                        params.orderby = 'date'
                        break
                    case 'Oldest first':
                        params.order = 'asc'
                        params.orderby = 'date'
                        break
                    case 'A-Z':
                        params.order = 'asc'
                        params.orderby = 'title'
                        break
                    case 'Z-A':
                        params.order = 'desc'
                        params.orderby = 'title'
                        break
                }

                // Fetch blogs
                const blogsData = await fetchAllBlogs(params)
                setBlogs(blogsData)
            } catch (err) {
                console.error('Error loading blogs:', err)
                setError('Failed to load blogs. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [searchQuery, selectedTag, selectedFilter, allTags])

    // Handle search submit - apply filters
    const handleSearch = () => {
        setSearchQuery(localSearchQuery)
        setSelectedTag(localSelectedTag)
        setSelectedFilter(localSelectedFilter)
        setVisibleRows(1)
        setIsSearchOpen(false)
        
        // Update URL params
        const params = new URLSearchParams()
        if (localSearchQuery.trim()) {
            params.set('search', localSearchQuery.trim())
        }
        if (localSelectedTag !== 'All tags') {
            params.set('tag', localSelectedTag)
        }
        setSearchParams(params, { replace: true })
    }

    // Handle clear filters
    const handleClearFilters = () => {
        setLocalSearchQuery('')
        setLocalSelectedTag('All tags')
        setLocalSelectedFilter('Most recent')
        setSearchQuery('')
        setSelectedTag('All tags')
        setSelectedFilter('Most recent')
        setVisibleRows(1)
        setSearchParams(new URLSearchParams(), { replace: true })
    }

    // Check if any filters are active
    const hasActiveFilters = searchQuery.trim() !== '' || selectedTag !== 'All tags' || selectedFilter !== 'Most recent'

    // Cards per page: 4 columns × 3 rows = 12 cards
    const cardsPerPage = 12
    const totalPages = Math.ceil(blogs.length / cardsPerPage)
    const currentPage = visibleRows
    const visibleCards = blogs.slice(0, currentPage * cardsPerPage)

    const handleLoadMore = () => {
        if (visibleRows < totalPages) {
            setVisibleRows((prev: number) => prev + 1)
        }
    }

    const hasMore = visibleRows < totalPages

    return (
        <>
            <SEO
                title={PAGE_SEO.storiesThatInspire.title}
                description={PAGE_SEO.storiesThatInspire.description}
                keywords={PAGE_SEO.storiesThatInspire.keywords}
                ogImage={PAGE_SEO.storiesThatInspire.ogImage}
                breadcrumbs={BREADCRUMBS.storiesThatInspire}
            />

            {/* Hero Section */}
            <section className={styles.heroSection} style={{ backgroundImage: `url(${storyHeroBg})` }}>
                <div className={styles.heroContainer}>
                    {/* Left Section - Center Image and Icon */}
                    <div className={styles.heroLeft}>
                        <img
                            src={heroCenterStory}
                            alt="Hero center story"
                            className={styles.heroCenterImage}
                        />
                        <img
                            src={storyHeroIcon}
                            alt="Hero icon"
                            className={styles.heroIcon}
                        />
                    </div>

                    {/* Right Section - Text */}
                    <div className={styles.heroRight}>
                        <h1 className={styles.heroText}>
                            Timeless tales of
                            people and
                            communities who
                            are taking Climate
                            Action and
                            inspiring
                            meaningful
                            change.
                        </h1>
                    </div>
                </div>
            </section>

            {/* Stories Cards Section */}
            <section className={styles.storiesSection}>
                <div className={styles.storiesContainer}>
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

                            {/* Tags */}
                            <div className={styles.searchColumn}>
                                <label className={styles.searchLabel}>Tags</label>
                                <select
                                    className={styles.searchSelect}
                                    value={localSelectedTag}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setLocalSelectedTag(e.target.value)
                                    }}
                                >
                                    <option value="All tags">All tags</option>
                                    {allTags.map((tag) => (
                                        <option key={tag.id} value={tag.name}>
                                            {tag.name} ({tag.count})
                                        </option>
                                    ))}
                                </select>
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

                    {!loading && !error && blogs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>No blogs found. Try adjusting your search or filters.</p>
                        </div>
                    )}

                    {!loading && !error && blogs.length > 0 && (
                    <div className={styles.storiesGrid}>
                            {visibleCards.map((blog) => {
                                const featuredImage = getFeaturedImageUrl(blog)
                                const imageUrl = featuredImage || `https://picsum.photos/204/257?random=${blog.id}`
                                
                                return (
                            <Link
                                        key={blog.id}
                                        to={`/stories-that-inspire/${blog.id}`}
                                className={styles.storyCard}
                            >
                                <div className={styles.storyCardImageWrapper}>
                                    <img
                                                src={imageUrl}
                                                alt={blog.title.rendered}
                                        className={styles.storyCardImage}
                                    />
                                </div>
                                <div className={styles.storyCardContent}>
                                    <div className={styles.storyCardTitleWrapper}>
                                                <h3 className={styles.storyCardTitle}>{blog.title.rendered}</h3>
                                        <div className={styles.storyCardIcon}>
                                            <img
                                                        src={getStoryIcon(blog.id)}
                                                alt="Story icon"
                                                className={styles.storyCardIconImage}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                                )
                            })}
                    </div>
                    )}

                    {/* Load More Arrow */}
                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <button
                                className={styles.loadMoreButton}
                                onClick={handleLoadMore}
                                aria-label="Load more stories"
                            >
                                <img
                                    src={rightarrow}
                                    alt="Load more"
                                    className={styles.loadMoreArrow}
                                />
                            </button>
                        </div>
                    )}

                    {/* Find Out More Button - Only show when all cards are loaded */}
                    {!hasMore && (
                        <div className={styles.findOutMoreContainer}>
                            <Link to="/" className={styles.findOutMoreButton}>
                                FIND OUT MORE
                                <img
                                    src={letsExploreArrow}
                                    alt="Arrow"
                                    className={styles.findOutMoreArrow}
                                />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* About Us Section */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutContainer}>
                    {/* Left Section - Text, Logo, and Line */}
                    <div className={styles.aboutLeft}>
                        <h2 className={styles.aboutLeftText}>
                            for<br />
                            People<br />
                            Planet<br />
                            Prosperity<br />
                            & Purpose.
                        </h2>
                        <img
                            src={storyRightIcon}
                            alt="Decorative icons"
                            className={styles.aboutLeftIcons}
                        />
                        <div className={styles.aboutLeftLogoWrapper}>
                            <div className={styles.aboutLeftLineWrapper}>
                                <img
                                    src={storyLeftLine}
                                    alt="Decorative line"
                                    className={styles.aboutLeftLine}
                                />
                            </div>
                            <img
                                src={storyLeftLogo}
                                alt="Sacred Groves logo"
                                className={styles.aboutLeftLogo}
                            />
                        </div>
                    </div>

                    {/* Center Section - Image */}
                    <div className={styles.aboutCenter}>
                        <img
                            src={storyCenterImage}
                            alt="Sacred Groves founders"
                            className={styles.aboutCenterImage}
                        />
                    </div>

                    {/* Right Section - Icons, About Us Heading, and Text */}
                    <div className={styles.aboutRight}>
                        <img
                            src={storyRightIcon}
                            alt="Decorative icons"
                            className={styles.aboutRightIcons}
                        />
                        <div className={styles.aboutRightContent}>
                            <div className={styles.aboutRightHeadingWrapper}>
                                <h3 className={styles.aboutRightHeading}>About Us</h3>
                                <img
                                    src={storyRightArrow}
                                    alt="Arrow"
                                    className={styles.aboutRightArrow}
                                />
                            </div>
                            <div className={styles.aboutRightText}>
                                <p>
                                    Sacred Groves is a <strong>Community Interest Company</strong> incorporated in the United Kingdom, reimagining business in partnership with nature — our ultimate shareholder.
                                </p>
                                <p>
                                    With Guardians in over <strong>30 countries</strong>, we protect three biodiverse habitats in the UK and Canada.
                                </p>
                                <p>
                                    By 2030, our goal is to safeguard a million acres of critical ecosystems across the planet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Aligned with UN SDGs Section */}
            <AlignedWithUNSDGs hideLinkedInCarousel={true} />
        </>
    )
}
