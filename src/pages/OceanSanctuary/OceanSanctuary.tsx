import React, { useState, useEffect, useRef } from 'react'
import { SEO } from '@/components/common/SEO'
import { PAGE_SEO, BREADCRUMBS } from '@/constants'
import { FadeInSection } from '@/components/common/FadeInSection/FadeInSection'
import styles from './OceanSanctuary.module.css'
import oceanBg from '@/assets/ocean_bg.svg'
import { fetchForestImages } from '@/utils/api'
import type { ForestImage } from '@/utils/api'
import coedSec2IconLeft from '@/assets/coed_sec_2_icon_left.svg'
// import oceanSec2Right from '@/assets/ocean_sec_2_right.svg' // Replaced with map iframe
import coedSection3Bg from '@/assets/coed_section_3_bg.svg'
import oceanSec3Center from '@/assets/ocean_sec_3_center.png'
import coedSec3Card from '@/assets/coed_sec_3_card.svg'
import oceanGridLeft1 from '@/assets/ocean_grid_left_1.svg'
import oceanGridLeft2 from '@/assets/ocean_grid_left_2.svg'
// import gridRight1 from '@/assets/grid_right_1.svg'
// import gridRight2 from '@/assets/grid_right_2.svg'
// import sec5Left1 from '@/assets/sec_5_left_1.svg'
// import sec5Left2 from '@/assets/sec_5_left_2.svg'
// Static zone images removed - now using dynamic images from CMS
import sec5CarouselLeftArrow from '@/assets/sec_5_corousel_left_arrow.svg'
import sec5CarouselRightArrow from '@/assets/sec_5_corousel_right_arrow.svg'
import storyIcon1 from '@/assets/story_icon_1.svg'
import storyIcon2 from '@/assets/story_icon_2.svg'
import storyIcon3 from '@/assets/story_icon_3.svg'
import storyIcon4 from '@/assets/story_icon_4.svg'
import storyIcon5 from '@/assets/story_icon_5.svg'
import videCoedLeft from '@/assets/video_coed_left.svg'
import videCoedRight from '@/assets/vide_coed_right.svg'
import osVideo from '@/assets/OS.mov'
import playIcon from '@/assets/play.svg'
import mooseIcon from '@/assets/moose.svg'
import mayflowerIcon from '@/assets/mayflower.svg'
import blackSpruceIcon from '@/assets/black_spruce.svg'
import mushroomIcon from '@/assets/mushroom.svg'
import turtleIcon from '@/assets/turtle.svg'
import eelgrassIcon from '@/assets/eelgrass.svg'
import whelksIcon from '@/assets/whelks.svg'
import ecologicalIcon from '@/assets/ecological.svg'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections/CommonSections'
import { ImageModal } from '@/components/common/ImageModal'

// Slot widths based on Figma design - vertical stripes in gallery bar (doubled widths)
const SLOT_WIDTHS = [36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126]

