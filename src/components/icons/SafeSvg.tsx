import React, { useMemo } from "react";
import { extractInnerSvg } from "@/lib/icon-sanitizer";
import { cn } from "@/lib/cn";

export interface SafeSvgProps extends React.SVGAttributes<SVGSVGElement> {
  svgContent: string;
  viewBox?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}

export const SafeSvg: React.FC<SafeSvgProps> = React.memo(
  ({
    svgContent,
    viewBox = "0 0 24 24",
    size = 24,
    color = "currentColor",
    strokeWidth = 2,
    strokeLinecap = "round",
    strokeLinejoin = "round",
    rotation = 0,
    flipX = false,
    flipY = false,
    className,
    style,
    ...rest
  }) => {
    // Extract and sanitize inner SVG children safely
    const sanitizedInner = useMemo(() => {
      return extractInnerSvg(svgContent);
    }, [svgContent]);

    const transformStyles = useMemo(() => {
      const transforms: string[] = [];
      if (rotation) transforms.push(`rotate(${rotation}deg)`);
      if (flipX) transforms.push("scaleX(-1)");
      if (flipY) transforms.push("scaleY(-1)");
      return transforms.length > 0 ? transforms.join(" ") : undefined;
    }, [rotation, flipX, flipY]);

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        className={cn("inline-block shrink-0 select-none", className)}
        style={{
          transform: transformStyles,
          transformOrigin: "center center",
          ...style,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedInner }}
        {...rest}
      />
    );
  }
);

SafeSvg.displayName = "SafeSvg";
