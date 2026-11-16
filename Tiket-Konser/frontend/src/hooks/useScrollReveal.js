import { useEffect } from 'react'

export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    // If user prefers reduced motion, immediately show everything
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
        el.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          // Once revealed, unobserve to keep animation lightweight
          observer.unobserve(entry.target)
        }
      })
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12,
    })

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
      elements.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          observer.observe(el)
        }
      })
    }

    observeElements()

    // Also observe dynamically added elements
    const mutationObserver = new MutationObserver(() => {
      observeElements()
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export default useScrollReveal
