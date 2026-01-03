// File: src/pages/About.tsx
import React from 'react'
import { SEO } from '@/components/common/SEO'
import { PAGE_SEO, BREADCRUMBS } from '@/constants'
import styles from './About.module.css'
import aboutusbackgroundimage from '@/assets/aboutusbackgroundimage.png'
import signature from '@/assets/signature.png'
import VikramKrishna from '@/assets/VikramKrishna.png'
import MonishaKrishna from '@/assets/MonishaKrishna.png'
import SudhirSreedharan from '@/assets/SudhirSreedharan.png'
import linkedln from '@/assets/linkedln.svg'
// Add these imports at the top of src/pages/About.tsx
import GOVUK from '@/assets/GOVUK.svg'
// section 5 images
// section 6 images

// section 7 images
import Disclosureslogo from '@/assets/Disclosureslogo.svg'
import arrow_seal from '@/assets/arrow_seal.svg'
// section 8 images
import align_1 from '@/assets/align_1.svg'
import align_2 from '@/assets/align_2.svg'
import align_3 from '@/assets/align_3.svg'
import align_4 from '@/assets/align_4.svg'
import earth from '@/assets/earth.png'
import TheSacredGrovesisa from '@/assets/TheSacredGrovesisa.svg'
import { FadeInSection } from '@/components/common/FadeInSection/FadeInSection'
import Usingtechnology from '@/assets/Usingtechnology.svg'
import coedwing from '@/assets/coedwing.svg'
// import map from '@/assets/map.png'
import threeForestImage from '@/assets/3_forest_image.png'
import forestArrow from '@/assets/forest_arrow.svg'


