/**
 * MSMEBrands Categories Section Component
 * Circular clock-style layout with center image
 * Fetches dynamic categories via CategoryService
 *
 * CLIENT COMPONENT for dynamic import compatibility
 * - Loads categories via CategoryService.getRootCategories()
 * - Shows loading skeleton while fetching
 *
 * Design: Categories arranged in a circle around center image
 * Inspired by food/cuisine wheel design pattern
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

// Calculate circular positions using trigonometry
// Radius is 50% of container (items at edge)
const getCircularPosition = (index: number, total: number) => {
  const angleOffset = -90 // Start from top
  const angleDeg = angleOffset + (index * 360) / total
  const angleRad = (angleDeg * Math.PI) / 180
  const radius = 42 // % from center
  
  // Calculate position as percentage from center (50%, 50%)
  const x = 50 + radius * Math.cos(angleRad)
  const y = 50 + radius * Math.sin(angleRad)
  
  return { x, y, angleDeg }
}

export interface CategoryResponse {
    id: string
    name: string
    slug: string
    level: number
    parentId?: string
    icon?: string
    description?: string
    displayOrder: number
    trademarkClasses: number[]
    children: CategoryResponse[]
    createdAt: string
    updatedAt: string
}
// ===== SUB-COMPONENTS =====

/** Section header */
function SectionHeader() {
  return (
    <div className="text-center mb-8">
      <p className="font-condensed text-sm text-slate-500 font-semibold tracking-widest uppercase mb-3">
        Explore
      </p>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-ui-primary mb-4">
        Business Categories
      </h2>
      <p className="font-body text-slate-500 max-w-lg mx-auto">
        Find verified businesses across diverse industry verticals
      </p>
    </div>
  )
}

/** Single category card positioned around the circle */
function CategoryCard({ 
  id,
  name, 
  description,
  slug,
  index,
  total,
  isHighlighted
}: { 
  id: string
  name: string
  description?: string
  slug: string
  index: number
  total: number
  isHighlighted: boolean
}) {
  const pos = getCircularPosition(index, total)
  
  // Determine text alignment based on position
  // Left side (x < 50): align right, Right side (x > 50): align left, Center: center
  const isLeftSide = pos.x < 40
  const isRightSide = pos.x > 60
  const textAlign = isLeftSide ? 'text-right' : isRightSide ? 'text-left' : 'text-center'
  
  // Offset the card so it doesn't overlap the circle edge
  // Left side: offset left, Right side: offset right
  const translateX = isLeftSide ? '-100%' : isRightSide ? '0%' : '-50%'
  const translateY = '-50%'
  
  return (
    <Link 
      href={`/categories/${slug}`}
      className={`absolute w-48 group ${textAlign} rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(${translateX}, ${translateY})`,
      }}
    >
      <h3 className={`font-heading text-md md:text-xl font-bold uppercase tracking-tight mb-1 transition-colors duration-200 ${
        isHighlighted 
          ? 'text-slate-900' 
          : 'text-slate-500 group-hover:text-slate-700'
      }`}>
        {name}
      </h3>
      {description && (
        <p className={`font-body text-md leading-tight tracking-tight transition-colors duration-200 ${
          isHighlighted 
            ? 'text-slate-600' 
            : 'text-slate-400 group-hover:text-slate-500'
        }`}>
          {description}
        </p>
      )}
    </Link>
  )
}

/** Center image with circular glow */
function CenterImage() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-100 to-stone-200/50 shadow-2xl" />
      
      {/* Inner white ring */}
      <div className="absolute inset-4 rounded-full bg-white shadow-inner" />
      
      {/* Center image */}
      <div className="absolute inset-8 rounded-full overflow-hidden">
        <Image
          src="/images/circle-category.png"
          alt="Business Categories"
          fill
          className="object-cover"
          priority
        />
      </div>
      
    </div>
  )
}

