"use client"

import type React from "react"

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
  style?: React.CSSProperties
}

export default function ClientImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  fallbackSrc = "/placeholder.svg?height=200&width=300",
  priority = false,
  sizes,
  quality,
  placeholder,
  blurDataURL,
  style,
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

  const imageProps = {
    src: imgSrc || "/placeholder.svg",
    alt,
    className,
    onError: handleError,
    priority,
    sizes,
    quality,
    placeholder,
    blurDataURL,
    style,
    ...props,
  }

  if (fill) {
    return <Image {...imageProps} fill />
  }

  return <Image {...imageProps} width={width || 300} height={height || 200} />
}