const About: React.FC = () => {
  return (
    <>
      <SEO
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
        ogImage={PAGE_SEO.about.ogImage}
        breadcrumbs={BREADCRUMBS.about}
        includeOrganization={true}
      />
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.cardBox} style={{ backgroundImage: `url(${aboutusbackgroundimage})` }}>
            <div className={styles.rightBadge}>
              <p className={styles.rightText}>
                Mr. Owain Grant (left), National Forest for Wales Liaison Officer - South West, handing over the 'National Forest for Wales' plaque to the Founders
              </p>
            </div>
          </div>
        </div>

        <div className={styles.cardBoxSide}>
          <div className={styles.cardContent}>
            <h1 className={styles.heading}>“We bought a forest to let it grow wild”</h1>
            <h2 className={styles.heading2}>Monisha and Vikram Krishna</h2>
            <div className={styles.textBlock}>
              <p>We often think about the world we’ll leave behind. Our beautiful planet and its biodiverse habitats. And in a world changing this fast, it’s easy to lose faith.</p>
              <p>But as possibilists, we’re still driven by hope.</p>
              <p>That hope found us in Meghalaya, when we stepped into a sacred grove with our daughters. Here, nothing is taken away, not even a leaf. The reverence of that place stayed with us. It reminded us that nature thrives when humans simply choose to let it be.</p>
              <p>So when the chance arose to protect a small woodland in Wales headed for commercial timber or pasture use, we chose a different path: business for the planet. Not to cut. Not to build. But simply to let it grow wild again.</p>
              <p>We're now protecting two Ancient Oak Woodlands in Wales — Gigrin Prysg and Coed Rhyal — and Ocean Sanctuary, an Acadian forest in Nova Scotia. As our habitats grew, so did our purpose.</p>
              <p>We built Sacred Groves so people and businesses can do something positive for nature every day, and turn it into an intergenerational legacy. And the world responded. We’ve seen success, proof that business and planet can go hand in hand.</p>
              <p>Guardians from across the globe have joined us, creating new economic models where nature isn’t a line item, but the heart of value itself.</p>
              <p>May the forest be with you.</p>
            </div>
            <div className={styles.signatureWrap}>
              <img src={signature} alt="signature" className={styles.signature} />
            </div>
          </div>
        </div>

        <section className={styles.teamSection}>
          <h3 className={styles.teamHeading}>We are not environmentalists. Nor scientists or technologists. We are business folk. And so we got into the business of protecting habitats.</h3>
          <div className={styles.cardsRow}>
            <div className={styles.card}>
              <div className={styles.roundImageWrap}>
                <img src={VikramKrishna} alt="Vikram Krishna" className={styles.roundImage} />
              </div>
              <h4 className={styles.name}>Vikram Krishna</h4>
              <p className={styles.cardText}>Vikram is a seasoned award winning banker with experience across Business Management, Sales, Marketing, Analytics, Product Management, Customer Experience and Sustainability. He is inspired by the principles of 'inter-generational equity' and is driven by his passion to leave behind a flourishing planet for future generations. Being a long distance runner, he is all set for the long haul in protecting natural habitats for posterity.</p>
              <div className={styles.iconWrap}>
                <a
                  href="https://www.linkedin.com/in/vikram-krishna-31b0025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedInLink}
                >
                  <img src={linkedln} alt="linkedin" className={styles.linkedIcon} />
                </a>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.roundImageWrap}>
                <img src={MonishaKrishna} alt="Monisha Krishna" className={styles.roundImage} />
              </div>
              <h4 className={styles.name}>Monisha Krishna</h4>
              <p className={styles.cardText}>Monisha earned her spurs in Development Finance before taking a sabbatical to bring up her children. She is inspired by the power and impact that millions of ordinary people can make when they get together to support a cause. In her free time, she enjoys pottery and is inspired to shape a whole new way to conserve our planet's resources.</p>
              <div className={styles.iconWrap}>
                <a
                  href="https://www.linkedin.com/in/monisha-krishna-7bba761a2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedInLink}
                >
                  <img src={linkedln} alt="linkedin" className={styles.linkedIcon} />
                </a>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.roundImageWrap}>
                <img src={SudhirSreedharan} alt="Sudhir Sreedharan" className={styles.roundImage} />
              </div>
              <h4 className={styles.name}>Sudhir Sreedharan</h4>
              <p className={styles.cardText}>Sudhir is a senior airline professional with extensive commercial and marketing experience across leading global airlines. He is motivated by the impact Governments and Institutions can make as they get together to combat climate change. He believes that new conservation ideas deserve a runway to succeed and is determined to give Sacred Groves a flying start!</p>
              <div className={styles.iconWrap}>
                <a
                  href="https://www.linkedin.com/in/sudhir-sreedharan-b401647/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedInLink}
                >
                  <img src={linkedln} alt="linkedin" className={styles.linkedIcon} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.cicSection}>
        <div className={styles.cicContent}>
          <h3 className={styles.cicHeading}>We’re a Community Interest Company, and for us, nature is — and always will be — our ultimate shareholder.</h3>
          <div className={styles.cicTextBlock}>
            <p>Our mission is to build a conservation enterprise designed to withstand the test of time, much like the oldest habitats in nature.</p>
            <p>That’s why we chose to be structured as a Community Interest Company (CIC) in England & Wales. Under UK law, our “Asset Lock” ensures that any forest or natural habitat we acquire is legally protected as conservation land — for the benefit of the community — and cannot be exploited, resold for profit, or repurposed for commercial gain.</p>
            <p>Each year, we undergo a Community Interest Test, demonstrating how our actions deliver measurable benefit. Regulations around dividends, remuneration, and reserves ensure capital flows toward purpose — not extraction.</p>
            <p>We are not a charity, and we don’t accept donations. We are pioneering a new model— one that maximises community benefit while still rewarding people, planet, and business.</p>
            <p>A model where value is created with nature, not taken from it. Where human ambition and natural ecosystems thrive together.</p>
          </div>
          <div className={styles.readMoreWrap}>
            <span className={styles.readMoreText}>Read more at:</span>
            <a
              href="https://www.gov.uk/government/publications/community-interest-companies-how-to-form-a-cic/community-interest-companies-guidance-chapters"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.govLogoLink}
            >
              <img src={GOVUK} alt="GOV.UK" className={styles.govLogo} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.sacredGrovesSection} style={{ backgroundImage: `url(${earth})` }}>
        <div className={styles.sacredGrovesContent}>
          <div className={styles.sacredGrovesLeft}>
            <img src={TheSacredGrovesisa} className={styles.sacredGrovesLogo} alt="The Sacred Groves" />
            <p className={styles.sacredGrovesText}>
              With Guardians in<br />
              over <strong>30 countries</strong>,<br />
              we protect three<br />
              biodiverse habitats in<br />
              the UK and Canada.<br />
              By 2030, our goal is<br />
              to safeguard a<br />
              million acres of<br />
              critical ecosystems<br />
              across the planet.
            </p>
          </div>
        </div>
      </div>

      {/* Split Section - Using technology, economics, creativity, and science, to let forests grow wild */}
      <FadeInSection>
        <section className={styles.splitSection}>
          <div className={styles.splitContainer}>
            {/* Left Side - Green Background */}
            <div className={styles.greenSection}>
              {/* Icons */}
              <div className={styles.iconRow}>
                <img src={Usingtechnology} alt="Technology Icons" className={styles.technologyIcons} />
              </div>

              {/* Main Heading */}
              <div className={styles.contentBlock}>
                <h2 className={styles.splitHeading}>
                  Using <br />
                  technology, <br />
                  economics, <br />
                  creativity, and <br />
                  science, <br />
                  <span className={styles.boldText}>to let forests <br />grow wild.</span>
                </h2>
              </div>
            </div>

            {/* Center Image - All 3 forest images */}
            <div className={styles.centerImageContainer}>
              <img src={threeForestImage} alt="Sacred Groves Habitats" className={styles.centerImage} />
              {/* Arrows for each map section - positioned relative to image */}
              <a
                href="/ocean-sanctuary"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapArrow}
                style={{ left: 'calc(247px - 27.26px - 10px)' }}
                aria-label="Visit Ocean Sanctuary page"
              >
                <img src={forestArrow} alt="Arrow" />
              </a>
              <a
                href="/coed-rhyal"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapArrow}
                style={{ left: 'calc(494px - 27.26px - 10px)' }}
                aria-label="Visit Coed Rhyal page"
              >
                <img src={forestArrow} alt="Arrow" className={styles.coedMap} />
              </a>
              <a
                href="/girgin-prysg"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapArrow}
                style={{ left: 'calc(741px - 27.26px - 10px)' }}
                aria-label="Visit Gigrin Prysg page"
              >
                <img src={forestArrow} alt="Arrow" className={styles.girgin} />
              </a>
            </div>

            {/* Right Side - Dark Background */}
            <div className={styles.darkSection}>
              {/* DESKTOP CONTENT */}
              <div className={styles.desktopContent}>
                {/* National Forest Logo with Text */}
                <div className={styles.forestLogoWrapper}>
                  <img src={coedwing} alt="Coedwig Genedlaethol Cymru - National Forest for Wales" className={styles.forestLogo} />
                  <div className={styles.forestLogoText}>
                    <p className={styles.forestLogoTitle}>Coedwig<br />Genedlaethol Cymru</p>
                    <p className={styles.forestLogoSubtitle}>National Forest<br />for Wales</p>
                  </div>
                </div>

                {/* Bottom Description */}
                <div className={styles.forestDescription}>
                  <p className={styles.forestText}>
                    Once marked for private sale, these forests are now a part of the 'National Forest for Wales' network, helping build a contiguous green corridor across the Welsh country.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <div className={styles.disclosuresSection}>
        <div className={styles.disclosuresInner}>
          <img src={Disclosureslogo} alt="disclosures logo" className={styles.disclosuresLogo} />
          <h3 className={styles.disclosuresHeading}>Disclosures</h3>

          <div className={styles.disclosuresGrid}>
            <a
              href="/policy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Privacy policy</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>

            <a
              href="/src/assets/Financial%20Statement%202024.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Financial Statements- Dec 2024</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>

            <a
              href="/src/assets/Certificate-of-Incorporation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Certificate of Incorporation</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>

            <a
              href="/policy#cookies"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Cookie Policy</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>

            <a
              href="/src/assets/Financial%20Statement%202023.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Financial Statements- Dec 2023</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>

            <a
              href="/src/assets/The%20Sacred%20Groves%20-%20Technology%20&%20Analytics.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Data Sources, Analytics &amp; Technology</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>

            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Guardian Terms and Conditions</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>

            <a
              href="/src/assets/Financial%20Statement%202022.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.disclosureItem}
            >
              <span>Financial Statements- Dec 2022</span>
              <img src={arrow_seal} alt="arrow" className={styles.arrowIcon} />
            </a>
          </div>
        </div>
      </div>



      <div className={styles.alignSection}>
        <div className={styles.alignContent}>
          <div className={styles.alignLeftText}>
            Aligned with<br />
            the UN<br />
            Sustainable<br />
            Development<br />
            Goals.
          </div>

          <div className={styles.alignImageRow}>
            <img src={align_1} alt="SDG 12" className={styles.alignImg} />
            <img src={align_2} alt="SDG 13" className={styles.alignImg} />
            <img src={align_3} alt="SDG 15" className={styles.alignImg} />
            <img src={align_4} alt="SDG 17" className={styles.alignImg} />
          </div>
        </div>
      </div>




    </>
  )
}

export default About
