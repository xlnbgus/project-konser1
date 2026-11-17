import { useState, useEffect, useRef } from 'react'

export default function CountUpNumber({ value = '0', duration = 1600, className = '', style = {} }) {
  const [displayValue, setDisplayValue] = useState('0')
  const elementRef = useRef(null)

  // Parse value string into numerical target, decimal info, prefix, suffix, and formatting
  const parseValue = (raw) => {
    const str = String(raw || '').trim()

    // Check for rating pattern like "4.9★" or "4.9/5" or "5.0★"
    const decimalMatch = str.match(/^([^\d]*)(\d+[.,]\d+)(.*)$/)
    if (decimalMatch) {
      const prefix = decimalMatch[1]
      const num = parseFloat(decimalMatch[2].replace(',', '.'))
      const suffix = decimalMatch[3]
      return { target: num, prefix, suffix, isDecimal: true, hasThousands: false }
    }

    // Check for thousands with dot like "50.000+"
    const thousandsMatch = str.match(/^([^\d]*)(\d{1,3}(?:\.\d{3})+)(.*)$/)
    if (thousandsMatch) {
      const prefix = thousandsMatch[1]
      const num = parseInt(thousandsMatch[2].replace(/\./g, ''), 10)
      const suffix = thousandsMatch[3]
      return { target: num, prefix, suffix, isDecimal: false, hasThousands: true }
    }

    // Standard integer like "35K+", "500+", "40K"
    const intMatch = str.match(/^([^\d]*)(\d+)(.*)$/)
    if (intMatch) {
      const prefix = intMatch[1]
      const num = parseInt(intMatch[2], 10)
      const suffix = intMatch[3]
      return { target: num, prefix, suffix, isDecimal: false, hasThousands: false }
    }

    return { target: 0, prefix: '', suffix: str, isDecimal: false, hasThousands: false }
  }

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // If reduced motion is preferred, immediately show final value
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value)
      return
    }

    const { target, prefix, suffix, isDecimal, hasThousands } = parseValue(value)

    let animationFrameId
    const startAnimation = () => {
      const startTime = performance.now()

      const animate = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / duration)

        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3)
        const currentVal = target * ease

        let formatted
        if (isDecimal) {
          formatted = currentVal.toFixed(1)
        } else if (hasThousands) {
          formatted = Math.round(currentVal).toLocaleString('id-ID')
        } else {
          formatted = Math.round(currentVal)
        }

        setDisplayValue(`${prefix}${formatted}${suffix}`)

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation()
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -20px 0px',
    })

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [value, duration])

  return (
    <span ref={elementRef} className={className} style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', ...style }}>
      {displayValue || value}
    </span>
  )
}
