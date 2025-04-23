"use client";

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Typography variants with specific font sizes, weights, and styles.
 * Each variant corresponds to a unique combination of font weight and size.
 */
type TypographyVariant =
  /** Bold H1: 30px (mobile) / 39px (desktop), 140% line height */
  | "Bold_H1"
  /** Bold H2: 25px (mobile) / 31px (desktop), 140% line height */
  | "Bold_H2"
  /** Bold H3: 20px (mobile) / 25px (desktop), 140% line height */
  | "Bold_H3"
  /** Bold H4: 16px (mobile) / 20px (desktop), 140% line height */
  | "Bold_H4"
  /** Bold H5: 14px (mobile) / 16px (desktop), 140% line height */
  | "Bold_H5"
  /** Bold H6: 13px (mobile) / 14px (desktop), 140% line height */
  | "Bold_H6"
  /** Bold H7: 12px (mobile) / 13px (desktop), 140% line height */
  | "Bold_H7"
  /** SemiBold H1: 30px (mobile) / 39px (desktop), 140% line height */
  | "SemiBold_H1"
  /** SemiBold H2: 25px (mobile) / 31px (desktop), 140% line height */
  | "SemiBold_H2"
  /** SemiBold H3: 20px (mobile) / 25px (desktop), 140% line height */
  | "SemiBold_H3"
  /** SemiBold H4: 16px (mobile) / 20px (desktop), 140% line height */
  | "SemiBold_H4"
  /** SemiBold H5: 14px (mobile) / 16px (desktop), 140% line height */
  | "SemiBold_H5"
  /** SemiBold H6: 13px (mobile) / 14px (desktop), 140% line height */
  | "SemiBold_H6"
  /** SemiBold H7: 12px (mobile) / 13px (desktop), 140% line height */
  | "SemiBold_H7"
  /** Medium H1: 30px (mobile) / 39px (desktop), 140% line height */
  | "Medium_H1"
  /** Medium H2: 25px (mobile) / 31px (desktop), 140% line height */
  | "Medium_H2"
  /** Medium H3: 20px (mobile) / 25px (desktop), 140% line height */
  | "Medium_H3"
  /** Medium H4: 16px (mobile) / 20px (desktop), 140% line height */
  | "Medium_H4"
  /** Medium H5: 14px (mobile) / 16px (desktop), 140% line height */
  | "Medium_H5"
  /** Medium H6: 13px (mobile) / 14px (desktop), 140% line height */
  | "Medium_H6"
  /** Medium H7: 12px (mobile) / 13px (desktop), 140% line height */
  | "Medium_H7"
  /** Regular H1: 30px (mobile) / 39px (desktop), 140% line height */
  | "Regular_H1"
  /** Regular H2: 25px (mobile) / 31px (desktop), 140% line height */
  | "Regular_H2"
  /** Regular H3: 20px (mobile) / 25px (desktop), 140% line height */
  | "Regular_H3"
  /** Regular H4: 16px (mobile) / 20px (desktop), 140% line height */
  | "Regular_H4"
  /** Regular H5: 14px (mobile) / 16px (desktop), 140% line height */
  | "Regular_H5"
  /** Regular H6: 13px (mobile) / 14px (desktop), 140% line height */
  | "Regular_H6"
  /** Regular H7: 12px (mobile) / 13px (desktop), 140% line height */
  | "Regular_H7";

/**
 * Animation type for the typography component.
 * - "move": Adds movement animation.
 * - "underline": Adds an underline animation.
 */
type TypographyAnimation = "move" | "underline";

/**
 * Navigation direction for the link when `navigate` is used.
 * - "forward": Navigate forward.
 * - "back": Navigate back.
 */
type LinkDirection = "forward" | "back";

/**
 * Props for the Typography component.
 */
interface TypographyProps {
  
  /** Typography variant defining font size, weight, and style */
  variant: TypographyVariant;
  /** Content to be displayed inside the typography component */
  children: ReactNode;
  /** Additional CSS classes for custom styling */
  className?: string;
  /** Maximum number of lines to display (for line clamping) */
  maxLines?: number;
  /** Link direction, used for navigation on click */
  navigate?: LinkDirection;
  /** Link URL if typography is used as a link */
  link?: string;
  /** Target for link, like "_blank" for new tab */
  target?: string;
  /** Animation type for the typography component */
  animate?: TypographyAnimation;
  /** Disable text selection */
  disableSelect?: boolean;
  /** Click handler function */
  onClick?: () => void;
  /** Custom color for the label text */
  labelColor?: string;
}

/**
 * Typography component for rendering styled text based on variant types.
 * Supports optional animations, link navigation, and color customization.
 */
export const Typography: FC<TypographyProps> = ({
  variant,
  children,
  className = "",
  maxLines = 0,
  disableSelect = false,
  labelColor,
  onClick,
  ...props
}) => {
  const getFontWeight = (variant: TypographyVariant): string => {
    if (variant.startsWith("Bold")) {
      return "font-bold";
    } else if (variant.startsWith("SemiBold")) {
      return "font-semibold";
    } else if (variant.startsWith("Medium")) {
      return "font-medium";
    } else if (variant.startsWith("Regular")) {
      return "font-normal";
    } else {
      return "font-normal";
    }
  };

  const getStyleClasses = (variant: TypographyVariant): string => {
    let fontSizeClass = "";
    const lineHeightClass = "leading-[140%]";
    const fontWeightClass = getFontWeight(variant);

    switch (variant) {
      case "Bold_H1":
      case "SemiBold_H1":
      case "Medium_H1":
      case "Regular_H1":
        fontSizeClass = "text-[1.9375rem] md:text-[3.0625rem]";
        break;
      case "Bold_H2":
      case "SemiBold_H2":
      case "Medium_H2":
      case "Regular_H2":
        fontSizeClass = "text-[1.9375rem] md:text-[2.4375rem]";
        break;
      case "Bold_H3":
      case "SemiBold_H3":
      case "Medium_H3":
      case "Regular_H3":
        fontSizeClass = "text-[1.5625rem] md:text-[1.9375rem]";
        break;
      case "Bold_H4":
      case "SemiBold_H4":
      case "Medium_H4":
      case "Regular_H4":
        fontSizeClass = "text-[1.25rem] md:text-[1.5625rem]";
        break;
      case "Bold_H5":
      case "SemiBold_H5":
      case "Medium_H5":
      case "Regular_H5":
        fontSizeClass = "text-[1rem] md:text-[1.125rem]";
        break;
      case "Bold_H6":
      case "SemiBold_H6":
      case "Medium_H6":
      case "Regular_H6":
        fontSizeClass = "text-[0.875rem] md:text-[1rem]";
        break;
      case "Bold_H7":
      case "SemiBold_H7":
      case "Medium_H7":
      case "Regular_H7":
        fontSizeClass = "text-[0.75rem] md:text-[0.8125rem]";
        break;
      default:
        fontSizeClass = "text-base";
    }

    return `${fontSizeClass} ${lineHeightClass} ${fontWeightClass}`;
  };

  const styleClasses = getStyleClasses(variant);

  return (
    <span
      className={cn(
        "block",
        styleClasses,
        className
      )}
      style={{
        userSelect: disableSelect ? "none" : "auto",
        color: labelColor,
        WebkitLineClamp: maxLines > 0 ? maxLines : undefined,
        display: maxLines > 0 ? "-webkit-box" : undefined,
        WebkitBoxOrient: maxLines > 0 ? "vertical" : undefined,
        overflow: maxLines > 0 ? "hidden" : undefined,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  );
};
