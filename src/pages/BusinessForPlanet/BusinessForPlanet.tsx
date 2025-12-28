import { useState, useEffect } from 'react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SEO } from '@/components/common/SEO'
import { PAGE_SEO, BREADCRUMBS } from '@/constants'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections/CommonSections'
import styles from './BusinessForPlanet.module.css'

import Whatisgoodfornaturecanbegoodforyourbusiess from '@/assets/Whatisgoodfornaturecanbegoodforyourbusiess.png'
import plantbox from '@/assets/plantbox.gif'
import dron from '@/assets/dron.svg'
import fly from '@/assets/fly.svg'

import bussionconnection from '@/assets/bussionconnection.svg'
import tree from '@/assets/tree.svg'
// import dotdotbox from '@/assets/dotdotbox.svg'
import plant from '@/assets/plant.svg'
import Prosperity from '@/assets/Prosperity.svg'
import purpose from '@/assets/purpose.svg'
import dotdotbox_1 from '@/assets/dotdotbox_1.svg'



// Carousel images for Partnership for the Planet
import pftp_corousel_1 from '@/assets/pftp_corousel_1.svg'
import pftp_corousel_2 from '@/assets/pftp_corousel_2.svg'
import pftp_corousel_3 from '@/assets/pftp_corousel_3.svg'
import pftp_corousel_4 from '@/assets/pftp_corousel_4.svg'
import pftp_corousel_5 from '@/assets/pftp_corousel_5.svg'
import pftp_corousel_6 from '@/assets/pftp_corousel_6.svg'

// Images for myEarth Point tab
import myEarthPointBg from '@/assets/my_earth_point_bg.svg'
import myEarthPointImage from '@/assets/my_earth_point_image.svg'
import myEarthPointRightIcon from '@/assets/my_earth_point_right_icon.svg'

// Images for Junk to Jungles tab
import junkToJungleImage from '@/assets/Junk_to_jungle.svg'
import junkToJungleRightIcon from '@/assets/junk_to_jungle_right_icon.svg'

// Images for Seeds of Recognition tab
import seedsOfRecognitionIcon from '@/assets/left_speed_icon.svg'

// Images for Brand a Habitat tab
import brandAHabitatImage from '@/assets/brand_a_habitate.svg'
import brandAHabitatIcon from '@/assets/BrandaHabitatlogo.svg'

// 4 section 
import growyourbussion from '@/assets/growyourbussion.svg'

// 5 section 
import Sacreddeedsmust from '@/assets/Sacreddeedsmust.svg'
import bracit1 from '@/assets/bracit1.png'
import bracit2 from '@/assets/bracit2.png'
import Businessesreimagined_1 from '@/assets/Businessesreimagined_1.svg'
import Businessesreimagined_2 from '@/assets/Businessesreimagined_2.svg'
import Businessesreimagined_3 from '@/assets/Businessesreimagined_3.svg'
import Businessesreimagined_4 from '@/assets/Businessesreimagined_4.svg'
import Businessesreimagined_5 from '@/assets/Businessesreimagined_5.svg'
import Businessesreimagined_6 from '@/assets/Businessesreimagined_6.svg'
import Businessesreimagined_7 from '@/assets/Businessesreimagined_7.svg'
import Businessesreimagined_8 from '@/assets/Businessesreimagined_8.svg'
import Businessesreimagined_9 from '@/assets/Businessesreimagined_9.svg'
import Businessesreimagined_10 from '@/assets/Businessesreimagined_10.svg'
import Businessesreimagined_11 from '@/assets/Businessesreimagined_11.svg'
import arrow from '@/assets/arrow.svg'
import letsExploreArrow from '@/assets/lets_explore_arrow.svg'
// 6 section 

// 7 section 
import TheSacredGrovesisa from '@/assets/TheSacredGrovesisa.svg'
import earth from '@/assets/earth.png'

// Images for Recognized Globally section
import Alexandrelogo from '@/assets/Alexandrelogo_2.svg'
import CGC_1 from '@/assets/CGC_1.svg'
import CGC_2 from '@/assets/CGC_2.svg'
import CGC_3 from '@/assets/CGC_3.svg'
import canneslions from '@/assets/canneslions.svg'
import cop_28 from '@/assets/cop_28.svg'
import village_capital from '@/assets/village_capital.svg'
import rightarrow from '@/assets/right_arrow.svg'
import leftarrow from '@/assets/left_arrow.svg'

interface RecognitionCard {
  id: number
  logo: string
  description: string
  url: string
  logoAlignment: 'left' | 'center' | 'right'
}

