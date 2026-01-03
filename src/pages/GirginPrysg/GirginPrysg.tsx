import React, { useState, useEffect, useRef } from 'react'
import { SEO } from '@/components/common/SEO'
import { PAGE_SEO, BREADCRUMBS } from '@/constants'
import { FadeInSection } from '@/components/common/FadeInSection/FadeInSection'
import styles from './GirginPrysg.module.css'
import girginBg from '@/assets/girgin_bg.svg'
import coedSec2IconLeft from '@/assets/coed_sec_2_icon_left.svg'
// import coedSec2Right from '@/assets/coes_sec_2_right.svg' // Replaced with map iframe
import coedSection3Bg from '@/assets/coed_section_3_bg.svg'
import girginSec3Center from '@/assets/girgin_sec_3_center.png'
import coedSec3Card from '@/assets/coed_sec_3_card.svg'
import girginGridLeft1 from '@/assets/girgin_grid_left_1.svg'
import girginGridLeft2 from '@/assets/girgin_grid_left_2.svg'
import girginGridLeft3 from '@/assets/girgin_grid_left_3.svg'
import girginGridRight1 from '@/assets/girgin_grid_right_1.svg'
import girginGridRight2 from '@/assets/girgin_grid_right_2.svg'
import girginSec5Left1 from '@/assets/girgin_sec_5_left_1.svg'
import sec5CarouselCard1 from '@/assets/girgin_sec_5_corousel_card_1.svg'
import sec5CarouselCard2 from '@/assets/girgin_sec_5_corousel_card_2.svg'
import sec5CarouselCard3 from '@/assets/girgin_sec_5_corousel_card_3.svg'
import sec5CarouselCard4 from '@/assets/girgin_sec_5_corousel_card_4.svg'
import sec5CarouselCard5 from '@/assets/girgin_sec_5_corousel_card_5.svg'
import sec5CarouselLeftArrow from '@/assets/sec_5_corousel_left_arrow.svg'
import sec5CarouselRightArrow from '@/assets/sec_5_corousel_right_arrow.svg'
import storyIcon1 from '@/assets/story_icon_1.svg'
import storyIcon2 from '@/assets/story_icon_2.svg'
import storyIcon3 from '@/assets/story_icon_3.svg'
import storyIcon4 from '@/assets/story_icon_4.svg'
import storyIcon5 from '@/assets/story_icon_5.svg'
import videCoedLeft from '@/assets/video_coed_left.svg'
import videCoedRight from '@/assets/vide_coed_right.svg'
import gpVideo from '@/assets/GP.mov'
import playIcon from '@/assets/play.svg'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections/CommonSections'
import { ImageModal } from '@/components/common/ImageModal'
import { fetchForestImages } from '@/utils/api'
import type { ForestImage } from '@/utils/api'

// Slot widths based on Figma design - vertical stripes in gallery bar (doubled widths)
const SLOT_WIDTHS = [36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126]

