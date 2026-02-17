'use client'

import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  // Fetch gallery images from database (with fallback if Supabase not configured)
  const [galleryImages, setGalleryImages] = useState([
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb0537bf?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1935&auto=format&fit=crop'
  ])

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const supabase = createClient()
        const { data: galleryData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'gallery_images')
          .single()

        if (galleryData?.value) {
          setGalleryImages(galleryData.value as string[])
        }
      } catch (error) {
        // Supabase not configured or error fetching - use default images
      }
    }

    fetchGallery()
  }, [])


  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />

      {/* Short About/Trust Section */}
      <section className="py-24 bg-emerald-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-5xl mb-6">Purity. Trust. Tradition.</h2>
          <p className="text-emerald-100/80 text-lg leading-relaxed mb-10">
            At Mahi Fashion Jewellery, we believe that jewellery is more than just an accessory. It is an investment, a heritage, and a statement of who you are.
            All our gold is Hallmark certified and our diamonds are ethically sourced.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-emerald-800 rounded-sm">
              <h3 className="font-serif text-xl text-accent mb-2">BIS Hallmarked</h3>
              <p className="text-sm text-emerald-200/60">Guaranteed purity in every piece.</p>
            </div>
            <div className="p-6 border border-emerald-800 rounded-sm">
              <h3 className="font-serif text-xl text-accent mb-2">Lifetime Exchange</h3>
              <p className="text-sm text-emerald-200/60">Easy exchange and buyback policies.</p>
            </div>
            <div className="p-6 border border-emerald-800 rounded-sm">
              <h3 className="font-serif text-xl text-accent mb-2">Free Insurance</h3>
              <p className="text-sm text-emerald-200/60">One year complimentary insurance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram/Gallery Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-foreground mb-12">@MahiFashionJewellery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {galleryImages.slice(0, 4).map((imageUrl, index) => (
              <div key={index} className="relative aspect-square bg-gray-200 rounded-sm overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