export const BusinessForPlanet: React.FC = () => {
  const location = useLocation()

  // Recognition cards data
  const recognitionCards: RecognitionCard[] = [
    {
      id: 1,
      logo: CGC_1,
      description: 'Gigrin Prysg and Coed Rhyal have been recognised by the Welsh Government for their rare temperate rainforests and vital role in local ecosystems.',
      url: 'https://www.gov.wales/visit-national-forest-wales',
      logoAlignment: 'left'
    },
    {
      id: 2,
      logo: CGC_2,
      description: 'Featured in PwC\'s Net Zero Future50 – Middle East report.',
      url: 'https://www.pwc.com/m1/en/esg/images/future50/docs/PwC-Net-Zero-Future50-Middle-East-Report.pdf',
      logoAlignment: 'center'
    },
    {
      id: 3,
      logo: CGC_3,
      description: 'Part of the Microsoft Entrepreneurship for Positive Impact Accelerator.',
      url: 'https://www.microsoft.com/socialentrepreneurship/portfolio.aspx',
      logoAlignment: 'right'
    },
    {
      id: 4,
      logo: canneslions,
      description: 'Honoured by the International Advertising Association at the Cannes Lions Festival of Creativity 2023.',
      url: 'https://www.linkedin.com/feed/update/urn:li:activity:7080102554205921280/',
      logoAlignment: 'left'
    },
    {
      id: 5,
      logo: cop_28,
      description: 'Invited to the Business and Philanthropy Climate Forum at COP28 UAE.',
      url: 'https://bpcforum.org/about/',
      logoAlignment: 'center'
    },
    {
      id: 6,
      logo: village_capital,
      description: 'Selected for "Greentech Europe 2022 Emerging Futures Cohort".',
      url: 'https://vilcap.com/programs/greentech-europe-2022',
      logoAlignment: 'right'
    }
  ]
  const [activeTab, setActiveTab] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const [currentCardPage, setCurrentCardPage] = useState(0)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get visible cards based on current page (3 cards per page on desktop, 1 on mobile)
  const getVisibleCards = () => {
    if (isMobile) {
      // On mobile, show only the current card
      return [recognitionCards[currentCardIndex]]
    } else {
      // On desktop, show 3 cards per page
      const startIndex = currentCardPage * 3
      return recognitionCards.slice(startIndex, startIndex + 3)
    }
  }

  const nextCardPage = () => {
    if (isMobile) {
      // On mobile, move to next card (one at a time)
      if (currentCardIndex < recognitionCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
      }
    } else {
      // On desktop, move to next page (3 cards at a time)
      if (currentCardPage < 1) {
        setCurrentCardPage(currentCardPage + 1)
      }
    }
  }

  const prevCardPage = () => {
    if (isMobile) {
      // On mobile, move to previous card (one at a time)
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1)
      }
    } else {
      // On desktop, move to previous page (3 cards at a time)
      if (currentCardPage > 0) {
        setCurrentCardPage(currentCardPage - 1)
      }
    }
  }


  const carouselImages = [
    pftp_corousel_1,
    pftp_corousel_2,
    pftp_corousel_3,
    pftp_corousel_4,
    pftp_corousel_5,
    pftp_corousel_6
  ]

  const tabs = [
    { text: 'Partnership for the Planet', line1: 'Partnership for the', line2: 'Planet' },
    { text: 'MyEarth Point', line1: 'myEarth', line2: 'Point' },
    { text: 'Junk to Jungles', line1: 'Junk to', line2: 'Jungles' },
    { text: 'Seeds of Recognition', line1: 'Seeds of', line2: 'Recognition' },
    { text: 'Brand a Habitat', line1: 'Brand a', line2: 'Habitat' }
  ]

  // Handle hash navigation to select appropriate tab
  useEffect(() => {
    if (location.hash === '#seeds-of-recognition') {
      setActiveTab(3)
      // Scroll to section 3 after a small delay to ensure it's rendered
      setTimeout(() => {
        const element = document.getElementById('section-3')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else if (location.hash === '#brand-a-habitat') {
      setActiveTab(4)
      // Scroll to section 3 after a small delay to ensure it's rendered
      setTimeout(() => {
        const element = document.getElementById('section-3')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [location.hash])

  // Auto-moving carousel effect
  React.useEffect(() => {
    if (activeTab === 0) {
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % carouselImages.length)
      }, 3000) // Change image every 3 seconds
      return () => clearInterval(interval)
    }
  }, [activeTab, carouselImages.length])

  return (
    <>
      <SEO
        title={PAGE_SEO.businessForPlanet.title}
        description={PAGE_SEO.businessForPlanet.description}
        keywords={PAGE_SEO.businessForPlanet.keywords}
        ogImage={PAGE_SEO.businessForPlanet.ogImage}
        breadcrumbs={BREADCRUMBS.businessForPlanet}
        includeOrganization={true}
      />

      <div className={styles.heroSection}>
        <img src={Whatisgoodfornaturecanbegoodforyourbusiess} className={styles.bgImg} alt="Business for the Planet background" />

        <div className={styles.textBlock}>
          <h2>
            What is<br />
            <span>good for nature</span><br />
            can be<br />
            <span>good for your <br/> business</span>
          </h2>
        </div>

        <div className={styles.dronLogo}>
          <img src={dron} alt="Drone icon" />
        </div>
        <div className={styles.flyLogo}>
          <img src={fly} alt="Plant icon" />
        </div>

        <img src={plantbox} className={styles.ringBox} alt="Ring box" />
      </div>

      <div className={styles.section2}>
        {/* First Half */}
        <div className={styles.sec2FirstHalf}>
          <div className={styles.sec2FirstLeft}>
            <div className={styles.sec2IconsContainer}>
              <div className={styles.sec2TopIcon}>
                <img src={bussionconnection} alt="Connection icon" />
              </div>
              <div className={styles.sec2CenterIcon}>
                <img src={tree} alt="Tree icon" />
              </div>
            </div>
            <p className={styles.sec2SmallTitle}>
              Creating<br />
              new<br />
              economic<br />
              models for
            </p>
            <div className={styles.sec2MainHeading}>
              <span>People</span>
              <img src={plant} className={styles.dotBox} alt="Icon" />
              <span>Planet</span>
              <img src={Prosperity} className={styles.dotBox} alt="Icon" />
              <span>Prosperity</span>
              <img src={purpose} className={styles.dotBox} alt="Icon" />
              <span>Purpose</span>
            </div>
          </div>
          <div className={styles.sec2FirstRight}>
            <img src={dotdotbox_1} className={styles.sec2FirstImage} alt="Grid pattern" />
          </div>
        </div>

        {/* Second Half */}
        <div className={styles.sec2SecondHalf}>
          <div className={styles.sec2SecondLeft}>
            <img src={dotdotbox_1} className={styles.sec2SecondImage} alt="Grid pattern" />
          </div>
          <div className={styles.sec2SecondRight}>
            <p className={styles.sec2Para}>
              Reimagine your business with nature at its core. When you align your business growth with the planet's wellbeing, you create new value, discover new revenue streams, build deeper trust, and enter new markets.<br /><br />

              Together, we can design business models, products, and ideas that drive growth and protect habitats. Here, creativity is currency, and nature is our ultimate shareholder.<br /><br />

              This isn't philanthropy. This isn't CSR. It's a new form of ownership—one that rewards people, businesses, and the planet for generations to come.
            </p>
          </div>
        </div>
      </div>

      <section id="section-3" className={styles.section3}>
        <div className={`${styles.section3Container} ${activeTab === 3 ? styles.seedsTabActive : ''}`}>
          <div className={styles.tabHeader}>
            {tabs.map((item, index) => (
              <button
                key={index}
                className={`${styles.tabBtn} ${activeTab === index ? styles.activeTab : ''}`}
                onClick={() => {
                  setActiveTab(index)
                  setSlideIndex(0)
                }}
              >
                <span className={styles.tabLine1}>{item.line1}</span>
                <span className={styles.tabLine2}>{item.line2}</span>
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className={styles.section3Content}>
              <div className={styles.sliderBox}>
                <div className={styles.sliderTrack}>
                  {carouselImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className={styles.sliderImg}
                      alt={`Carousel ${i + 1}`}
                      style={{
                        opacity: i === slideIndex ? 1 : 0,
                        zIndex: i === slideIndex ? 1 : 0
                      }}
                    />
                  ))}
                </div>

                <div className={styles.sliderDots}>
                  {carouselImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`${styles.dot} ${slideIndex === idx ? styles.activeDot : ''}`}
                      onClick={() => setSlideIndex(idx)}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.textRight}>
                <h3 className={styles.headingRight}>
                  <span className={styles.headingBold}>Imagine</span><br />the possibilities
                </h3>

                <ul className={styles.rightList}>
                  <li>BEAUTY & LIFESTYLE</li>
                  <li>FINANCE</li>
                  <li>FOOD & BEVERAGE</li>
                  <li>HEALTH & WELLNESS</li>
                  <li>HOSPITALITY</li>
                  <li>REAL ESTATE</li>
                  <li>RETAIL</li>
                  <li>SPORTS</li>
                  <li>TRAVEL & TOURISM</li>
                </ul>

                <Link to="/partnership-for-the-planet" className={styles.exploreBtn}>
                  LET'S EXPLORE <img src={letsExploreArrow} alt="Arrow" className={styles.exploreArrow} />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className={styles.section3ContentMyEarth}>
              <div className={styles.myEarthLeft}>
                <div className={styles.myEarthBgContainer}>
                  <img src={myEarthPointBg} className={styles.myEarthBg} alt="Background" />
                  <img src={myEarthPointImage} className={styles.myEarthImageSpecific} alt="Receipt" />
                </div>
              </div>

              <div className={styles.myEarthRight}>
                <img src={myEarthPointRightIcon} className={styles.myEarthIcon} alt="Icons" />
                <h3 className={styles.myEarthHeading}>
                  What if everyday consumer choices could reward people, business, and planet?
                </h3>
                <p className={styles.myEarthText}>
                  Then every purchase, every transaction, becomes a force for conservation, building forests, restoring wetlands, safeguarding species, for as little as £0.03 per myEarth Point.
                </p>
                <Link to="/my-earth-point" className={styles.exploreBtn}>
                  LET'S EXPLORE <img src={letsExploreArrow} alt="Arrow" className={styles.exploreArrow} />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className={styles.section3ContentMyEarth}>
              <div className={styles.myEarthLeft}>
                <div className={styles.myEarthBgContainer}>
                  <img src={myEarthPointBg} className={styles.myEarthBg} alt="Background" />
                  <img src={junkToJungleImage} className={styles.myEarthImageSpecific} alt="Junk to Jungles" />
                </div>
              </div>

              <div className={styles.myEarthRight}>
                <img src={junkToJungleRightIcon} className={styles.myEarthIcon} alt="Icons" />
                <h3 className={styles.myEarthHeading}>
                  What if your waste could become your smartest investment?
                </h3>
                <p className={styles.myEarthText}>
                  A truly circular system for our planet and prosperity.
                </p>
                <Link to="/junk-to-jungles" className={styles.exploreBtn}>
                  LET'S EXPLORE <img src={letsExploreArrow} alt="Arrow" className={styles.exploreArrow} />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className={styles.seedsContent}>
              <div className={styles.seedsLeft}>
                <img src={seedsOfRecognitionIcon} className={styles.seedsIcon} alt="Seeds of Recognition Icons" />
                <h3 className={styles.seedsHeading}>Seeds of Recognition</h3>
                <p className={styles.seedsText}>
                  With Sacred Groves Clusters, you can recognise employees, clients, and partners with planet-positive incentives. Mark achievements and milestones with real ecological impact. Gift something lasting - a living piece of the planet, protected in their name.
                </p>
                <a href="mailto:connect@sacredgroves.earth" className={styles.contactBtn}>
                  CONTACT US <img src={letsExploreArrow} alt="Arrow" className={styles.exploreArrow} />
                </a>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className={styles.section3ContentBrand}>
              <div className={styles.myEarthLeft}>
                <div className={styles.myEarthBgContainer}>
                  <img src={myEarthPointBg} className={styles.myEarthBg} alt="Background" />
                  <img src={brandAHabitatImage} className={styles.brandImageSpecific} alt="Brand a Habitat" />
                </div>
              </div>

              <div className={styles.myEarthRight}>
                <img src={brandAHabitatIcon} className={styles.myEarthIcon} alt="Brand a Habitat Icon" />
                <h3 className={styles.myEarthHeading}>
                  Imagine a forest in your brand's name.
                </h3>
                <p className={styles.myEarthText}>
                  A living legacy that inspires loyalty, builds trust, and creates lasting impact. Protecting real habitats. Real rivers. Real lives.
                </p>
                <a href="mailto:connect@sacredgroves.earth" className={styles.contactBtn}>
                  CONTACT US <img src={letsExploreArrow} alt="Arrow" className={styles.exploreArrow} />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* 4 section */}
      <section className={styles.section4}>
        <div className={styles.section4Container}>
          <div className={styles.sec4Left}>
            <h2 className={styles.sec4Heading}>
              Tangible Gains for your Business<br />
              <span>Grow your business in partnership with nature.</span>
            </h2>

            <img src={growyourbussion} className={styles.sec4Image} alt="Business growth graph" />
          </div>

          <div className={styles.sec4Right}>
            <ul className={styles.sec4List}>
              <li>New Customers & Markets</li>
              <li>Engagement & Retention</li>
              <li>Gamified Experiences</li>
              <li>Brand Value & Differentiation</li>
              <li>Scalable Climate Action</li>
              <li>Verified Impact</li>
              <li>ESG Goals</li>
              <li>Positive Media Coverage</li>
              <li>Advocacy</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5 section */}

      <section className={styles.section5}>
        <div className={styles.section5Container}>
          <img src={Sacreddeedsmust} className={styles.sec5Logo} alt="Sacred Groves" />

          <h2 className={styles.sec5Heading}>
            Businesses we've reimagined with nature
          </h2>

          <div className={styles.sec5BraceWrapper}>
            <img src={bracit1} className={styles.sec5BraceLeft} alt="Left brace" />
            <div className={styles.sec5Grid}>
              <div className={styles.sec5Row}>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_1} alt="Business 1" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_2} alt="Business 2" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_3} alt="Business 3" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_4} alt="Business 4" />
                </div>
              </div>
              <div className={styles.sec5Row}>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_5} alt="Business 5" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_6} alt="Business 6" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_7} alt="Business 7" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_8} alt="Business 8" />
                </div>
              </div>
              <div className={styles.sec5Row}>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_9} alt="Business 9" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_10} alt="Business 10" />
                </div>
                <div className={styles.sec5Card}>
                  <img src={Businessesreimagined_11} alt="Business 11" />
                </div>
              </div>
            </div>
            <img src={bracit2} className={styles.sec5BraceRight} alt="Right brace" />
          </div>

          <Link to="/partnership-for-the-planet" className={styles.sec5Button}>
            CO CREATE WITH US <img src={arrow} alt="Arrow" />
          </Link>
        </div>

      </section>

      {/* Our impact is being recognised globally section */}
      <section className={styles.recognizedSection}>
        <div className={styles.recognizedContainer}>
          <div className={styles.recognizedContent}>
            <div className={styles.recognizedTopDecoration}>
              <img src={Alexandrelogo} alt="Alexandrelogo" className={styles.recognizedTreeIcon} />
            </div>

            <h1 className={styles.recognizedHeading}>Our impact is being recognised globally.</h1>

            <div className={styles.recognizedCards}>
              {getVisibleCards().map((card) => (
                <a
                  key={card.id}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.recognizedCard}
                >
                  <div className={styles.recognizedCardHeader}>
                    <div className={`${styles.recognizedLogoContainer} ${card.logoAlignment === 'left' ? styles.recognizedLogoContainerLeft : card.logoAlignment === 'right' ? styles.recognizedLogoContainerRight : ''}`}>
                      <img src={card.logo} alt="Recognition Logo" className={styles.recognizedMainLogo} />
                    </div>
                  </div>
                  <p className={styles.recognizedCardDescription}>
                    {card.description}
                  </p>
                </a>
              ))}
            </div>

            {/* Carousel Navigation */}
            <div className={styles.recognizedCarouselNavigation}>
              <button
                className={styles.recognizedPrevButton}
                onClick={prevCardPage}
                style={{
                  visibility: isMobile
                    ? (currentCardIndex === 0 ? 'hidden' : 'visible')
                    : (currentCardPage === 0 ? 'hidden' : 'visible')
                }}
              >
                <img src={leftarrow} alt="Previous" />
              </button>
              <button
                className={styles.recognizedNextButton}
                onClick={nextCardPage}
                style={{
                  visibility: isMobile
                    ? (currentCardIndex === recognitionCards.length - 1 ? 'hidden' : 'visible')
                    : (currentCardPage === 1 ? 'hidden' : 'visible')
                }}
              >
                <img src={rightarrow} alt="Next" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 section */}

      {/* 7 section */}
      <section className={styles.section7} style={{ backgroundImage: `url(${earth})` }}>
        <div className={styles.sec7Content}>
          <div className={styles.sec7Left}>
            <img src={TheSacredGrovesisa} className={styles.sec7Logo} />

            <h2 className={styles.sec7Heading}>
              The Sacred Groves is a<br />
              Community Interest<br />
              Company, incorporated<br />
              in the United Kingdom,<br />
              reimagining business in<br />
              partnership with<br />
              nature — our ultimate<br />
              shareholder.
            </h2>

            <p className={styles.sec7Para}>
              With Guardians in over <strong>30 countries</strong>, we protect<br />
              three biodiverse habitats in the UK and Canada.<br />
              By 2030, our goal is to safeguard a million acres of<br />
              critical ecosystems across the planet.
            </p>
          </div>
        </div>
      </section>

      {/* Aligned with UN SDGs Section */}
      <AlignedWithUNSDGs hideLinkedInCarousel={true} />
    </>
  )
}


