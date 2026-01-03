/**
 * LinkedIn Posts Slider Component
 * Reusable carousel for LinkedIn posts
 */
import React, { useState, useEffect } from 'react'
import styles from './CommonSections.module.css'
import { fetchLinkedInPosts, type LinkedInPost } from '@/utils/api'
// import ShopforthePlanet from '@/assets/linked_in_post.png'
// import ShopforthePlanet_1 from '@/assets/linked_in_post.png'
// import LearnforthePlanet from '@/assets/linked_in_post.png'
import scaradelogo from '@/assets/scaradelogo.svg'
import linkedln from '@/assets/linkedln.svg'
import silderleftarrow from '@/assets/silderleftarrow.svg'
import silderrightside from '@/assets/silderrightside.svg'
// import likeIcon from '@/assets/like_icon.svg'
// import commentIcon from '@/assets/comment_icon.svg'
import shareIcon from '@/assets/share_icon.svg'

export const LinkedInPostsSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fallback mock posts (used if API fails)
  const mockPosts: LinkedInPost[] = [
    {
      id: 1,
      title: "#COP30 has officially concluded, and the message is unmistakable: the world is finally shifting from ambition to accountability. For us at Sacred Groves, these outcomes reaffirm why permanent, legally protected conservation is not just important — it's indispensable...",
      image: "https://media.licdn.com/dms/image/v2/D4D05AQGJ930E9hOUaw/videocover-high/B4DZrEtqzeKEBU-/0/1764236899258?e=1767506400&v=beta&t=glJgWhmZDYkvJYQZwLssCtxOiEyzw5TtXbphMoP1QII",
      likes: 101,
      comments: 50,
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7400035549895593985/",
    },
    {
      id: 2,
      title: "Struggling to find a truly meaningful and waste-free gift for your clients, friends, and family this year? Traditional gifts mean packaging, printing, travel, and waste. Experience the true joy of gifting a Sacred Groves Cluster to your clients, friends, and family - gifts that don't cost the Earth...",
      image: "https://media.licdn.com/dms/image/v2/D4D05AQFDAp5Y2Y91Yg/videocover-high/B4DZr4U1tYIgBU-/0/1765102805493?e=1767506400&v=beta&t=3x5n8QMhnQuj7KxJzFTaFoxeJfLCCjLrNtLHJ6v0kEM",
      likes: 101,
      comments: 50,
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7403659597695160320/",
    },
    {
      id: 3,
      title: "Mark life's special moments with a gift that lasts. A Sacred Groves Cluster is a thoughtful, planet-positive way to celebrate friends, family, and colleagues. Each cluster represents a meaningful contribution to global conservation efforts, creating lasting impact for generations to come...",
      image: "https://media.licdn.com/dms/image/v2/D4D05AQFDF8MeFW4sTA/videocover-high/B4DZr4VvCVH4BU-/0/1765103040339?e=1767506400&v=beta&t=9Hh22TaFsAsnTo1rlhwJH3jHXPiM0CKyHIXjNyYv1lQ",
      likes: 101,
      comments: 50,
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7404746790077415424/",
    },
    {
      id: 4,
      title: "Flowing through valleys and across time, rivers remind us that all of nature is connected. On 12th September, Mr. Dafydd Lloyd from Natural Resources Wales visited Sacred Groves, Gigrin Prysg, for the annual survey. Together, they observed the vitality...",
      image: "https://media.licdn.com/dms/image/v2/D4D05AQE5zMPPlkCIJg/videocover-high/B4DZnodxrlH4CA-/0/1760541769583?e=1767506400&v=beta&t=z65nrqWb2-5QQvXBsE3ldrygRQv48DUPF1p3Ib_RaXY",
      likes: 101,
      comments: 50,
      url: "https://www.linkedin.com/posts/the-sacred-groves_sacredgroves-conservation-biodiversity-activity-7384430821530750976-6dj9?utm_source=share&utm_medium=member_desktop&rcm=ACoAACeStCMBhnUhvsEjSv-5NwtpAVVbgsQrPA8",
    },
    {
      id: 5,
      title: "The National Forest for Wales (NFW), represented by Mr. Owain Grant, recently surveyed Sacred Groves Coed Rhyal. He was pleased to confirm that the woodland is in good health and the evidence of active oak regeneration indicates a flourishing ecosystem benefitting all...",
      image: "https://media.licdn.com/dms/image/v2/D4D05AQHfm9EYHOnflA/videocover-high/B4DZmO5qC2GQB8-/0/1759039132858?e=1767506400&v=beta&t=hbmqJkI7F7_9ic134FNPkedAumVScVl7FFzbM8QGbo0",
      likes: 101,
      comments: 50,
      url: "https://www.linkedin.com/posts/the-sacred-groves_climateaction-sacredgroves-wales-activity-7378612571316117504-a1EA?utm_source=share&utm_medium=member_desktop&rcm=ACoAACeStCMBhnUhvsEjSv-5NwtpAVVbgsQrPA8",
    },
    {
      id: 6,
      title: "Guardian Spotlight: Darsh Misra, Grade 6, Riyadh. Every once in a while, a message arrives that touches our hearts and reminds us why we began this journey — to protect what truly matters 🦌 We recently heard from Darsh Misra, a bright Grade 6 student from Riyadh...",
      image: "https://media.licdn.com/dms/image/v2/D4D22AQFpERjojFg1Tg/feedshare-shrink_800/B4DZpxSkV1IMAg-/0/1762837285024?e=1767225600&v=beta&t=QCsggMxjoU4QvojkgiiUuCV8-xeITzTf2s5DysXFAMw",
      likes: 101,
      comments: 50,
      url: "https://www.linkedin.com/posts/the-sacred-groves_sacredgroves-naturepositive-conservation-activity-7393890270540550144-SAB3?utm_source=share&utm_medium=member_desktop&rcm=ACoAACeStCMBhnUhvsEjSv-5NwtpAVVbgsQrPA8",
    },
  ]

  // Fetch LinkedIn posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      try {
        const fetchedPosts = await fetchLinkedInPosts()

        if (fetchedPosts && fetchedPosts.length > 0) {
          setPosts(fetchedPosts)
        } else {
          // Fallback to mock posts if API returns empty
          console.warn('Using fallback mock posts')
          setPosts(mockPosts)
        }
      } catch (error) {
        console.error('Error loading LinkedIn posts, using mock data:', error)
        setPosts(mockPosts)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length)
  }

  // Calculate visible posts (show 3 at a time, loop around)
  const getVisiblePosts = () => {
    if (posts.length === 0) return []

    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % posts.length
      visible.push(posts[index])
    }
    return visible
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.postsGrid}>
          <div className={styles.postCard}>Loading LinkedIn posts...</div>
        </div>
      </div>
    )
  }

  // Show empty state if no posts
  if (posts.length === 0) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.postsGrid}>
          <div className={styles.postCard}>No LinkedIn posts available</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.sliderContainer}>
      {/* Navigation Arrows */}
      <button
        className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
        onClick={prevSlide}
        aria-label="Previous posts"
      >
        <img src={silderrightside} alt="Previous" />
      </button>

      {/* Posts Grid */}
      <div className={styles.postsGrid}>
        {getVisiblePosts().map((post, index) => (
          <div key={`${post.id}-${index}`} className={styles.postCard}>
            {/* Post Header */}
            <div className={styles.postHeader}>
              <img src={scaradelogo} alt="Sacred Groves Logo" className={styles.postLogo} />
              <div className={styles.postMeta}>
              </div>
              <img src={linkedln} alt="LinkedIn" className={styles.linkedinIcon} />
            </div>

            {/* Post Content */}
            <div className={styles.postContent}>
              <p className={styles.postTitle}>{post.title}</p>
              <a 
                href={post.url || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.readMore}
                onClick={(e) => {
                  if (post.url && post.url !== '#') {
                    e.preventDefault()
                    window.open(post.url, '_blank', 'noopener,noreferrer')
                  }
                }}
              >
                Read more
              </a>
            </div>

            {/* Post Image */}
            <div className={styles.postImageContainer}>
              <img src={post.image} alt={post.title} className={styles.postImage} />
            </div>

            {/* Post Footer */}
            <div className={styles.postFooter}>
              <div className={styles.postStats}>
                {/* <span className={styles.postLikes}>
                  <img src={likeIcon} alt="Like" className={styles.icon} />
                  {post.likes}
                </span>
                <span className={styles.postComments}>
                  <img src={commentIcon} alt="Comment" className={styles.icon} />
                  {post.comments}
                </span> */}
              </div>
              <button 
                className={styles.shareButton}
                onClick={() => {
                  if (post.url) {
                    window.open(post.url, '_blank', 'noopener,noreferrer')
                  }
                }}
              >
                <img src={shareIcon} alt="Share" className={styles.icon} />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
        onClick={nextSlide}
        aria-label="Next posts"
      >
        <img src={silderleftarrow} alt="Next" />
      </button>
    </div>
  )
}