/** Skeleton card for a single circular position */
function SkeletonCategoryCard({ index, total }: { index: number; total: number }) {
  const pos = getCircularPosition(index, total)
  const isLeftSide = pos.x < 40
  const isRightSide = pos.x > 60
  const textAlign = isLeftSide ? 'text-right' : isRightSide ? 'text-left' : 'text-center'
  const translateX = isLeftSide ? '-100%' : isRightSide ? '0%' : '-50%'
  const translateY = '-50%'

  return (
    <div
      className={`absolute w-48 ${textAlign} animate-pulse`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(${translateX}, ${translateY})`,
      }}
    >
      <div className={`h-5 rounded bg-slate-200 mb-2 ${isLeftSide ? 'ml-auto' : ''}`} style={{ width: `${60 + (index % 3) * 15}%` }} />
      <div className={`h-3 rounded bg-slate-100 ${isLeftSide ? 'ml-auto' : ''}`} style={{ width: `${75 + (index % 2) * 10}%` }} />
    </div>
  )
}

/** Desktop circular skeleton — matches the real layout shape */
function CategoriesSkeleton() {
  const skeletonCount = 10
  return (
    <>
      {/* Desktop: circular skeleton */}
      <div className="hidden lg:flex justify-center mt-12">
        <div style={{ width: '600px', height: '600px' }} className="relative">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCategoryCard key={`skel-${i}`} index={i} total={skeletonCount} />
          ))}
          {/* Center circle skeleton */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200/50 shadow-2xl animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-white shadow-inner" />
            <div className="absolute inset-8 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
      {/* Mobile: grid skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`mob-skel-${i}`} className="p-4 rounded-xl bg-white border border-slate-100 animate-pulse">
            <div className="h-4 rounded bg-slate-200 mb-2 w-3/4" />
            <div className="h-3 rounded bg-slate-100 w-full" />
          </div>
        ))}
      </div>
    </>
  )
}

/** Mobile-friendly grid layout */
function MobileCategories({ categories, highlightedId }: { categories: CategoryResponse[], highlightedId?: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:hidden">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        >
          <h3 className="font-heading text-sm font-bold text-slate-700 group-hover:text-slate-900 mb-1 uppercase tracking-wide">
            {category.name}
          </h3>
          {category.description && (
            <p className="font-body text-xs text-slate-400 line-clamp-2">
              {category.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}

// ===== MAIN COMPONENT (Client Component) =====

export function MSMECategoriesSection() {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchingRef = useRef(false)
  const highlightedCategory = 'retail' // Default highlight
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05, rootMargin: '200px 0px 0px 0px' })

  // Lazy load: fetch categories only when section scrolls into view
  // Uses ref instead of state to prevent React StrictMode race condition
  useEffect(() => {
    if (!isVisible || fetchingRef.current) return

    fetchingRef.current = true
    let active = true

    function fetchCategories() {
      try {
        const data: CategoryResponse[] = [
          {
            id: '1',
            name: 'Retail',
            slug: 'retail',
            level: 1,
            displayOrder: 1,
            trademarkClasses: [35],
            children: [],
            createdAt: '',
            updatedAt: '',
          },
          {
            id: '2',
            name: 'Food & Beverage',
            slug: 'food-beverage',
            level: 1,
            displayOrder: 2,
            trademarkClasses: [43],
            children: [],
            createdAt: '',
            updatedAt: '',
          },
            {
                id: '3',
                name: 'Health & Wellness',
                slug: 'health-wellness',
                level: 1,
                displayOrder: 3,
                trademarkClasses: [44],
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
            {
                id: '4',
                name: 'Technology',
                slug: 'technology',
                level: 1,
                displayOrder: 4,
                trademarkClasses: [9],
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
            {
                id: '5',
                name: 'Education',
                slug: 'education',
                level: 1,
                displayOrder: 5,
                trademarkClasses: [41],
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
            {
                id: '6',
                name: 'Finance',
                slug: 'finance',
                level: 1,
                displayOrder: 6,
                trademarkClasses: [36],
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
            {
                id: '7',
                name: 'Movies & Entertainment',
                slug: 'Movies',
                level: 1,
                displayOrder: 7,
                trademarkClasses: [36],
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
            {
                id: '8',
                name: 'Agriculture',
                slug: 'agriculture',
                level: 1,           
                displayOrder: 8,
                trademarkClasses: [31],
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
            {
                id: '9',
                name: 'Manufacturing',
                slug: 'manufacturing',
                level: 1,           
                displayOrder: 9,
                trademarkClasses: [40],             
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
            {
                id: '10',
                name: 'Transportation & Logistics',
                slug: 'transportation-logistics',
                level: 1,           
                displayOrder: 10,
                trademarkClasses: [39],
                children: [],
                createdAt: '',                     
                updatedAt: '',      
            },
        ]       
        if (active) setCategories(data)
      } catch {
        // Fail gracefully — service already logs errors
      } finally {
        if (active) setIsLoading(false)
      }
    }
    fetchCategories()
    return () => { 
      active = false
      // Reset ref so StrictMode remount can re-fetch
      fetchingRef.current = false
    }
  }, [isVisible])
  
  // Render even with empty categories - shows section structure
  return (
    <section ref={ref} id="categories" className={`py-20 px-6 bg-transparent overflow-visible transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} aria-label="Explore categories">
      <div className="max-w-4xl mx-auto">
        <SectionHeader />
        
        {isLoading ? (
          <CategoriesSkeleton />
        ) : categories.length === 0 ? (
          <div className="text-center text-slate-400 mt-8">
            <p>Categories coming soon...</p>
          </div>
        ) : (
          <>
            {/* Desktop: Circular layout - square container for true circle */}
            <div className="hidden lg:flex justify-center mt-12">
              <div style={{ width: `${Math.min(700, 600)}px`, height: `${Math.min(700, 600)}px` }} className="relative">
                {/* Categories positioned around */}
                {categories.slice(0, 10).map((category, index) => (
                  <CategoryCard 
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description={category.description}
                    slug={category.slug}
                    index={index}
                    total={Math.min(categories.length, 10)}
                    isHighlighted={category.slug === highlightedCategory}
                  />
                ))}
                
                {/* Center image */}
                <CenterImage />
              </div>
            </div>
            
            {/* Mobile: Grid layout */}
            <MobileCategories categories={categories} highlightedId={highlightedCategory} />
          </>
        )}
      </div>
    </section>
  )
}
function useScrollReveal(arg0: { threshold: number; rootMargin: string }): { ref: any; isVisible: any } {
    return { ref: null, isVisible: true }
}

