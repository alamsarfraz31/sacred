import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'
import searchIcon from '@/assets/search.svg'
import hamburgerIcon from '@/assets/hamburger.svg'
import logo from '@/assets/logo.png'

// Icons
import arrowSidebar from '@/assets/arrow-sidebar.svg'
import activeArrowSidebar from '@/assets/active-arrow-sidebar.svg'
import flowerIcon from '@/assets/BusinesforthePlanet.svg' // Default icon
import peopleForPlanetIcon from '@/assets/people_for_the_planet.png'
import businessForPlanetIcon from '@/assets/bussiness_for_the_planet.png'
import ourSacredGrovesIcon from '@/assets/our_sacred_groves.png'

interface SubmenuItem {
  title: string;
  location?: string;
  path?: string;
}

interface MenuItem {
  title: string;
  hasSubmenu: boolean;
  submenu?: SubmenuItem[];
  link?: string;
}

export const Header: React.FC = () => {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  const isPeopleForPlanetPage = location.pathname === '/people-for-the-planet'
  const isBusinessForPlanetPage = location.pathname === '/business-for-the-planet'
  const isJunkToJunglesPage = location.pathname === '/junk-to-jungles'
  const isIndiaPage = location.pathname === '/india'
  const isPartnershipForPlanetPage = location.pathname === '/partnership-for-the-planet'
  const isStoriesThatInspirePage = location.pathname === '/stories-that-inspire' || location.pathname.startsWith('/stories-that-inspire/')
  const isOurSacredGrovesPage = location.pathname === '/our-sacred-groves'
  const isCoedRhyalPage = location.pathname === '/coed-rhyal'
  const isGirginPrysgPage = location.pathname === '/girgin-prysg'
  const isOceanSanctuaryPage = location.pathname === '/ocean-sanctuary'
  const isMyEarthPointPage = location.pathname === '/my-earth-point'
  const isPolicyPage = location.pathname === '/policy'
  const isTermsAndConditionsPage = location.pathname === '/terms-and-conditions'
  const isKnowledgeBasePage = location.pathname.startsWith('/knowledgebase')
  const isMediaCentrePage = location.pathname === '/media-centre'

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
    }
  }, [searchOpen])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen) {
        const target = event.target as HTMLElement
        // Check if click is outside search container and not on any search button
        if (
          searchContainerRef.current &&
          !searchContainerRef.current.contains(target) &&
          !target.closest(`.${styles.searchButton}`) &&
          !target.closest(`.${styles.searchWrap}`)
        ) {
          setSearchOpen(false)
        }
      }
    }

    if (searchOpen) {
      // Use a small delay to avoid immediate closure when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [searchOpen])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    setActiveSubmenu(null) // Reset submenu on close
  }

  const toggleSubmenu = (title: string) => {
    if (activeSubmenu === title) {
      setActiveSubmenu(null)
    } else {
      setActiveSubmenu(title)
    }
  }

  const menuItems: MenuItem[] = [
    {
      title: 'OUR SACRED GROVES',
      hasSubmenu: true,
      submenu: [
        { title: 'Coed Rhyal', location: 'Wales, United Kingdom', path: '/coed-rhyal' },
        { title: 'Gigrin Prysg', location: 'Wales, United Kingdom', path: '/girgin-prysg' },
        { title: 'Ocean Sanctuary', location: 'Nova Scotia, Canada', path: '/ocean-sanctuary' },
      ]
    },
    {
      title: 'PEOPLE FOR THE PLANET',
      hasSubmenu: true,
      submenu: [
        { title: 'Protect a Habitat', path: '/people-for-the-planet#protect-a-habitat' },
        { title: 'Gift a Habitat', path: '/people-for-the-planet#gift-a-habitat' },
      ]
    },
    {
      title: 'BUSINESS FOR THE PLANET',
      hasSubmenu: true,
      submenu: [
        { title: 'Partnership for the Planet', path: '/partnership-for-the-planet' },
        { title: 'myEarth Points', path: '/my-earth-point' },
        { title: 'Junk to Jungles', path: '/junk-to-jungles' },
        { title: 'Seeds of recognition', path: '/business-for-the-planet#seeds-of-recognition' },
        { title: 'Brand a Habitat', path: '/business-for-the-planet#brand-a-habitat' },
      ]
    },
    {
      title: 'ABOUT US',
      hasSubmenu: false,
      link: '/about'
    }
  ]

  const popularSearches = [
    'Business for the Planet',
    'Stories that inspire us'
  ]

  // Determine which footer icon to display based on active submenu
  const getFooterIcon = () => {
    if (!sidebarOpen || !activeSubmenu) {
      return flowerIcon // Default icon when sidebar is closed or no submenu is active
    }

    switch (activeSubmenu) {
      case 'PEOPLE FOR THE PLANET':
        return peopleForPlanetIcon
      case 'BUSINESS FOR THE PLANET':
        return businessForPlanetIcon
      case 'OUR SACRED GROVES':
        return ourSacredGrovesIcon
      default:
        return flowerIcon
    }
  }

  return (
    <header className={`${styles.header} ${sidebarOpen ? styles.headerHidden : ''} ${searchOpen ? styles.searchExpanded : ''}`} role="banner">
      <div className={styles.headerContent}>

        <nav className={styles.nav} role="navigation" aria-label="Main navigation">
          <div className={`${styles.container} ${isPartnershipForPlanetPage ? styles.partnershipPageContainer : ''}`}>
            <Link to="/" className={styles.logo} aria-label="Sacred Groves Home">
              <img src={logo} alt="Sacred Groves" className={styles.logoImage} />
            </Link>

            {isPeopleForPlanetPage && !searchOpen && (
              <div className={styles.pageTitle}>
                People <span className={styles.pageTitleItalic}>for the</span> Planet
              </div>
            )}

            {isBusinessForPlanetPage && !searchOpen && (
              <div className={`${styles.pageTitle} ${styles.businessPageTitle}`}>
                Business <span className={styles.pageTitleItalic}>for the</span> Planet
              </div>
            )}

            {isJunkToJunglesPage && !searchOpen && (
              <div className={styles.pageTitle}>
                Junk to Jungles
              </div>
            )}

            {isIndiaPage && !searchOpen && (
              <div className={styles.pageTitle}>
                Partnerships for India
              </div>
            )}

            {isPartnershipForPlanetPage && !searchOpen && (
              <div className={styles.pageTitle}>
                Partnership <span className={styles.pageTitleItalic}>for the</span> Planet
              </div>
            )}

            {isStoriesThatInspirePage && !searchOpen && (
              <div className={styles.pageTitle}>
                Stories that inspire us
              </div>
            )}

            {isOurSacredGrovesPage && !searchOpen && (
              <div className={styles.pageTitle}>
                Our Groves
              </div>
            )}

            {isCoedRhyalPage && !searchOpen && (
              <div className={styles.pageTitle}>
                Coed Rhyal
              </div>
            )}

            {isGirginPrysgPage && !searchOpen && (
              <div className={styles.pageTitle}>
                Gigrin Prysg
              </div>
            )}

            {isOceanSanctuaryPage && !searchOpen && (
              <div className={styles.pageTitle}>
                Ocean Sanctuary
              </div>
            )}

            {isMyEarthPointPage && !searchOpen && (
              <div className={styles.pageTitle}>
                myEarth Point
              </div>
            )}

            {(isPolicyPage || isTermsAndConditionsPage) && !searchOpen && (
              <div className={styles.pageTitle}>
                Disclosure
              </div>
            )}

            {isKnowledgeBasePage && !searchOpen && (
              <div className={styles.pageTitle}>
                Knowledge Centre
              </div>
            )}
            {isMediaCentrePage && !searchOpen && (
              <div className={styles.pageTitle}>
                Media Centre
              </div>
            )}

            <div className={styles.navRight}>
              {!searchOpen && (
                <>
                  <a href="https://application.sacredgroves.earth/signup" target="_blank" rel="noopener noreferrer" className={styles.signUpButton}>Sign Up</a>
                  <a href="https://application.sacredgroves.earth/login" target="_blank" rel="noopener noreferrer" className={styles.loginButton}>Login</a>
                </>
              )}

              <div className={styles.searchWrap} ref={searchContainerRef}>
                {searchOpen && (
                  <div className={styles.searchExpandedContent}>
                    <div className={styles.searchInputContainer}>
                      <div className={styles.searchInputWrapper}>
                        <input
                          ref={inputRef}
                          className={styles.searchInputExpanded}
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <img src={searchIcon} alt="Search" className={styles.searchIconInside} />
                      </div>
                    </div>
                    <div className={styles.popularSearches}>
                      <p className={styles.popularSearchesLabel}>Popular searches</p>
                      <ul className={styles.popularSearchesList}>
                        {popularSearches.map((search, index) => (
                          <li key={index}>
                            <button
                              className={styles.popularSearchItem}
                              onClick={() => {
                                // Handle search click - you can add navigation logic here
                                setSearchOpen(false)
                              }}
                            >
                              {search}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {!searchOpen && (
                  <button
                    className={styles.searchButton}
                    aria-label="Open search"
                    onClick={() => setSearchOpen(true)}
                  >
                    <img src={searchIcon} alt="Search" />
                  </button>
                )}
              </div>

              {!searchOpen && (
                <button
                  className={styles.menuButton}
                  aria-label="Menu"
                  onClick={toggleSidebar}
                >
                  <img src={hamburgerIcon} alt="Menu" />
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sidebarHeader}>
          <Link to="/" onClick={toggleSidebar} aria-label="Sacred Groves Home">
            <img src={logo} alt="Sacred Groves" className={styles.sidebarLogo} />
          </Link>
          <button className={styles.closeSidebarButton} onClick={toggleSidebar} aria-label="Close Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#03303D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="#03303D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <ul className={styles.menuList}>
            {menuItems.map((item, index) => (
              <li key={index} className={styles.menuListItem}>
                {item.hasSubmenu ? (
                  <>
                    <div
                      className={`${styles.menuItem} ${activeSubmenu === item.title ? styles.active : ''}`}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      <img
                        src={activeSubmenu === item.title ? activeArrowSidebar : arrowSidebar}
                        alt="Arrow"
                        className={styles.menuArrow}
                      />
                      {item.title}
                    </div>

                    {/* Accordion Submenu */}
                    <div className={`${styles.accordionContent} ${activeSubmenu === item.title ? styles.expanded : ''}`}>
                      <ul className={styles.submenuList}>
                        {item.submenu?.map((subItem, subIndex) => (
                          <li key={subIndex} className={styles.submenuItem}>
                            {subItem.path ? (
                              <Link
                                to={subItem.path}
                                className={styles.submenuLink}
                                onClick={toggleSidebar}
                              >
                                <span>{subItem.title}</span>
                                {subItem.location && (
                                  <span className={styles.submenuItemLocation}>{subItem.location}</span>
                                )}
                              </Link>
                            ) : (
                              <>
                                <span>{subItem.title}</span>
                                {subItem.location && (
                                  <span className={styles.submenuItemLocation}>{subItem.location}</span>
                                )}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.link || '#'}
                    className={`${styles.menuItem} ${styles.menuItemSingle}`}
                    onClick={toggleSidebar}
                  >
                    <img
                      src={arrowSidebar}
                      alt="Arrow"
                      className={styles.menuArrow}
                    />
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Auth Buttons */}
          <div className={styles.mobileAuthButtons}>
            <a href="https://application.sacredgroves.earth/signup" target="_blank" rel="noopener noreferrer" className={styles.mobileSignUpButton}>Sign Up</a>
            <a href="https://application.sacredgroves.earth/login" target="_blank" rel="noopener noreferrer" className={styles.mobileLoginButton}>Login</a>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerIcons}>
            <img src={getFooterIcon()} alt={activeSubmenu || "Sacred Groves"} className={styles.footerIcon} />
          </div>
        </div>
      </div>
    </header>
  )
}
