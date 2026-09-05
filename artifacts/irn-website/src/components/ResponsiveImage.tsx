import type { ImgHTMLAttributes } from "react";
import { responsiveImages } from "@/data/responsive-images.generated";

/** Responsive delivery of the existing artwork, with the original as fallback. */
export function ResponsiveImage({
  src,
  srcSet,
  sizes,
  width,
  height,
  decoding = "async",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const image = src ? responsiveImages[src] : undefined;
  return (
    <img
      {...props}
      src={image?.src ?? src}
      srcSet={srcSet ?? image?.srcSet}
      sizes={
        sizes ??
        (image ? "(min-width: 1280px) 1120px, calc(100vw - 48px)" : undefined)
      }
      width={width ?? image?.width}
      height={height ?? image?.height}
      decoding={decoding}
    />
  );
}
