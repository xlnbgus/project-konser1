import { useEffect } from 'react'

const SELECTORS = '.reveal, .reveal-section, .reveal-scale, .reveal-left, .reveal-right'

export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    // If user prefers reduced motion, immediately show everything
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      document.querySelectorAll(SELECTORS).forEach(el => {
        el.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          // Once revealed, unobserve to keep scroll butter smooth
          observer.unobserve(entry.target)
        }
      })
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    })

    const observeElements = () => {
      const elements = document.querySelectorAll(SELECTORS)
      elements.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          observer.observe(el)
        }
      })
    }

    observeElements()

    // Also observe dynamically loaded or re-rendered elements
    const mutationObserver = new MutationObserver(() => {
      observeElements()
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    // Global smooth anchor scroll handler with offset for fixed navbar
    const handleAnchorClick = (e) => {
      const targetAnchor = e.target.closest('a[href^="#"]')
      if (!targetAnchor) return

      const href = targetAnchor.getAttribute('href')
      if (!href || href === '#' || href === '#!') return

      const targetEl = document.querySelector(href)
      if (targetEl) {
        e.preventDefault()
        const navHeight = 70
        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = Math.max(0, elementPosition - navHeight)

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      document.removeEventListener('click', handleAnchorClick)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export default useScrollReveal