export const OceanSanctuary: React.FC = () => {
    // Story icons array
    const storyIcons = [storyIcon1, storyIcon2, storyIcon3, storyIcon4, storyIcon5]

    // Generate random icons for each card
    const getRandomIcon = () => storyIcons[Math.floor(Math.random() * 5)]

    // Zone categories for CMS
    const ZONE_CATEGORIES = ['ocean-sanctuary-z1', 'ocean-sanctuary-z2', 'ocean-sanctuary-z3', 'ocean-sanctuary-z4', 'ocean-sanctuary-z5']

    // State for dynamic images by zone and year
    const [imagesByZoneAndYear, setImagesByZoneAndYear] = useState<Record<number, Record<number, ForestImage[]>>>({})
    const [heroImages, setHeroImages] = useState<string[]>([])
    const [heroImagesData, setHeroImagesData] = useState<Array<{ url: string; name: string }>>([])
    
    // Carousel cards for each zone - dynamic based on selected year
    const [zone1Cards, setZone1Cards] = useState<Array<{ image: string; text: string; icon: string }>>([])
    const [zone2Cards, setZone2Cards] = useState<Array<{ image: string; text: string; icon: string }>>([])
    const [zone3Cards, setZone3Cards] = useState<Array<{ image: string; text: string; icon: string }>>([])
    const [zone4Cards, setZone4Cards] = useState<Array<{ image: string; text: string; icon: string }>>([])
    const [zone5Cards, setZone5Cards] = useState<Array<{ image: string; text: string; icon: string }>>([])

    // Create a mapping of all gallery images with their names
    const GALLERY_IMAGES_MAP = React.useMemo(() => {
        const map = new Map<string, string>()
        heroImagesData.forEach(img => {
            map.set(img.url, img.name)
        })
        return map
    }, [heroImagesData])

    // Use dynamic images for gallery
    const GALLERY_IMAGES = heroImages.length > 0 ? heroImages : []

    // Initialize each slot with a different starting image index
    const initializeSlotImages = (images: string[]) => {
        const numSlots = 6
        const numImages = images.length || 1
        return Array.from({ length: numSlots }, (_, index) => index % numImages)
    }

    const [slotImages, setSlotImages] = useState<number[]>(() => initializeSlotImages([]))
    const [activeYear, setActiveYear] = useState<number>(2025)
    const [activeYearZone2, setActiveYearZone2] = useState<number>(2025)
    const [activeYearZone3, setActiveYearZone3] = useState<number>(2025)
    const [activeYearZone4, setActiveYearZone4] = useState<number>(2025)
    const [activeYearZone5, setActiveYearZone5] = useState<number>(2025)
    const [currentSlide, setCurrentSlide] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const carouselContainerRefs = useRef<Record<number, HTMLDivElement | null>>({ 1: null, 2: null, 3: null, 4: null, 5: null })
    const carouselTrackRefs = useRef<Record<number, HTMLDivElement | null>>({ 1: null, 2: null, 3: null, 4: null, 5: null })
    const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null)
    const [heroBackgroundImage, setHeroBackgroundImage] = useState<string>(oceanBg)
    const [isHeroImageClicked, setIsHeroImageClicked] = useState<boolean>(false)
    const [heroImageName, setHeroImageName] = useState<string>('Ocean Sanctuary')

    const years = [2025, 2024, 2023, 2022, 2021]

    // Group images by year for a zone
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
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent || div.innerText || ''
    }

    // Get random 5 images from all zones for hero section
    const getRandomHeroImages = (allImages: ForestImage[], count: number = 5): Array<{ url: string; name: string }> => {
        if (allImages.length === 0) return []
        const sorted = [...allImages].sort((a, b) => {
            try {
                return new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
            } catch {
                return 0
            }
        })
        const recent = sorted.slice(0, Math.min(count, sorted.length))
        const shuffled = [...recent].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, count).map(img => {
            const name = extractPlainText(img.post_content || img.post_excerpt || '').trim()
            return {
                url: img.guid,
                name: name || 'Ocean Sanctuary'
            }
        })
    }

    // Fetch images from CMS for all zones
    useEffect(() => {
        const loadImages = async () => {
            try {
                const allImages: ForestImage[] = []
                const zoneYearMap: Record<number, Record<number, ForestImage[]>> = {}

                // Fetch images for each zone
                for (let zoneIndex = 0; zoneIndex < ZONE_CATEGORIES.length; zoneIndex++) {
                    const zoneNum = zoneIndex + 1
                    const category = ZONE_CATEGORIES[zoneIndex]
                    const images = await fetchForestImages(category)
                    
                    if (images.length > 0) {
                        const grouped = groupImagesByYear(images)
                        zoneYearMap[zoneNum] = grouped
                        allImages.push(...images)
                    }
                }

                setImagesByZoneAndYear(zoneYearMap)

                // Set hero images (5 random from all zones)
                if (allImages.length > 0) {
                    const heroImgsData = getRandomHeroImages(allImages, 5)
                    setHeroImagesData(heroImgsData)
                    setHeroImages(heroImgsData.map(img => img.url))
                } else {
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

    // Update carousel cards when year changes for each zone
    useEffect(() => {
        const updateZoneCards = (zoneNum: number, activeYear: number, setCards: React.Dispatch<React.SetStateAction<Array<{ image: string; text: string; icon: string }>>>) => {
            const yearImages = imagesByZoneAndYear[zoneNum]?.[activeYear] || []
            if (yearImages.length > 0) {
                const newCards = yearImages.slice(0, 10).map((img) => ({
                    image: img.guid,
                    text: extractPlainText(img.post_content || img.post_excerpt || 'Ocean Sanctuary'),
                    icon: getRandomIcon()
                }))
                setCards(newCards)
                setCurrentSlide(prev => ({ ...prev, [zoneNum]: 0 }))
            } else {
                setCards([])
                setCurrentSlide(prev => ({ ...prev, [zoneNum]: 0 }))
            }
        }

        updateZoneCards(1, activeYear, setZone1Cards)
        updateZoneCards(2, activeYearZone2, setZone2Cards)
        updateZoneCards(3, activeYearZone3, setZone3Cards)
        updateZoneCards(4, activeYearZone4, setZone4Cards)
        updateZoneCards(5, activeYearZone5, setZone5Cards)
    }, [activeYear, activeYearZone2, activeYearZone3, activeYearZone4, activeYearZone5, imagesByZoneAndYear])

    // Update gallery images when hero images change
    useEffect(() => {
        if (GALLERY_IMAGES.length > 0) {
            setSlotImages(initializeSlotImages(GALLERY_IMAGES))
        }
    }, [heroImages.length])

    // Carousel navigation logic for each zone
    const getCarouselCards = (zoneNum: number) => {
        switch (zoneNum) {
            case 1: return zone1Cards
            case 2: return zone2Cards
            case 3: return zone3Cards
            case 4: return zone4Cards
            case 5: return zone5Cards
            default: return []
        }
    }

    const CARDS_PER_VIEW_DESKTOP = 5

    const getTotalGroups = (zoneNum: number) => {
        const cards = getCarouselCards(zoneNum)
        return Math.ceil(cards.length / CARDS_PER_VIEW_DESKTOP)
    }

    const canGoNext = (zoneNum: number) => {
        const totalGroups = getTotalGroups(zoneNum)
        return currentSlide[zoneNum] < totalGroups - 1
    }

    const canGoPrev = (zoneNum: number) => {
        return currentSlide[zoneNum] > 0
    }

    const getSlideOffset = (zoneNum: number) => {
        const cards = getCarouselCards(zoneNum)
        if (cards.length === 0) return '0px'
        const cardWidth = 185.88
        const gap = 20
        const cardsPerView = 5
        const slideWidth = (cardWidth * cardsPerView) + (gap * (cardsPerView - 1))
        return `-${currentSlide[zoneNum] * slideWidth}px`
    }

    const nextCarousel = (zoneNum: number) => {
        if (canGoNext(zoneNum)) {
            setCurrentSlide(prev => ({
                ...prev,
                [zoneNum]: Math.min(prev[zoneNum] + 1, getTotalGroups(zoneNum) - 1)
            }))
        }
    }

    const prevCarousel = (zoneNum: number) => {
        if (canGoPrev(zoneNum)) {
            setCurrentSlide(prev => ({
                ...prev,
                [zoneNum]: Math.max(prev[zoneNum] - 1, 0)
            }))
        }
    }

    // Normalize URL for comparison
    const normalizeUrl = (url: string): string => {
        try {
            const urlObj = new URL(url)
            return urlObj.origin + urlObj.pathname
        } catch {
            return url.split('?')[0].split('#')[0]
        }
    }

    // Handle slot click - set the clicked image as hero background and update name
    const handleSlotClick = (imageIndex: number) => {
        if (GALLERY_IMAGES.length === 0) return
        
        setIsHeroImageClicked(true)
        const imageUrl = GALLERY_IMAGES[imageIndex]
        setHeroBackgroundImage(imageUrl)
        
        let imageName = GALLERY_IMAGES_MAP.get(imageUrl)
        if (!imageName) {
            const normalizedUrl = normalizeUrl(imageUrl)
            for (const [url, name] of GALLERY_IMAGES_MAP.entries()) {
                if (normalizeUrl(url) === normalizedUrl) {
                    imageName = name
                    break
                }
            }
        }
        setHeroImageName(imageName || 'Ocean Sanctuary')
    }

    // Auto-cycle all slots together every 4 seconds
    useEffect(() => {
        if (GALLERY_IMAGES.length === 0) return
        
        const interval = setInterval(() => {
            setSlotImages((prev) => {
                return prev.map((imageIndex) => (imageIndex + 1) % GALLERY_IMAGES.length)
            })
        }, 4000)

        return () => {
            clearInterval(interval)
        }
    }, [GALLERY_IMAGES.length])

    // Reset carousel scroll positions
    useEffect(() => {
        Object.values(carouselContainerRefs.current).forEach(ref => {
            if (ref) {
                ref.scrollLeft = 0
            }
        })
    }, [zone1Cards, zone2Cards, zone3Cards, zone4Cards, zone5Cards])

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
                title={PAGE_SEO.oceanSanctuary.title}
                description={PAGE_SEO.oceanSanctuary.description}
                keywords={PAGE_SEO.oceanSanctuary.keywords}
                ogImage={PAGE_SEO.oceanSanctuary.ogImage}
                breadcrumbs={BREADCRUMBS.oceanSanctuary}
            />

            <div className={styles.pageWrapper}>
                <section className={styles.heroSection} style={{ backgroundImage: `url(${isHeroImageClicked ? heroBackgroundImage : oceanBg})` }}>
                    <div className={styles.heroContainer}>
                        {/* Motion Gallery Bar - Bottom aligned */}
                        <div className={styles.galleryBar}>
                            <div className={styles.galleryBarLeft}>
                                <span className={styles.galleryBarLabel}>{heroImageName}</span>
                            </div>
                            <div className={styles.galleryBarCenter}>
                                {GALLERY_IMAGES.length > 0 ? (
                                    slotImages.map((imageIndex, slotIndex) => (
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
                                    ))
                                ) : (
                                    // Show placeholder slots when no images are available
                                    Array.from({ length: 6 }).map((_, slotIndex) => (
                                        <div
                                            key={slotIndex}
                                            className={styles.gallerySlot}
                                            style={{
                                                width: `${SLOT_WIDTHS[slotIndex % SLOT_WIDTHS.length]}px`,
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                            <div className={styles.galleryBarRight}>
                                <span className={styles.galleryBarArrow}>→</span>
                                <span className={styles.galleryBarTitle}>Ocean Sanctuary</span>
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
                                    <img src={coedSec2IconLeft} alt="Ocean Sanctuary Icon" className={styles.section2Icon} />
                                </a>
                                <div className={styles.section2Text}>
                                    <p className={styles.section2Para}>
                                        Along Nova Scotia's South Shore lies Ocean Sanctuary, an 83-acre forest corridor connecting the Atlantic's saltwater with the freshwater of Haley Lake to create a rare, living harmony.
                                    </p>
                                    <p className={styles.section2Para}>
                                        A landscape of contrast granite shores, salt-marsh meadows, and quiet forests shape this place. The Big Meadow Creek shelters migratory birds, wild roses, white pines, and coastal shrubs stitch resilience into the land.
                                    </p>
                                    <p className={styles.section2Para}>
                                        A haven for life on the wing bordered by two historic bird sanctuaries — Port L'Hebert (1941) and Haley Lake (1980), the skies here are alive with geese, harlequin ducks, ospreys, goldeneyes, and eagles.
                                    </p>
                                    <p className={styles.section2Para}>
                                        Five habitats, one sanctuary. From rocky coasts and salt marsh to an inland lake, old forest, and freshwater edges, different worlds united by one enduring rhythm: renewal.
                                    </p>
                                </div>
                            </div>

                            {/* Right Section - Map */}
                            <div className={styles.section2Right}>
                                <iframe
                                    src={`${(import.meta.env.VITE_API_URL || 'https://outshade.sacredgroves.earth').replace(/\/$/, '')}/api/sutra/map/forest?forest_id=CAN_OCEA_00003&iframe_height=820&iframe_width=900&zoom_start=3&font_size_head=13&font_size_body=9&font_weight_head=600&font_weight_body=400`}
                                    frameBorder="0"
                                    className={styles.section2Map}
                                    allowFullScreen
                                    title="Ocean Sanctuary Map"
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
                                        Ocean Sanctuary is a biodiverse natural habitat. The anthropogenic impact has been mitigated via a freehold purchase that protects it from commercial timber exploitation and hunting.
                                    </p>
                                </div>
                            </div>

                            {/* Center Image */}
                            <div className={styles.centerImageWrapper}>
                                <img src={oceanSec3Center} alt="Ocean Sanctuary Center" className={styles.centerImage} />
                            </div>

                            {/* UN SDG Section */}
                            <div className={styles.section3Middle}>
                                <p className={styles.section3TextSmall}>
                                    Being a mature natural habitat with multiple sub-habitats in a UNESCO Biosphere Reserve, the natural regeneration approach is being adopted.
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
                            {/* Heading - Centered Above */}
                            <div className={styles.gridItem}>
                                <h2 className={styles.gridHeading}>
                                    <span className={styles.gridHeadingBold}>Zone 01</span> - Rocky Lakeshore (Haley Lake)
                                </h2>
                            </div>

                            {/* Top Left - Images with Text */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridLeftImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={oceanGridLeft1} alt="Pine Tree" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>PINE TREE</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={oceanGridLeft2} alt="Blueberry" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>BLUEBERRY</div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Right - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextRight}>
                                    The main species in the canopy are Balsam Fir and Red Maple as well as some scattered old White Pine trees. Due to the short lifespan of the Balsam Fir, there are lots of dead and fallen trees that offer a habitat for an abundance of insects and fungi. This Zone is located right on the shore of Haley Lake and winds have further opened up the canopy. Many red maple and white pine trees offer with their cavities, seams and broken branches nesting opportunities for multiple species of birds. The multi-storied canopy is well structured and in the open areas lots of regeneration (fir, spruce, pine, some larch) has been established. Aside from the different types of shrubs and herbs (e.g. blueberry, huckleberry, lambkill etc.) many different types of moss and lichen have been found. What makes this zone special is the high abundance of old man's beard lichen.
                                </p>
                            </div>

                            {/* Year Tabs and Carousel Grouped for 25px gap */}
                            <div className={styles.gridItem} style={{ gap: '30px' }}>
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

                                <div className={styles.carouselWrapper}>
                                    {canGoPrev(1) && (
                                        <button className={styles.carouselArrow} onClick={() => prevCarousel(1)}>
                                        <img src={sec5CarouselLeftArrow} alt="Previous" />
                                    </button>
                                    )}
                                    {!canGoPrev(1) && <div className={styles.carouselArrowPlaceholder} />}

                                    <div className={styles.carouselContainer} ref={el => { carouselContainerRefs.current[1] = el }}>
                                        <div
                                            ref={el => { carouselTrackRefs.current[1] = el }}
                                            className={styles.carouselTrack}
                                            style={{
                                                '--slide-offset': getSlideOffset(1)
                                            } as React.CSSProperties}
                                        >
                                            {zone1Cards.length > 0 ? (
                                                zone1Cards.map((card, index) => (
                                                <div key={index} className={styles.carouselCard}>
                                                    <img
                                                        src={card.image}
                                                        alt={card.text}
                                                        className={styles.carouselCardImage}
                                                        onClick={() => setSelectedImage({ src: card.image, title: card.text })}
                                                        style={{ cursor: 'pointer' }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.style.display = 'none'
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

                                    {canGoNext(1) && (
                                        <button className={styles.carouselArrow} onClick={() => nextCarousel(1)}>
                                        <img src={sec5CarouselRightArrow} alt="Next" />
                                    </button>
                                    )}
                                    {!canGoNext(1) && <div className={styles.carouselArrowPlaceholder} />}
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Zone 02 - Rich Hardwood Upland */}
                <FadeInSection>
                    <section className={styles.section4} style={{ backgroundColor: '#DAF6EC' }}>
                        <div className={styles.section4Container}>
                            {/* Heading - Centered Above */}
                            <div className={styles.gridItem}>
                                <h2 className={styles.gridHeading}>
                                    <span className={styles.gridHeadingBold}>Zone 02</span> - Rich Hardwood Upland
                                </h2>
                            </div>

                            {/* Top Left - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextRight}>
                                    This zone covers the entire hill and slope section of the area, which is most likely of glacial deposition. Although the soil is on the poorer end, hardwood trees like red oak, white birch and red maple dominate. The Red oak tree offers valuable support for wildlife species including small mammals, bear, ruffed grouse and deer. Red maple regenerates quickly as coppice and is a favored browse by deer and moose. Mature red maple flowers provide one of the most important early and abundant pollen and nectar sources for a wide range of insects. Oak is the preferred host of maitake mushroom. Ericaceous shrubs, as well as mayflower, teaberry, round leaf pyrola, bracken fern, pink lady's slipper and princes'-pine are abundant in the area.
                                </p>
                            </div>

                            {/* Top Right - Images with Text */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridRightImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={mooseIcon} alt="Moose" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>MOOSE</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={mayflowerIcon} alt="Mayflower" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>MAYFLOWER</div>
                                    </div>
                                </div>
                            </div>

                            {/* Year Tabs and Carousel Grouped for 25px gap */}
                            <div className={styles.gridItem} style={{ gap: '30px' }}>
                                <div className={styles.yearTabs}>
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            className={`${styles.yearTab} ${activeYearZone2 === year ? styles.yearTabActive : ''}`}
                                            onClick={() => setActiveYearZone2(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                <div className={styles.carouselWrapper}>
                                    {canGoPrev(2) && (
                                        <button className={styles.carouselArrow} onClick={() => prevCarousel(2)}>
                                        <img src={sec5CarouselLeftArrow} alt="Previous" />
                                    </button>
                                    )}
                                    {!canGoPrev(2) && <div className={styles.carouselArrowPlaceholder} />}

                                    <div className={styles.carouselContainer} ref={el => { carouselContainerRefs.current[2] = el }}>
                                        <div
                                            ref={el => { carouselTrackRefs.current[2] = el }}
                                            className={styles.carouselTrack}
                                            style={{
                                                '--slide-offset': getSlideOffset(2)
                                            } as React.CSSProperties}
                                        >
                                            {zone2Cards.length > 0 ? (
                                                zone2Cards.map((card, index) => (
                                                <div key={index} className={`${styles.carouselCard} ${styles.carouselCardWhite}`}>
                                                    <img
                                                        src={card.image}
                                                        alt={card.text}
                                                        className={styles.carouselCardImage}
                                                        onClick={() => setSelectedImage({ src: card.image, title: card.text })}
                                                        style={{ cursor: 'pointer' }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.style.display = 'none'
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

                                    {canGoNext(2) && (
                                        <button className={styles.carouselArrow} onClick={() => nextCarousel(2)}>
                                        <img src={sec5CarouselRightArrow} alt="Next" />
                                    </button>
                                    )}
                                    {!canGoNext(2) && <div className={styles.carouselArrowPlaceholder} />}
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Zone 03 - Shrub-Dominated Open Forest */}
                <FadeInSection>
                    <section className={styles.section4}>
                        <div className={styles.section4Container}>
                            {/* Heading - Centered Above */}
                            <div className={styles.gridItem}>
                                <h2 className={styles.gridHeading}>
                                    <span className={styles.gridHeadingBold}>Zone 03</span> - Shrub-Dominated Open Forest
                                </h2>
                            </div>

                            {/* Top Left - Images with Text */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridLeftImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={blackSpruceIcon} alt="Black Spruce" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>BLACK SPRUCE</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={mushroomIcon} alt="Mushroom" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>MUSHROOM</div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Right - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextRight}>
                                    This woodland is at the bottom of the slope and is characterized by scattered black spruce, white and red pine, exposed bedrock, stony and shallow soils and prominent reindeer lichen. The Black spruce / Lambkill / Reindeer lichen ecosystem  is unique to the east coast and is relatively rare in Nova Scotia.
                                </p>
                            </div>

                            {/* Year Tabs and Carousel Grouped for 25px gap */}
                            <div className={styles.gridItem} style={{ gap: '30px' }}>
                                <div className={styles.yearTabs}>
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            className={`${styles.yearTab} ${activeYearZone3 === year ? styles.yearTabActive : ''}`}
                                            onClick={() => setActiveYearZone3(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                <div className={styles.carouselWrapper}>
                                    {canGoPrev(3) && (
                                        <button className={styles.carouselArrow} onClick={() => prevCarousel(3)}>
                                        <img src={sec5CarouselLeftArrow} alt="Previous" />
                                    </button>
                                    )}
                                    {!canGoPrev(3) && <div className={styles.carouselArrowPlaceholder} />}

                                    <div className={styles.carouselContainer} ref={el => { carouselContainerRefs.current[3] = el }}>
                                        <div
                                            ref={el => { carouselTrackRefs.current[3] = el }}
                                            className={styles.carouselTrack}
                                            style={{
                                                '--slide-offset': getSlideOffset(3)
                                            } as React.CSSProperties}
                                        >
                                            {zone3Cards.length > 0 ? (
                                                zone3Cards.map((card, index) => (
                                                <div key={index} className={styles.carouselCard}>
                                                    <img
                                                        src={card.image}
                                                        alt={card.text}
                                                        className={styles.carouselCardImage}
                                                        onClick={() => setSelectedImage({ src: card.image, title: card.text })}
                                                        style={{ cursor: 'pointer' }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.style.display = 'none'
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

                                    {canGoNext(3) && (
                                        <button className={styles.carouselArrow} onClick={() => nextCarousel(3)}>
                                        <img src={sec5CarouselRightArrow} alt="Next" />
                                    </button>
                                    )}
                                    {!canGoNext(3) && <div className={styles.carouselArrowPlaceholder} />}
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Zone 04 - Stillwater, Brook, and Riparian Area */}
                <FadeInSection>
                    <section className={styles.section4} style={{ backgroundColor: '#DAF6EC' }}>
                        <div className={styles.section4Container}>
                            {/* Heading - Centered Above */}
                            <div className={styles.gridItem}>
                                <h2 className={styles.gridHeading}>
                                    <span className={styles.gridHeadingBold}>Zone 04</span> - Stillwater, Brook, and Riparian Area
                                </h2>
                            </div>

                            {/* Top Left - Text (Swapped) */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextRight}>
                                    This zone covers several micro ecosystems that are all influenced by one common feature: water. Due to the topography, a swamp/ wetland has formed in the western side of this area that drains via a brook eastwards. The swamp is surrounded by several different vegetation types flourishing with the abundance of fresh water supply. These types of forests make important contributions to landscape diversity, carbon and water budgets. This area provides habitat for numerous plants, lichens, invertebrates and vertebrates (including moose, spruce grouse, rusty blackbird, swamp and Lincoln's sparrows, wood turtle and several amphibians).
                                </p>
                            </div>

                            {/* Top Right - Images with Text (Swapped) */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridLeftImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={mooseIcon} alt="Moose" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>MOOSE</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={turtleIcon} alt="Wood Turtle" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>WOODTURTLE</div>
                                    </div>
                                </div>
                            </div>

                            {/* Year Tabs and Carousel Grouped for 25px gap */}
                            <div className={styles.gridItem} style={{ gap: '30px' }}>
                                <div className={styles.yearTabs}>
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            className={`${styles.yearTab} ${activeYearZone4 === year ? styles.yearTabActive : ''}`}
                                            onClick={() => setActiveYearZone4(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                <div className={styles.carouselWrapper}>
                                    {canGoPrev(4) && (
                                        <button className={styles.carouselArrow} onClick={() => prevCarousel(4)}>
                                        <img src={sec5CarouselLeftArrow} alt="Previous" />
                                    </button>
                                    )}
                                    {!canGoPrev(4) && <div className={styles.carouselArrowPlaceholder} />}

                                    <div className={styles.carouselContainer} ref={el => { carouselContainerRefs.current[4] = el }}>
                                        <div
                                            ref={el => { carouselTrackRefs.current[4] = el }}
                                            className={styles.carouselTrack}
                                            style={{
                                                '--slide-offset': getSlideOffset(4)
                                            } as React.CSSProperties}
                                        >
                                            {zone4Cards.length > 0 ? (
                                                zone4Cards.map((card, index) => (
                                                <div key={index} className={`${styles.carouselCard} ${styles.carouselCardWhite}`}>
                                                    <img
                                                        src={card.image}
                                                        alt={card.text}
                                                        className={styles.carouselCardImage}
                                                        onClick={() => setSelectedImage({ src: card.image, title: card.text })}
                                                        style={{ cursor: 'pointer' }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.style.display = 'none'
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

                                    {canGoNext(4) && (
                                        <button className={styles.carouselArrow} onClick={() => nextCarousel(4)}>
                                        <img src={sec5CarouselRightArrow} alt="Next" />
                                    </button>
                                    )}
                                    {!canGoNext(4) && <div className={styles.carouselArrowPlaceholder} />}
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Zone 05 - Shoreline and Intertidal Zone */}
                <FadeInSection>
                    <section className={styles.section4}>
                        <div className={styles.section4Container}>
                            {/* Heading - Centered Above */}
                            <div className={styles.gridItem}>
                                <h2 className={styles.gridHeading}>
                                    <span className={styles.gridHeadingBold}>Zone 05</span> - Shoreline and Intertidal Zone
                                </h2>
                            </div>

                            {/* Top Left - Images with Text */}
                            <div className={styles.gridItem}>
                                <div className={styles.gridLeftImages}>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={eelgrassIcon} alt="Eelgrass" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>EELGRASS</div>
                                    </div>
                                    <div className={styles.gridImageWrapper}>
                                        <img src={whelksIcon} alt="Whelks" className={styles.gridImage} />
                                        <div className={styles.gridLabel}>WHELKS</div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Right - Text */}
                            <div className={styles.gridItem}>
                                <p className={styles.gridTextRight}>
                                    This rocky shore is home to a great diversity of plants and animals. The plants that are most common on the rocky shore are the macroscopic (visible with the eye) algae or seaweed. These are classified according to their colour - brown, green, or red - and the specific locations in which they are found. Vascular plants such as Seaside-Plantain are found at the sea/ land interface. One such plant, Eelgrass, may be found inter-tidally in tide pools if the pools have accumulated enough sediments for the plants to take root. Other plants of the rocky shore are the attached micro-algae. The most common animals include snails like the periwinkles, whelks, nudibranchs (naked molluscs), limpets, and chitons.
                                </p>
                            </div>

                            {/* Year Tabs and Carousel Grouped for 25px gap */}
                            <div className={styles.gridItem} style={{ gap: '30px' }}>
                                <div className={styles.yearTabs}>
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            className={`${styles.yearTab} ${activeYearZone5 === year ? styles.yearTabActive : ''}`}
                                            onClick={() => setActiveYearZone5(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                <div className={styles.carouselWrapper}>
                                    {canGoPrev(5) && (
                                        <button className={styles.carouselArrow} onClick={() => prevCarousel(5)}>
                                        <img src={sec5CarouselLeftArrow} alt="Previous" />
                                    </button>
                                    )}
                                    {!canGoPrev(5) && <div className={styles.carouselArrowPlaceholder} />}

                                    <div className={styles.carouselContainer} ref={el => { carouselContainerRefs.current[5] = el }}>
                                        <div
                                            ref={el => { carouselTrackRefs.current[5] = el }}
                                            className={styles.carouselTrack}
                                            style={{
                                                '--slide-offset': getSlideOffset(5)
                                            } as React.CSSProperties}
                                        >
                                            {zone5Cards.length > 0 ? (
                                                zone5Cards.map((card, index) => (
                                                <div key={index} className={styles.carouselCard}>
                                                    <img
                                                        src={card.image}
                                                        alt={card.text}
                                                        className={styles.carouselCardImage}
                                                        onClick={() => setSelectedImage({ src: card.image, title: card.text })}
                                                        style={{ cursor: 'pointer' }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.style.display = 'none'
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

                                    {canGoNext(5) && (
                                        <button className={styles.carouselArrow} onClick={() => nextCarousel(5)}>
                                        <img src={sec5CarouselRightArrow} alt="Next" />
                                    </button>
                                    )}
                                    {!canGoNext(5) && <div className={styles.carouselArrowPlaceholder} />}
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInSection>

                {/* Ecological Importance of the area */}
                <FadeInSection>
                    <section className={styles.ecologicalSection} style={{ backgroundColor: '#DAF6EC' }}>
                        <div className={styles.ecologicalContainer}>
                            {/* Icons Row */}
                            <div className={styles.ecologicalIconsRow}>
                                <img src={ecologicalIcon} alt="Ecological Icons" className={styles.ecologicalIconImage} />
                            </div>

                            {/* Main Heading */}
                            <h2 className={styles.ecologicalHeading}>Ecological Importance of the area</h2>

                            {/* Text Content */}
                            <div className={styles.ecologicalTextContent}>
                                <p className={styles.ecologicalText}>
                                    Ocean Sanctuary is Sacred Groves' contribution to the Southwestern region of Nova Scotia that was designated as a UNESCO Biosphere Reserve in 2001. It is one of only 18 ecosystems in Canada with this special designation.
                                </p>
                                <p className={styles.ecologicalText}>
                                    The broad category of forests in Ocean Sanctuary is Acadian Group of Forests existing at different stages of succession. Zone 1 has mid to late successional softwood Vegetation Types, Zone 2 has early to mid successional hardwood Vegetation Types, and zone 3 has mainly edaphic climax associations with less than 30% tree coverage. Zones 4 and 5 are wetland and intertidal habitats respectively.
                                </p>
                                <p className={styles.ecologicalText}>
                                    In the habitat, the occurance of Balsam Fir species is of special significance as it is reported to support boreal felt lichen, listed as endangered under the Nova Scotia Endangered Species Act and also under the Species at Risk Act (SARA).
                                </p>
                                <p className={styles.ecologicalText}>
                                    The habitat neighbours two Migratory Bird Sanctuaries The Port L'Hebert MBS and the Haley Lake. Port L'Hebert Migratory Bird Sanctuary is located in a shallow coastal inlet on the southeast shore of Nova Scotia. Two other Migratory Bird Sanctuaries, Port Joli and Sable River, are situated near Port L'Hebert and, together, these three sanctuaries support over 4,000 to 5,000 Canada geese each year. Along with these nearby protected areas, the Port L'Hebert Sanctuary supports over 40% of the wintering Canada geese in the Atlantic Provinces. Geese tend to arrive in the Port L'Hebert sanctuary in late September and remain until mid-March, with peak numbers occurring in late October to early November. Occasionally, during particularly cold winters, the waters in the sanctuary's inlet freeze, causing the waterfowl using it to move to the nearby Sable River sanctuary.
                                </p>
                                <p className={styles.ecologicalText}>
                                    The Port L'Hebert Migratory Bird Sanctuary is also an important resting, feeding and wintering area for American black ducks. Migrating birds of this species begin to gather in the sanctuary as early as late August with numbers exceeding 1,000 birds in late January to early February. Significant numbers of these migrants remain until early April. Other dabbling ducks (ducks that feed near the surface of the water) that can be found in the sanctuary, though in smaller numbers, include green-winged teal and northern pintail, which use the sanctuary during early fall. Diving ducks (ducks that dive below the surface of the water to feed) can also be seen in the sanctuary including common goldeneye, bufflehead, scaups, scoters and mergansers. These birds arrive in late fall and several hundred tend to remain throughout the winter.
                                </p>
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
                                    <source src={osVideo} type="video/quicktime" />
                                    <source src={osVideo} type="video/mp4" />
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
