"use client"

import Image from "next/image"
import { useState } from "react"

interface ClientImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallbackSrc?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export default function ClientImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  fallbackSrc = "/placeholder.svg?height=200&width=300",
  priority,
  sizes,
  quality,
  placeholder,
  blurDataURL,
  ...props
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onError={handleError}
      priority={priority}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      {...props}
    />
  )
}
