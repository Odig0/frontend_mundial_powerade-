'use client'

import Image from 'next/image'

interface NewsDetailProps {
  title: string
  date: string
  image: string
  category: string
  intro: string
  content: string
}

export default function NewsDetail({
  title,
  date,
  image,
  category,
  intro,
  content,
}: NewsDetailProps) {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-block px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded mb-4">
          {category}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">{title}</h1>
        <p className="text-muted-foreground text-sm">{date}</p>
      </div>

      {/* Featured image */}
      <div className="relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-lg mb-8 bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Intro */}
      <div className="text-lg md:text-xl text-foreground mb-6 leading-relaxed font-semibold">
        {intro}
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <div
          className="text-foreground leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  )
}
