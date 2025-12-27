import React, { useState, useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/common/SEO'
import { AlignedWithUNSDGs } from '@/components/common/CommonSections'
import { Loading } from '@/components/common/Loading'
import styles from './BlogDetail.module.css'
import storyLeftLine from '@/assets/story_left_line.svg'
import storyLeftLogo from '@/assets/story_left_logo.svg'
import storyCenterImage from '@/assets/story_center_image.svg'
import storyRightArrow from '@/assets/story_right_arrow.svg'
import storyRightIcon from '@/assets/story_right_icon.svg'
import playIcon from '@/assets/play_icon.svg'
import downloadIcon from '@/assets/download.svg'
import shareIcon from '@/assets/share.svg'
import {
  fetchBlogById,
  fetchAllBlogs,
  fetchTags,
  getFeaturedImageUrl,
  // getBlogTags,
  extractPlainText,
  type BlogPost
} from '@/utils/blogApi'

// Helper function to parse HTML content into paragraphs
function parseContent(html: string): string[] {
  const div = document.createElement('div')
  div.innerHTML = html

  // Extract text from paragraphs
  const paragraphs: string[] = []
  const pElements = div.querySelectorAll('p')

  pElements.forEach(p => {
    const text = p.textContent?.trim()
    if (text && text.length > 0) {
      paragraphs.push(text)
    }
  })

  // If no paragraphs found, extract all text
  if (paragraphs.length === 0) {
    const text = div.textContent?.trim()
    if (text) {
      // Split by double newlines or periods followed by space
      const parts = text.split(/\n\n+|\.\s+(?=[A-Z])/).filter(p => p.trim().length > 0)
      paragraphs.push(...parts)
    }
  }

  return paragraphs.length > 0 ? paragraphs : [html]
}


export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([])
  const [allTags, setAllTags] = useState<Array<{ name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const blogId = id ? parseInt(id, 10) : null

  // Fetch blog and all blogs for navigation
  useEffect(() => {
    const loadData = async () => {
      if (!blogId) {
        setError('Invalid blog ID')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch blog, all blogs, and tags in parallel
        const [blogData, blogsData, tagsData] = await Promise.all([
          fetchBlogById(blogId),
          fetchAllBlogs({ per_page: 100, order: 'desc', orderby: 'date' }),
          fetchTags().catch(() => [])
        ])

        if (!blogData) {
          setError('Blog not found')
          setLoading(false)
          return
        }

        setBlog(blogData)
        setAllBlogs(blogsData)

        // Process tags for tags cloud
        const tagsWithCounts = tagsData.map(tag => ({
          name: tag.name,
          count: tag.count
        }))
        setAllTags(tagsWithCounts)
      } catch (err) {
        console.error('Error loading blog:', err)
        setError('Failed to load blog. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [blogId])

  // Get current blog index and navigation
  const currentIndex = blog ? allBlogs.findIndex(b => b.id === blog.id) : -1
  const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const nextPost = currentIndex >= 0 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Get blog content as paragraphs
  const blogContent = blog ? parseContent(blog.content.rendered) : []

  // Get blog tags
  // const blogTags = blog ? getBlogTags(blog) : []

  // Cleanup speech synthesis on unmount or route change
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleListenToArticle = () => {
    if (!blog) return

    if (isAudioPlaying) {
      // Stop speech synthesis
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
        speechSynthesisRef.current = null
      }
      setIsAudioPlaying(false)
    } else {
      // Check if browser supports speech synthesis
      if ('speechSynthesis' in window) {
        // Get the full article text
        const articleText = `${blog.title.rendered}. ${extractPlainText(blog.content.rendered)}`
        
        // Create speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(articleText)
        utterance.lang = 'en-US'
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        // Handle events
        utterance.onend = () => {
          setIsAudioPlaying(false)
          speechSynthesisRef.current = null
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
          setIsAudioPlaying(false)
          speechSynthesisRef.current = null
        }
        
        // Store reference and start speaking
        speechSynthesisRef.current = utterance
        window.speechSynthesis.speak(utterance)
        setIsAudioPlaying(true)
      } else {
        // Fallback: try audio element if speech synthesis is not available
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => setIsAudioPlaying(true))
            .catch((error) => {
              console.error('Audio playback error:', error)
              alert('Audio playback is not supported in your browser. Please use a modern browser with text-to-speech support.')
            })
        } else {
          alert('Text-to-speech is not supported in your browser. Please use a modern browser.')
        }
      }
    }
  }

  // Helper function to fetch blob with timeout
  const fetchWithTimeout = async (url: string, timeout: number = 10000): Promise<Response> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        resolve(base64)
      }
      reader.onerror = () => {
        resolve(null)
      }
      reader.readAsDataURL(blob)
    })
  }

  // Helper function to convert image to base64 with multiple fallback strategies
  const imageToBase64 = async (url: string): Promise<string | null> => {
    // List of strategies to try in order
    const strategies = [
      // Strategy 1: Direct fetch (works if CORS headers are set on the image server)
      async () => {
        const response = await fetchWithTimeout(url, 8000)
        if (!response.ok) throw new Error('Direct fetch failed')
        const blob = await response.blob()
        return await blobToBase64(blob)
      },
      // Strategy 2: Use corsproxy.io (more reliable than allorigins)
      async () => {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
        const response = await fetchWithTimeout(proxyUrl, 10000)
        if (!response.ok) throw new Error('corsproxy.io failed')
        const blob = await response.blob()
        return await blobToBase64(blob)
      },
      // Strategy 3: Use allorigins as last fallback
      async () => {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
        const response = await fetchWithTimeout(proxyUrl, 10000)
        if (!response.ok) throw new Error('allorigins failed')
        const blob = await response.blob()
        return await blobToBase64(blob)
      }
    ]

    for (const strategy of strategies) {
      try {
        const result = await strategy()
        if (result) {
          return result
        }
      } catch (error) {
        // Continue to next strategy
        continue
      }
    }

    console.warn('All image fetch strategies failed for:', url)
    return null
  }

  // Helper function to convert all images in HTML to base64
  const convertImagesToBase64 = async (html: string): Promise<string> => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const images = doc.querySelectorAll('img')

    for (const img of Array.from(images)) {
      const src = img.getAttribute('src')
      if (src && src.startsWith('http')) {
        const base64 = await imageToBase64(src)
        if (base64) {
          img.setAttribute('src', base64)
        } else {
          // Remove image if conversion fails
          img.remove()
        }
      }
    }

    return doc.body.innerHTML
  }

  const handleDownload = async () => {
    if (!blog || isDownloading) return

    setIsDownloading(true)

    try {
      // Dynamically import html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default

      // Get featured image
      const featuredImage = getFeaturedImageUrl(blog)
      const formattedDate = formatDate(blog.date)

      // Create a temporary div for PDF generation
      // Position it in viewport but make it invisible to user
      const tempDiv = document.createElement('div')
      tempDiv.id = 'pdf-content-temp'
      tempDiv.style.position = 'fixed'
      tempDiv.style.left = '0'
      tempDiv.style.top = '0'
      tempDiv.style.width = '794px' // A4 width in pixels (210mm at 96 DPI)
      tempDiv.style.maxWidth = '794px'
      tempDiv.style.minHeight = '500px' // Ensure minimum height
      tempDiv.style.padding = '40px'
      tempDiv.style.fontFamily = 'Arial, Helvetica, sans-serif'
      tempDiv.style.lineHeight = '1.6'
      tempDiv.style.color = '#333333'
      tempDiv.style.backgroundColor = '#ffffff'
      tempDiv.style.fontSize = '14px'
      tempDiv.style.boxSizing = 'border-box'
      tempDiv.style.zIndex = '999999'
      tempDiv.style.opacity = '0.01' // Almost invisible but still capturable
      tempDiv.style.pointerEvents = 'none'
      tempDiv.style.overflow = 'visible'
      tempDiv.style.display = 'block'
      tempDiv.style.visibility = 'visible'

      // Build HTML content with proper structure
      // First, create the structure with text content
      let htmlContent = '<div style="max-width: 100%;">'

      // Add featured image if available (convert to base64, but don't block if it fails)
      if (featuredImage) {
        try {
          const base64Image = await imageToBase64(featuredImage)
          if (base64Image) {
            htmlContent += `<div style="margin-bottom: 30px; text-align: center;"><img src="${base64Image}" alt="${blog.title.rendered.replace(/"/g, '&quot;')}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" /></div>`
          }
        } catch (error) {
          console.warn('Failed to convert featured image, continuing without it:', error)
        }
      }

      htmlContent += `
        <h1 style="color: #03303D; font-size: 28px; margin-bottom: 15px; line-height: 1.3; font-weight: bold; page-break-after: avoid;">${blog.title.rendered}</h1>
        <div style="color: #666666; font-size: 12px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eeeeee;">
          <strong>Published:</strong> ${formattedDate}
        </div>
        <div style="font-size: 14px; line-height: 1.8; color: #333333;">
      `

      // Convert images in content to base64 (with timeout to not block too long)
      try {
        const contentWithBase64Images = await Promise.race([
          convertImagesToBase64(blog.content.rendered),
          new Promise<string>((resolve) => {
            setTimeout(() => {
              // If conversion takes too long, use original content without images
              console.warn('Image conversion timed out, using content without images')
              resolve(blog.content.rendered.replace(/<img[^>]*>/gi, ''))
            }, 15000) // 15 second timeout
          })
        ])
        htmlContent += contentWithBase64Images
      } catch (error) {
        console.warn('Error converting images, using content without images:', error)
        // Remove all img tags if conversion fails
        htmlContent += blog.content.rendered.replace(/<img[^>]*>/gi, '')
      }

      htmlContent += `
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center; color: #666666; font-size: 11px;">
          <p>Source: Sacred Groves - www.sacredgroves.earth</p>
        </div>
      </div>`

      tempDiv.innerHTML = htmlContent
      document.body.appendChild(tempDiv)

      // Verify content was added
      if (!tempDiv.innerHTML || tempDiv.innerHTML.trim() === '') {
        throw new Error('Failed to create PDF content')
      }

      // Force multiple reflows to ensure rendering
      void tempDiv.offsetHeight
      void tempDiv.scrollHeight
      void tempDiv.clientHeight

      // Wait a bit for DOM to settle
      await new Promise(resolve => setTimeout(resolve, 200))

      // Wait for images to load (now all base64, so they should load quickly)
      const images = tempDiv.querySelectorAll('img')
      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map((img: HTMLImageElement) => {
            return new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve()
              } else {
                const timeout = setTimeout(() => {
                  // Hide broken images but continue
                  img.style.display = 'none'
                  resolve()
                }, 5000)
                img.onload = () => {
                  clearTimeout(timeout)
                  resolve()
                }
                img.onerror = () => {
                  clearTimeout(timeout)
                  // Remove broken images
                  img.style.display = 'none'
                  resolve()
                }
              }
            })
          })
        )
      }

      // Additional delay to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 500))

      // Force another reflow after images load
      void tempDiv.offsetHeight
      void tempDiv.scrollHeight
      void tempDiv.clientHeight

      // Get actual dimensions - ensure we have valid dimensions
      const scrollWidth = tempDiv.scrollWidth
      const scrollHeight = tempDiv.scrollHeight
      const offsetWidth = tempDiv.offsetWidth
      const offsetHeight = tempDiv.offsetHeight
      const clientHeight = tempDiv.clientHeight
      
      console.log('Dimension check:', {
        scrollWidth,
        scrollHeight,
        offsetWidth,
        offsetHeight,
        clientHeight,
        innerHTML: tempDiv.innerHTML.length
      })

      const width = Math.max(scrollWidth || offsetWidth || 794, 794)
      const height = Math.max(scrollHeight || offsetHeight || clientHeight || 1123, 1123)
      
      // If height is still 0 or very small, calculate from content
      if (height < 100) {
        // Try to calculate height from content
        const contentDiv = tempDiv.querySelector('div')
        if (contentDiv) {
          const contentHeight = contentDiv.scrollHeight || contentDiv.offsetHeight
          if (contentHeight > 0) {
            console.log('Using content height:', contentHeight)
            tempDiv.style.height = `${contentHeight + 80}px` // Add padding
            void tempDiv.offsetHeight
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
      }
      
      const finalHeight = Math.max(tempDiv.scrollHeight || tempDiv.offsetHeight || height, 1123)
      console.log('Final dimensions:', { width, height: finalHeight })

      // Verify the div has content before generating PDF
      const textContent = tempDiv.textContent || tempDiv.innerText || ''
      if (textContent.trim().length < 10) {
        console.error('PDF content appears to be empty. InnerHTML length:', tempDiv.innerHTML.length)
        console.error('Text content:', textContent.substring(0, 100))
        throw new Error('PDF content is empty or invalid')
      }

      console.log('Generating PDF with dimensions:', { width, height })
      console.log('Content length:', tempDiv.innerHTML.length)
      console.log('Text content preview:', textContent.substring(0, 200))

      // Generate PDF - now with base64 images, we can use useCORS: false and allowTaint: false
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${blog.title.rendered.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: false, // Not needed since we're using base64
          allowTaint: false, // Can be false since images are base64
          logging: true, // Enable logging to debug
          backgroundColor: '#ffffff',
          width: width,
          height: finalHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: width,
          windowHeight: finalHeight,
          x: 0,
          y: 0,
          removeContainer: false,
          onclone: ((clonedDoc: Document) => {
            // Ensure cloned document has proper styling
            const clonedDiv = clonedDoc.getElementById('pdf-content-temp')
            if (clonedDiv) {
              const htmlElement = clonedDiv as HTMLElement
              htmlElement.style.position = 'static'
              htmlElement.style.left = 'auto'
              htmlElement.style.top = 'auto'
              htmlElement.style.opacity = '1'
              htmlElement.style.height = 'auto'
              htmlElement.style.minHeight = 'auto'
            }
          }) as any
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as any }
      }

      // Generate and save PDF
      console.log('Starting PDF generation...')
      await html2pdf().set(opt).from(tempDiv).save()
      console.log('PDF generation completed successfully')

      // Clean up after a short delay to ensure PDF is saved
      setTimeout(() => {
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv)
        }
      }, 1000)
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsDownloading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error || !blog) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>{error || 'Blog not found'}</p>
        <button onClick={() => navigate('/stories-that-inspire')}>Back to Stories</button>
      </div>
    )
  }

  const featuredImage = getFeaturedImageUrl(blog)
  const heroImageUrl = featuredImage || `https://picsum.photos/1440/600?random=${blog.id}`

  return (
    <>
      <SEO
        title={`${blog.title.rendered} - Stories that inspire us`}
        description={extractPlainText(blog.excerpt.rendered) || extractPlainText(blog.content.rendered).substring(0, 160) || 'Read inspiring stories about conservation and environmental action.'}
      />

      {/* Hidden audio element for listen functionality */}
      <audio
        ref={audioRef}
        onEnded={() => setIsAudioPlaying(false)}
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
        onError={(e) => {
          console.error('Audio playback error:', e)
          setIsAudioPlaying(false)
        }}
        style={{ display: 'none' }}
      >
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={styles.blogDetailContainer}>
        {/* Hero Image Section */}
        <section className={styles.heroImageSection}>
          <img
            src={heroImageUrl}
            alt={blog.title.rendered}
            className={styles.heroImage}
          />
        </section>

        {/* Article Header Section */}
        <section className={styles.articleHeaderSection}>
          <div className={styles.articleHeaderContainer}>
            <div className={styles.articleTitleRow}>
              <h1 className={styles.articleTitle}>{blog.title.rendered}</h1>
              <div className={styles.viewsCount}>
                <span className={styles.viewsIcon}>👁</span>
                <span>{formatDate(blog.date)}</span>
              </div>
            </div>

            <div className={styles.articleActionsRow}>
              <button
                className={styles.listenButton}
                onClick={handleListenToArticle}
                aria-label="Listen to this article"
              >
                <img src={playIcon} alt="Play" className={styles.listenButtonIcon} />
                LISTEN TO THIS ARTICLE
              </button>
              <button
                className={`${styles.downloadButton} ${isDownloading ? styles.downloadButtonLoading : ''}`}
                onClick={handleDownload}
                aria-label="Download article"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className={styles.downloadSpinner}></span>
                    DOWNLOADING...
                  </>
                ) : (
                  <>
                DOWNLOAD
                <img src={downloadIcon} alt="Download" className={styles.downloadButtonIcon} />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Article Content Section */}
        <section className={styles.articleContentSection}>
          <div className={styles.articleContentContainer}>
            {/* Main Content */}
            <div className={styles.articleMainContent}>
              <div className={styles.articleText}>
                {blogContent.map((paragraph, index) => {
                  // Check if paragraph starts with a number (numbered list item)
                  const isNumbered = /^\d+\./.test(paragraph)
                  const isBoldHeading = isNumbered && paragraph.includes(':')
                  
                  if (isBoldHeading) {
                    const [heading, ...rest] = paragraph.split(':')
                    return (
                      <div key={index} className={styles.articleParagraph}>
                        <strong className={styles.numberedHeading}>{heading}:</strong>
                        <span>{rest.join(':')}</span>
                      </div>
                    )
                  }
                  
                  return (
                    <p key={index} className={styles.articleParagraph}>
                      {paragraph}
                    </p>
                  )
                })}
              </div>

              {/* Feedback Section */}
              <div className={styles.feedbackSection}>
                <div className={styles.feedbackBox}>
                  <div className={styles.feedbackIcon}>
                    <img src={shareIcon} alt="Share" className={styles.shareIconImage} />
                  </div>
                  <p className={styles.feedbackText}>
                    Did you enjoy this article? Share with friends to inspire positive action.
                  </p>
                  <div className={styles.feedbackAvatar}>
                    <img
                      src={`https://i.pravatar.cc/150?img=${blog.id}`}
                      alt="Author"
                      className={styles.avatarImage}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Section */}
              <div className={styles.navigationSection}>
                {prevPost && (
                  <Link to={`/stories-that-inspire/${prevPost.id}`} className={styles.navLink}>
                    <div className={styles.navImageWrapper}>
                      <img
                        src={getFeaturedImageUrl(prevPost) || `https://picsum.photos/150/150?random=${prevPost.id}`}
                        alt={prevPost.title.rendered}
                        className={styles.navImage}
                      />
                    </div>
                    <div className={styles.navContent}>
                      <span className={styles.navLabel}>← Previous Post</span>
                      <span className={styles.navTitle}>{prevPost.title.rendered}</span>
                    </div>
                  </Link>
                )}
                {nextPost && (
                  <Link to={`/stories-that-inspire/${nextPost.id}`} className={`${styles.navLink} ${styles.navLinkRight}`}>
                    <div className={styles.navContent}>
                      <span className={styles.navLabel}>Next Post →</span>
                      <span className={styles.navTitle}>{nextPost.title.rendered}</span>
                    </div>
                    <div className={styles.navImageWrapper}>
                      <img
                        src={getFeaturedImageUrl(nextPost) || `https://picsum.photos/150/150?random=${nextPost.id}`}
                        alt={nextPost.title.rendered}
                        className={styles.navImage}
                      />
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Tags Cloud Sidebar - Right Side */}
            <aside className={styles.tagsSidebar}>
              <h2 className={styles.tagsHeading}>Tags Cloud</h2>
              <div className={styles.tagsList}>
                {allTags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/stories-that-inspire?tag=${encodeURIComponent(tag.name)}`}
                    className={styles.tagItem}
                  >
                    {tag.name} ({tag.count})
                  </Link>
                ))}
              </div>
            </aside>
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
      </div>
    </>
  )
}

