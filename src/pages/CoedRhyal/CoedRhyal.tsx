import React, { useState, useEffect } from 'react'
import { SEO } from '@/components/common/SEO'
import { PAGE_SEO, BREADCRUMBS } from '@/constants'
import { FadeInSection } from '@/components/common/FadeInSection/FadeInSection'
import styles from './CoedRhyal.module.css'
import coedBg from '@/assets/coed_bg.svg'
import coedSec2IconLeft from '@/assets/coed_sec_2_icon_left.svg'
// import coedSec2Right from '@/assets/coes_sec_2_right.svg' // Replaced with map iframe
import coedSection3Bg from '@/assets/coed_section_3_bg.svg'
import coedSec3Center from '@/assets/coed_sec_3_center.png'
import coedSec3Card from '@/assets/coed_sec_3_card.svg'
import gridLeft1 from '@/assets/grid_left_1.svg'
import gridLeft2 from '@/assets/grid_left_2.svg'
import gridRight1 from '@/assets/grid_right_1.svg'
import gridRight2 from '@/assets/grid_right_2.svg'
import sec5Left1 from '@/assets/sec_5_left_1.svg'
import sec5Left2 from '@/assets/sec_5_left_2.svg'
import sec5CarouselCard1 from '@/assets/sec_5_corousel_card_1.svg'
import sec5CarouselCard2 from '@/assets/sec_5_corousel_card_2.svg'
import sec5CarouselCard3 from '@/assets/sec_5_corousel_card_3.svg'
import sec5CarouselCard4 from '@/assets/sec_5_corousel_card_4.svg'
import sec5CarouselCard5 from '@/assets/sec_5_corousel_card_5.svg'
import sec5CarouselLeftArrow from '@/assets/sec_5_corousel_left_arrow.svg'
import sec5CarouselRightArrow from '@/assets/sec_5_corousel_right_arrow.svg'
import storyIcon1 from '@/assets/story_icon_1.svg'
import storyIcon2 from '@/assets/story_icon_2.svg'
import storyIcon3 from '@/assets/story_icon_3.svg'
import storyIcon4 from '@/assets/story_icon_4.svg'
import storyIcon5 from '@/assets/story_icon_5.svg'
import videCoedLeft from '@/assets/video_coed_left.svg'
import videCoedRight from '@/assets/vide_coed_right.svg'
import crVideo from '@/assets/OS.mov'
import playIcon from '@/assets/play.svg'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections/CommonSections'
import { ImageModal } from '@/components/common/ImageModal'
import { fetchForestImages } from '@/utils/api'
import type { ForestImage } from '@/utils/api'

// Slot widths based on Figma design - vertical stripes in gallery bar (doubled widths)
const SLOT_WIDTHS = [36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126]