export const GirginPrysg: React.FC = () => {
    // Story icons array
    const storyIcons = [storyIcon1, storyIcon2, storyIcon3, storyIcon4, storyIcon5]

    // Generate random icons for each card
    const getRandomIcon = () => storyIcons[Math.floor(Math.random() * 5)]

    // Fallback static images
    const fallbackCarouselCards = [
        { image: sec5CarouselCard1, text: 'Woodland overview', icon: getRandomIcon() },
        { image: sec5CarouselCard2, text: 'Heather', icon: getRandomIcon() },
        { image: sec5CarouselCard3, text: 'Dense foliage', icon: getRandomIcon() },
        { image: sec5CarouselCard4, text: 'Woodland stream', icon: getRandomIcon() },
        { image: sec5CarouselCard5, text: 'National Forest for Wales Signboard', icon: getRandomIcon() }
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
    const videoRef = useRef<HTMLVideoElement>(null)
    const carouselContainerRef = useRef<HTMLDivElement>(null)
    const carouselTrackRef = useRef<HTMLDivElement>(null)
    const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null)
    const [heroBackgroundImage, setHeroBackgroundImage] = useState<string>(girginBg) // Default to initial background
    const [isHeroImageClicked, setIsHeroImageClicked] = useState<boolean>(false) // Track if user clicked an image
    const [heroImageName, setHeroImageName] = useState<string>('Girgin Prysg') // Name to show in strip, initially "Girgin Prysg"

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
                name: name || 'Girgin Prysg'
            }
        })
    }

    // Fetch images from CMS
    useEffect(() => {
        const loadImages = async () => {
            try {
                const images = await fetchForestImages('gigrin-prysg')
                
                if (images.length > 0) {
                    const grouped = groupImagesByYear(images)
                    setImagesByYear(grouped)
                    
                    // Set hero images (5 random from recent)
                    const heroImgsData = getRandomHeroImages(images, 5)
                    setHeroImagesData(heroImgsData)
                    setHeroImages(heroImgsData.map(img => img.url))
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
                text: img.post_content || img.post_excerpt || 'Girgin Prysg',
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
        
        // Fallback to 'Girgin Prysg' if still not found
        setHeroImageName(imageName || 'Girgin Prysg')
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
                title={PAGE_SEO.girginPrysg.title}
                description={PAGE_SEO.girginPrysg.description}
                keywords={PAGE_SEO.girginPrysg.keywords}
                ogImage={PAGE_SEO.girginPrysg.ogImage}
                breadcrumbs={BREADCRUMBS.girginPrysg}
            />

            <div className={styles.pageWrapper}>
                <section className={styles.heroSection} style={{ backgroundImage: `url(${isHeroImageClicked ? heroBackgroundImage : girginBg})` }}>
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
                                <span className={styles.galleryBarTitle}>Girgin Prysg</span>
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
                                    <img src={coedSec2IconLeft} alt="Girgin Prysg Icon" className={styles.section2Icon} />
                                </a>
                                <div className={styles.section2Text}>
                                    <p className={styles.section2Para}>
                                        Just south of Rhayader, Gigrin Prysg stretches across a gentle mid-Wales slope where woodland meets open valley light. The land rises quietly toward Gwastedyn Hill, creating a natural shelter that softens wind and draws the afternoon sun across the trees. The ground is shaped by shallow dips, mossed banks, and fern-lined paths that follow the curve of the hillside.
                                    </p>
                                    <p className={styles.section2Para}>
                                        A clear stream moves through the lower edge, cutting a cool line between the woodland and the views that open toward the town and the surrounding valleys.
                                    </p>
                                    <p className={styles.section2Para}>
                                        Gigrin Prysg carries the calm, grounded feel of this region; a mix of upland openness and woodland depth, held together by the steady rhythm of the landscape. It is a place that feels both rooted and expansive, shaped by contour, light, and the quiet slopes of mid Wales.
                                    </p>
                                </div>
                            </div>

                            {/* Right Section - Map */}
                            <div className={styles.section2Right}>
                                <iframe
                                    src={`${(import.meta.env.VITE_API_URL || 'https://outshade.sacredgroves.earth').replace(/\/$/, '')}/api/sutra/map/forest?forest_id=UNI_GIGR_00001&iframe_height=820&iframe_width=708&zoom_start=3&font_size_head=13&font_size_body=9&font_weight_head=600&font_weight_body=400`}
                                    frameBorder="0"
                                    className={styles.section2Map}
                                    allowFullScreen
                                    title="Gigrin Prysg Map"
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
                                        Listed for private sale, Gigrin Prysg was acquired by Sacred Groves in February 2021, for conservation. In July 2024, Gigrin Prysg became a part of the 'National Forest for Wales' network, as a recognition by the Government of Wales, UK, for the precious ecosystem services provided to the community.
                                    </p>
                                    <p className={styles.section3Text}>
                                        <span className={styles.section3TextBold}>Gigrin Prysg is an ancient mature woodland.</span> The anthropogenic impact has been mitigated via a freehold purchase that protects it from any further commercial exploitation.
                                    </p>
                                </div>
                            </div>

                            {/* Center Image */}
                            <div className={styles.centerImageWrapper}>
                                <img src={girginSec3Center} alt="Girgin Prysg Center" className={styles.centerImage} />
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
                                    {/* Top - RED KITE */}
                                    <div className={styles.gridLeftImagesTop}>
                                        <div className={styles.gridImageWrapper}>
                                            <img src={girginGridLeft2} alt="Red Kite" className={styles.gridImage} />
                                            <div className={styles.gridLabel}>RED KITE</div>
                                        </div>
                                    </div>
                                    {/* Bottom - OAK TREE and BADGER */}
                                    <div className={styles.gridLeftImagesBottom}>
                                        <div className={styles.gridImageWrapper}>
                                            <img src={girginGridLeft1} alt="Oak Tree" className={styles.gridImage} />
                                            <div className={styles.gridLabel}>OAK TREE</div>
                                        </div>
                                        <div className={styles.gridImageWrapper}>
                                            <img src={girginGridLeft3} alt="Badger" className={styles.gridImage} />
                                            <div className={styles.gridLabel}>BADGER</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Right - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextRight}>
                                    Gigrin Prysg is situated half-a-mile south of the busy market town of Rhayader, Powys. Many bird species frequent this lovely oak wood in a scenic region of mid Wales. Sightings include buzzard, sparrow hawk, cuckoo, tree creeper, lesser and greater spotted woodpecker and many others. The woodland has a sunny westerly aspect at the foot of Gwastedyn Hill.
                                </p>
                            </div>

                            {/* Bottom Left - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextLeft}>
                                    From the wood there are stunning far-reaching views across Rhayader and towards the nearby Elan Valley. There is a beautiful stream running through this woodland of predominantly sessile oak with occasional regeneration of holly, hazel, ash and rowan on the lower slopes and birch, sycamore, and ash on the upper slopes.
                                </p>
                            </div>

                            {/* Bottom Right - Image with Text */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridRightImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={girginGridRight1} alt="Honeysuckle Climbers" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>HONEYSUCKLE CLIMBERS</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={girginGridRight2} alt="Hard Shield Fern" className={styles.gridImage} />
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
                                    <div className={styles.section5LeftImageWrapper}>
                                        <img src={girginSec5Left1} alt="Peregrine Falcon" className={styles.section5LeftImage} />
                                        <div className={styles.section5LeftImageLabel}>PEREGRINE<br />FALCON</div>
                                    </div>
                                </div>
                                <div className={styles.section5Right}>
                                    <p className={styles.section5RightText}>
                                        The woodland flora community includes scaly male fern, hard shield fern, bilberry, heather and a rich diversity of mosses and lichens such as wood bristle-moss, rusty feather-moss, and old man's beard lichen. Over the years, many such ancient woodlands have been lost to commercial activities. We are privileged to support this beautiful natural habitat for the further benefit of the local community and environment.
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
                                                <p>No images available</p>
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
                                    <source src={gpVideo} type="video/quicktime" />
                                    <source src={gpVideo} type="video/mp4" />
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
