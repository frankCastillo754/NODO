'use client'

import { useState } from 'react'

export interface ProductItem {
  name: string
  iconKey: 'hamburger' | 'steak' | 'sausage' | 'chickenBurger' | 'nugget' | 'sandwich'
}

const IconMap: Record<ProductItem['iconKey'], React.ReactNode> = {
  hamburger: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-palette-icon-placeholder">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  steak: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8">
      <path d="M12 4L4 14h4l2 6 2-6h4L12 4z" fill="#b91c1c" />
    </svg>
  ),
  sausage: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8">
      <ellipse cx="12" cy="12" rx="8" ry="4" fill="#b91c1c" />
    </svg>
  ),
  chickenBurger: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-palette-icon-placeholder">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  nugget: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8">
      <path d="M8 8h8v8H8z" fill="#ea580c" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  sandwich: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-palette-icon-placeholder">
      <rect x="4" y="8" width="16" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
}

interface ProductCarouselProps {
  title: string
  products: ProductItem[]
  cardClassName: string
}

export function ProductCarousel({ title, products, cardClassName }: ProductCarouselProps) {
  const [current, setCurrent] = useState(0)
  const step = 3
  const maxIndex = Math.max(0, Math.ceil(products.length / step) - 1)

  const slice = products.slice(current * step, current * step + step)

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-palette-accent">{title}</h2>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrent((i) => Math.max(0, i - 1))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-palette-border bg-white text-palette-text-primary transition hover:bg-palette-background-secondary"
          aria-label="Anterior"
        >
          <span className="text-lg">‹</span>
        </button>
        <div className="flex flex-1 gap-4 overflow-hidden">
          {slice.map((item, i) => (
            <div
              key={i}
              className={`flex min-w-[140px] flex-1 flex-col items-center gap-2 rounded-lg border border-palette-border p-4 ${cardClassName}`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-palette-icon-placeholder">
                {IconMap[item.iconKey]}
              </div>
              <span className="text-center text-sm font-medium text-palette-text-primary">
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCurrent((i) => Math.min(maxIndex, i + 1))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-palette-border bg-white text-palette-text-primary transition hover:bg-palette-background-secondary"
          aria-label="Siguiente"
        >
          <span className="text-lg">›</span>
        </button>
      </div>
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === current ? 'bg-palette-accent w-3' : 'bg-palette-border'
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
