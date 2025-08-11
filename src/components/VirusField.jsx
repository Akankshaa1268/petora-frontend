import React, { useEffect, useRef } from 'react'

/**
 * VirusField renders a canvas-based particle network effect that looks like a
 * "virus/neurons" cluster. It is designed to be placed inside a relatively
 * positioned wrapper so it can expand beyond the text and blend with it.
 */
function VirusField({ active, mouse }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(0)
  const particlesRef = useRef([])
  const devicePixelRatioSafe = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animationFrameRef.current)
      return
    }

    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const context = canvas.getContext('2d')

    function resizeCanvas() {
      const rect = container.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatioSafe))
      canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatioSafe))
    }

    function createParticles() {
      const numParticlesBase = 60
      const area = canvas.width * canvas.height
      const densityFactor = Math.max(0.6, Math.min(1.4, area / (900 * 900)))
      const numParticles = Math.floor(numParticlesBase * densityFactor)

      particlesRef.current = Array.from({ length: numParticles }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4 * devicePixelRatioSafe,
        vy: (Math.random() - 0.5) * 0.4 * devicePixelRatioSafe,
        r: 1.6 + Math.random() * 1.2,
        hue: 200 + Math.random() * 120, // blue to teal range
        alpha: 0.5 + Math.random() * 0.5
      }))
    }

    function step() {
      const { width, height } = canvas
      context.clearRect(0, 0, width, height)

      // Background glow fade
      context.fillStyle = 'rgba(10,12,24,0.05)'
      context.fillRect(0, 0, width, height)

      // Move
      for (const particle of particlesRef.current) {
        // Mild attraction to mouse
        if (mouse?.inside) {
          const mx = mouse.x * devicePixelRatioSafe
          const my = mouse.y * devicePixelRatioSafe
          const dx = mx - particle.x
          const dy = my - particle.y
          const distSq = dx * dx + dy * dy
          const force = Math.min(0.0025, 45 / (distSq + 2000))
          particle.vx += dx * force
          particle.vy += dy * force
        }

        particle.x += particle.vx
        particle.y += particle.vy

        // friction
        particle.vx *= 0.98
        particle.vy *= 0.98

        // bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1, (particle.x = Math.max(0, Math.min(width, particle.x)))
        if (particle.y < 0 || particle.y > height) particle.vy *= -1, (particle.y = Math.max(0, Math.min(height, particle.y)))
      }

      // Connections
      const maxDist = 110 * devicePixelRatioSafe
      for (let i = 0; i < particlesRef.current.length; i++) {
        const a = particlesRef.current[i]
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const b = particlesRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < maxDist) {
            const t = 1 - d / maxDist
            context.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 90%, 65%, ${0.15 * t})`
            context.lineWidth = 1 * devicePixelRatioSafe
            context.beginPath()
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particlesRef.current) {
        const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8 * devicePixelRatioSafe)
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${0.9 * p.alpha})`)
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        context.fillStyle = gradient
        context.beginPath()
        context.arc(p.x, p.y, p.r * devicePixelRatioSafe, 0, Math.PI * 2)
        context.fill()
      }

      animationFrameRef.current = requestAnimationFrame(step)
    }

    resizeCanvas()
    createParticles()
    animationFrameRef.current = requestAnimationFrame(step)
    const onResize = () => {
      resizeCanvas()
      createParticles()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [active, mouse?.inside, mouse?.x, mouse?.y, devicePixelRatioSafe])

  return (
    <div ref={containerRef} className="virus-layer">
      <canvas ref={canvasRef} className="virus-canvas" />
    </div>
  )
}

export default VirusField