export const CoedRhyal: React.FC = () => {
    // Story icons array
    const storyIcons = [storyIcon1, storyIcon2, storyIcon3, storyIcon4, storyIcon5]

    // Generate random icons for each card
    const getRandomIcon = () => storyIcons[Math.floor(Math.random() * 5)]

    // Fallback static images
    const fallbackCarouselCards = [
        { image: sec5CarouselCard1, text: 'Acorns', icon: getRandomIcon() },
        { image: sec5CarouselCard2, text: 'Veteran Oak', icon: getRandomIcon() },
        { image: sec5CarouselCard3, text: 'Ferns growing on oak', icon: getRandomIcon() },
        { image: sec5CarouselCard4, text: 'National Forest for Wales Signboard', icon: getRandomIcon() },
        { image: sec5CarouselCard5, text: 'Yellow Fairy Cups fungus', icon: getRandomIcon() }
    ]

    // State for dynamic images
    const [imagesByYear, setImagesByYear] = useState<Record<number, ForestImage[]>>({})
    const [heroImages, setHeroImages] = useState<string[]>([])
    const [heroImagesData, setHeroImagesData] = useState<Array<{ url: string; name: string }>>([]) // Store image URLs with names
    
    // Carousel cards - dynamic based on selected year
    const [carouselCards, setCarouselCards] = useState(fallbackCarouselCards)
    
    // Create a mapping of all gallery images with their names (for both dynamic and fallback)
    const GALLERY_IMAGES_MAP = React.useMemo(() => {
        const map = new Map<string, string>()
        
        // Add dynamic images
        heroImagesData.forEach(img => {
            map.set(img.url, img.name)
        })
        
        // Add fallback images
        fallbackCarouselCards.forEach(card => {
            map.set(card.image, card.text)
        })
        
        return map
    }, [heroImagesData])
    
    // Use dynamic images for gallery, fallback to static if no images
    const GALLERY_IMAGES = heroImages.length > 0 ? heroImages : fallbackCarouselCards.map(card => card.image)

    // Initialize each slot with a different starting image index
    const initializeSlotImages = (images: string[]) => {
        const numSlots = 6
        const numImages = images.length || 5 // Fallback to 5 if empty
        return Array.from({ length: numSlots }, (_, index) => index % numImages)
    }

    const [slotImages, setSlotImages] = useState<number[]>(() => initializeSlotImages(fallbackCarouselCards.map(card => card.image)))
    const [activeYear, setActiveYear] = useState<number>(2025)
    const [currentSlide, setCurrentSlide] = useState(0) // Carousel state - represents which group of 5 we're showing
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const carouselContainerRef = React.useRef<HTMLDivElement>(null)
    const carouselTrackRef = React.useRef<HTMLDivElement>(null)
    const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null)
    const [heroBackgroundImage, setHeroBackgroundImage] = useState<string>(coedBg) // Default to initial background
    const [isHeroImageClicked, setIsHeroImageClicked] = useState<boolean>(false) // Track if user clicked an image
    const [heroImageName, setHeroImageName] = useState<string>('Coed Rhyal') // Name to show in strip, initially "Coed Rhyal"

    const years = [2025, 2024, 2023, 2022, 2021]

    // Group images by year
    const groupImagesByYear = (images: ForestImage[]): Record<number, ForestImage[]> => {
        const grouped: Record<number, ForestImage[]> = {}
        
        images.forEach((image) => {
            try {
                const date = new Date(image.post_date)
                const year = date.getFullYear()
                if (!grouped[year]) {
                    grouped[year] = []
                }
                grouped[year].push(image)
            } catch (error) {
                console.error('Error parsing date:', image.post_date, error)
            }
        })
        
        return grouped
    }

    // Extract plain text from HTML
    const extractPlainText = (html: string): string => {
        if (!html) return ''
        // Remove HTML tags and decode entities
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent || div.innerText || ''
    }

    // Get random 5 images from all images for hero section
    const getRandomHeroImages = (images: ForestImage[], count: number = 5): Array<{ url: string; name: string }> => {
        if (images.length === 0) return []
        
        // Sort by date (most recent first)
        const sorted = [...images].sort((a, b) => {
            try {
                return new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
            } catch {
                return 0
            }
        })
        
        // Get first 5 (most recent) or random if we want randomness
        const recent = sorted.slice(0, Math.min(count, sorted.length))
        
        // Shuffle to get random selection
        const shuffled = [...recent].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, count).map(img => {
            // Extract plain text from post_content or post_excerpt
            const name = extractPlainText(img.post_content || img.post_excerpt || '').trim()
            return {
                url: img.guid,
                name: name || 'Coed Rhyal'
            }
        })
    }

    // Fetch images from CMS
    useEffect(() => {
        const loadImages = async () => {
            try {
                const images = await fetchForestImages('coed-rhyal')
                
                if (images.length > 0) {
                    const grouped = groupImagesByYear(images)
                    setImagesByYear(grouped)
                    
                    // Set hero images (5 random from recent)
                    const heroImgsData = getRandomHeroImages(images, 5)
                    setHeroImagesData(heroImgsData)
                    setHeroImages(heroImgsData.map(img => img.url))
                    
                    // Don't set hero background automatically - wait for user click
                    // Only set if user hasn't clicked yet and we want to show default
                } else {
                    // Use fallback if no images
                    setHeroImages([])
                    setHeroImagesData([])
                }
            } catch (error) {
                console.error('Error loading images:', error)
                setHeroImages([])
            }
        }
        
        loadImages()
    }, [])

    // Update carousel cards when year changes
    useEffect(() => {
        const yearImages = imagesByYear[activeYear] || []
        
        if (yearImages.length > 0) {
            // Create carousel cards from images for selected year
            const newCarouselCards = yearImages.slice(0, 10).map((img) => ({
                image: img.guid,
                text: img.post_content || img.post_excerpt || 'Coed Rhyal',
                icon: getRandomIcon()
            }))
            
            setCarouselCards(newCarouselCards)
            setCurrentSlide(0) // Reset carousel position when year changes
        } else {
            // Use fallback if no images for selected year
            setCarouselCards(fallbackCarouselCards)
            setCurrentSlide(0)
        }
    }, [activeYear, imagesByYear])

    // Update gallery images when hero images change
    useEffect(() => {
        if (GALLERY_IMAGES.length > 0) {
            setSlotImages(initializeSlotImages(GALLERY_IMAGES))
        }
    }, [heroImages.length])

    // Constants for carousel
    const CARDS_PER_VIEW_DESKTOP = 5
    
    // Calculate how many groups of 5 we can show
    const totalGroups = Math.ceil(carouselCards.length / CARDS_PER_VIEW_DESKTOP)
    const canGoNext = currentSlide < totalGroups - 1
    const canGoPrev = currentSlide > 0

    // Calculate slide offset - each slide moves by 5 cards (185.88px each + 20px gaps)
    const getSlideOffset = () => {
        if (carouselCards.length === 0) return '0px'
        
        const cardWidth = 185.88
        const gap = 20
        const cardsPerView = 5
        // Calculate width of 5 cards: 5 cards + 4 gaps between them
        const slideWidth = (cardWidth * cardsPerView) + (gap * (cardsPerView - 1))
        
        // Move by slideWidth * currentSlide
        return `-${currentSlide * slideWidth}px`
    }

    // Carousel navigation logic - move by 5 cards (or remaining if less than 5)
    const nextCarousel = () => {
        if (canGoNext) {
            setCurrentSlide((prev) => Math.min(prev + 1, totalGroups - 1))
        }
    }

    const prevCarousel = () => {
        if (canGoPrev) {
            setCurrentSlide((prev) => Math.max(prev - 1, 0))
        }
    }

    // Reset slide on resize if needed (optional, but good practice to avoid stuck slides on desktop if switch)
    // For now, CSS handles desktop (no transform), so mobile transform won't affect desktop visual
    // unless the transform is applied inline always. We'll use a CSS variable or conditional style.

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

    // Normalize URL for comparison (remove query params, trailing slashes, etc.)
    const normalizeUrl = (url: string): string => {
        try {
            const urlObj = new URL(url)
            return urlObj.origin + urlObj.pathname
        } catch {
            // If URL parsing fails, return as is
            return url.split('?')[0].split('#')[0]
        }
    }

    // Handle slot click - set the clicked image as hero background and update name
    const handleSlotClick = (imageIndex: number) => {
        setIsHeroImageClicked(true)
        const imageUrl = GALLERY_IMAGES[imageIndex]
        setHeroBackgroundImage(imageUrl)
        
        // Try to find the image name from the mapping
        // First try exact match
        let imageName = GALLERY_IMAGES_MAP.get(imageUrl)
        
        // If not found, try normalized URL match
        if (!imageName) {
            const normalizedUrl = normalizeUrl(imageUrl)
            for (const [url, name] of GALLERY_IMAGES_MAP.entries()) {
                if (normalizeUrl(url) === normalizedUrl) {
                    imageName = name
                    break
                }
            }
        }
        
        // Fallback to 'Coed Rhyal' if still not found
        setHeroImageName(imageName || 'Coed Rhyal')
    }

    // Auto-cycle all slots together every 4 seconds
    useEffect(() => {
        if (GALLERY_IMAGES.length === 0) return
        
        const interval = setInterval(() => {
            setSlotImages((prev) => {
                // Cycle all slots to the next image at the same time
                return prev.map((imageIndex) => (imageIndex + 1) % GALLERY_IMAGES.length)
            })
        }, 4000)

        return () => {
            clearInterval(interval)
        }
    }, [GALLERY_IMAGES.length])

    // Reset carousel scroll position on mount and when carousel changes (mobile fix)
    useEffect(() => {
        if (carouselContainerRef.current) {
            carouselContainerRef.current.scrollLeft = 0
        }
    }, [carouselCards])

    return (
        <>
            <SEO
                title={PAGE_SEO.coedRhyal.title}
                description={PAGE_SEO.coedRhyal.description}
                keywords={PAGE_SEO.coedRhyal.keywords}
                ogImage={PAGE_SEO.coedRhyal.ogImage}
                breadcrumbs={BREADCRUMBS.coedRhyal}
            />

            <div className={styles.pageWrapper}>
                <section className={styles.heroSection} style={{ backgroundImage: `url(${isHeroImageClicked ? heroBackgroundImage : coedBg})` }}>
                    <div className={styles.heroContainer}>
                        {/* Motion Gallery Bar - Bottom aligned */}
                        <div className={styles.galleryBar}>
                            <div className={styles.galleryBarLeft}>
                                <span className={styles.galleryBarLabel}>{heroImageName}</span>
                            </div>
                            <div className={styles.galleryBarCenter}>
                                {slotImages.map((imageIndex, slotIndex) => (
                                    <div
                                        key={slotIndex}
                                        className={styles.gallerySlot}
                                        style={{
                                            width: `${SLOT_WIDTHS[slotIndex % SLOT_WIDTHS.length]}px`,
                                            backgroundImage: `url(${GALLERY_IMAGES[imageIndex]})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                        onClick={() => handleSlotClick(imageIndex)}
                                    />
                                ))}
                            </div>
                            <div className={styles.galleryBarRight}>
                                <span className={styles.galleryBarArrow}>→</span>
                                <span className={styles.galleryBarTitle}>Coed Rhyal</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2 */}
                <FadeInSection>
                    <section className={styles.section2}>
                        <div className={styles.section2Container}>
                            {/* Left Section - Text with Icon */}
                            <div className={styles.section2Left}>
                                <a
                                    href="https://www.gov.wales/visit-national-forest-wales#159116"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={coedSec2IconLeft} alt="Coed Rhyal Icon" className={styles.section2Icon} />
                                </a>
                                <div className={styles.section2Text}>

                                    <p className={styles.section2Para}>
                                        Coed Rhyal rests on a quiet northwest slope overlooking Carmarthen Bay — 13.33 acres where time slows and nature finds its rhythm again. Just beyond Burry Port, this old oak woodland bursts into a bluebell sea each spring, a soft reminder of renewal.
                                    </p>
                                    <p className={styles.section2Para}>
                                        Holly and hazel form a gentle understory, and where the canopy parts, distant land and sea unfold in sweeping views. A seasonal stream murmurs along the northeast edge, slipping past mossy roots and quiet corners of the woodland.
                                    </p>
                                    <p className={styles.section2Para}>
                                        Once bordered by coal mines, Coed Rhyal now stands as an act of quiet restoration, an ecological gem — proof that when nature is allowed to breathe, she writes her own return.
                                    </p>
                                </div>
                            </div>

                            {/* Right Section - Map */}
                            <div className={styles.section2Right}>
                                <iframe
                                    src={`${(import.meta.env.VITE_API_URL || 'https://outshade.sacredgroves.earth').replace(/\/$/, '')}/api/sutra/map/forest?forest_id=UNI_COED_00002&iframe_height=820&iframe_width=708&zoom_start=3&font_size_head=13&font_size_body=9&font_weight_head=600&font_weight_body=400`}
                                    frameBorder="0"
                                    className={styles.section2Map}
                                    allowFullScreen
                                    title="Coed Rhyal Map"
                                />
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Section 3 */}
                <FadeInSection>
                    <section className={styles.section3} style={{ backgroundImage: `url(${coedSection3Bg})` }}>
                        <div className={styles.section3Container}>
                            {/* Top Section - Text */}
                            <div className={styles.section3Top}>
                                <div className={styles.section3TopText}>
                                    <p className={styles.section3Text}>
                                        Listed for private sale, Coed Rhyal was acquired by Sacred Groves in April 2021, for conservation. In May 2024, Coed Rhyal became a part of the 'National Forest for Wales' network, as a recognition by the Government of Wales, UK, for the precious ecosystem services provided to the community.
                                    </p>
                                    <p className={styles.section3Text}>
                                        <span className={styles.section3TextBold}>Coed Rhyal is an ancient mature woodland.</span> The anthropogenic impact has been mitigated via a freehold purchase that protects it from any further commercial exploitation.
                                    </p>
                                </div>
                            </div>

                            {/* Center Image */}
                            <div className={styles.centerImageWrapper}>
                                <img src={coedSec3Center} alt="Coed Rhyal Center" className={styles.centerImage} />
                            </div>

                            {/* UN SDG Section */}
                            <div className={styles.section3Middle}>
                                <p className={styles.section3TextSmall}>
                                    The full recovery of this native ecosystem is being advanced through a natural regeneration approach.
                                </p>
                                <p className={styles.section3TextSmall}>
                                    This approach is in line with the ethos of (United Nations Sustainable Development Goals) UN SDG 15 and also serves the objectives of the United Nations Decade on Ecosystem Restoration (2021–2030).
                                </p>
                            </div>

                            {/* Bottom Section with Card */}
                            <div className={styles.section3Bottom}>
                                <img src={coedSec3Card} alt="15 LIFE ON LAND" className={styles.section3CardImage} />
                                <div className={styles.section3BottomTextWrapper}>
                                    <p className={styles.section3BottomText}>
                                        Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification and halt and reverse land degradation and halt biodiversity loss.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Section 4 - Grid Layout */}
                <FadeInSection>
                    <section className={styles.section4}>
                        <div className={styles.section4Container}>
                            {/* Top Left - Images with Text */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridLeftImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={gridLeft1} alt="Oak Tree" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>OAK TREE</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={gridLeft2} alt="Bluebells" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>BLUEBELLS</div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Right - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextRight}>
                                    Coed Rhyal, a 13.33 acre woodland of mature oak, occupies a north west facing slope that looks out over Carmarthen Bay. A stone's throw from Burry Port this delightful woodland is almost pure, old oak with a floor adorned with a carpet of bluebells in the spring and early summer months.
                                </p>
                            </div>

                            {/* Bottom Left - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextLeft}>
                                    The closed canopy of the oak casts a shadow on the characterful woodland habitat that lies beneath the leaf cover. With honeysuckle climbers, bilberry, primrose and ferns, Coed Rhyal is an ecological gem. The woodland contains extensive fallen and standing deadwood as well as mature trees with extensive cavities, which are also a valuable ecological resource.
                                </p>
                            </div>

                            {/* Bottom Right - Image with Text */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridRightImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={gridRight1} alt="Honeysuckle Climbers" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>HONEYSUCKLE CLIMBERS</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={gridRight2} alt="Hard Shield Fern" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>HARD SHIELD FERN</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Section 5 */}
                <FadeInSection>
                    <section className={styles.section5}>
                        <div className={styles.section5Container}>
                            {/* First Half - Images and Text */}
                            <div className={styles.section5FirstHalf}>
                                <div className={styles.section5Left}>
                                    <div className={styles.section5ImageWrapper}>
                                        <img src={sec5Left1} alt="Peregrine Falcon" className={styles.section5LeftImage} />
                                        <div className={styles.section5Label}>Peregrine<br />Falcon</div>
                                    </div>
                                    <div className={styles.section5ImageWrapper}>
                                        <img src={sec5Left2} alt="Puffins" className={styles.section5LeftImageSmall} />
                                        <div className={styles.section5Label}>Puffins</div>
                                    </div>
                                </div>
                                <div className={styles.section5Right}>
                                    <p className={styles.section5RightText}>
                                        There is a patchy lower canopy of holly and hazel typical of oak woodlands. Where the canopy breaks, a stunning outlook offers a feast for the eyes with views of distant land and water. A seasonal stream trickles down the northeast boundary. This pristine woodland is in the midst of the coal mining industry that was once a thriving industry in the area.
                                    </p>
                                </div>
                            </div>

                            {/* Second Half - Year Tabs and Carousel */}
                            <div className={styles.section5SecondHalf}>
                                {/* Year Tabs */}
                                <div className={styles.yearTabs}>
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            className={`${styles.yearTab} ${activeYear === year ? styles.yearTabActive : ''}`}
                                            onClick={() => setActiveYear(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                {/* Carousel */}
                                <div className={styles.carouselWrapper}>
                                    {canGoPrev && (
                                        <button className={styles.carouselArrow} onClick={prevCarousel}>
                                            <img src={sec5CarouselLeftArrow} alt="Previous" />
                                        </button>
                                    )}
                                    {!canGoPrev && <div className={styles.carouselArrowPlaceholder} />}

                                    <div className={styles.carouselContainer} ref={carouselContainerRef}>
                                        <div
                                            ref={carouselTrackRef}
                                            className={styles.carouselTrack}
                                            style={{
                                                '--slide-offset': getSlideOffset()
                                            } as React.CSSProperties}
                                        >
                                            {carouselCards.length > 0 ? (
                                                carouselCards.map((card, index) => (
                                                    <div key={index} className={styles.carouselCard}>
                                                        <img
                                                            src={card.image}
                                                            alt={card.text}
                                                            className={styles.carouselCardImage}
                                                            onClick={() => setSelectedImage({ src: card.image, title: card.text })}
                                                            style={{ cursor: 'pointer' }}
                                                            onError={(e) => {
                                                                // Fallback to default image on error
                                                                const target = e.target as HTMLImageElement
                                                                if (target.src !== sec5CarouselCard1) {
                                                                    target.src = sec5CarouselCard1
                                                                }
                                                            }}
                                                        />
                                                        <div className={styles.carouselCardContent}>
                                                            <p className={styles.carouselCardText}>{card.text}</p>
                                                            <img src={card.icon} alt="Icon" className={styles.carouselCardIcon} />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                // Show loading or fallback
                                                <div className={styles.carouselCard}>
                                                    <img
                                                        src={sec5CarouselCard1}
                                                        alt="Loading"
                                                        className={styles.carouselCardImage}
                                                    />
                                                    <div className={styles.carouselCardContent}>
                                                        <p className={styles.carouselCardText}>Loading...</p>
                                                        <img src={storyIcon1} alt="Icon" className={styles.carouselCardIcon} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {canGoNext && (
                                        <button className={styles.carouselArrow} onClick={nextCarousel}>
                                            <img src={sec5CarouselRightArrow} alt="Next" />
                                        </button>
                                    )}
                                    {!canGoNext && <div className={styles.carouselArrowPlaceholder} />}
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Section 6 - Video Icons Section */}
                <FadeInSection>
                    <section className={styles.section6}>
                        <div className={styles.section6Container}>
                            <img src={videCoedLeft} alt="Video Icon Left" className={styles.section6IconLeft} />
                            <div className={styles.section6Center} onClick={handleToggleVideo}>
                                <video
                                    ref={videoRef}
                                    className={styles.section6Video}
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
                            <img src={videCoedRight} alt="Video Icon Right" className={styles.section6IconRight} />
                        </div>
                    </section>
                </FadeInSection>

                {/* Aligned with UN SDGs Section */}
                <AlignedWithUNSDGs hideLinkedInCarousel={true} />
            </div>

            {/* Image Modal */}
            <ImageModal
                isOpen={selectedImage !== null}
                onClose={() => setSelectedImage(null)}
                imageSrc={selectedImage?.src || ''}
                imageTitle={selectedImage?.title || ''}
            />
        </>
    )
}
