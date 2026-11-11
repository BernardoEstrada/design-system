import { useId, type CSSProperties, type ReactNode } from "react";
import { cx } from "../../utils/cx";

/**
 * Icon masks used by launchers, in a 0..1 box (SVG objectBoundingBox units).
 * Approximations of what each platform applies to a full-bleed (maskable) icon.
 */
export const ICON_SHAPES = {
  ios: {
    label: "iOS",
    // Continuous-corner ("squircle-ish") rounded square, ~22.4% corner radius like iOS app icons.
    path: "M0.3125,0 H0.6875 C0.8889,0 0.9445,0 0.9722,0.0278 C1,0.0555 1,0.1111 1,0.3125 V0.6875 C1,0.8889 1,0.9445 0.9722,0.9722 C0.9445,1 0.8889,1 0.6875,1 H0.3125 C0.1111,1 0.0555,1 0.0278,0.9722 C0,0.9445 0,0.8889 0,0.6875 V0.3125 C0,0.1111 0,0.0555 0.0278,0.0278 C0.0555,0 0.1111,0 0.3125,0 Z",
  },
  circle: { label: "Circle", path: "M0.5,0 A0.5,0.5 0 1 1 0.5,1 A0.5,0.5 0 1 1 0.5,0 Z" },
  squircle: {
    label: "Squircle",
    path: "M0.5,0 C0.9,0 1,0.1 1,0.5 C1,0.9 0.9,1 0.5,1 C0.1,1 0,0.9 0,0.5 C0,0.1 0.1,0 0.5,0 Z",
  },
  rounded: {
    label: "Rounded",
    path: "M0.16,0 H0.84 A0.16,0.16 0 0 1 1,0.16 V0.84 A0.16,0.16 0 0 1 0.84,1 H0.16 A0.16,0.16 0 0 1 0,0.84 V0.16 A0.16,0.16 0 0 1 0.16,0 Z",
  },
  teardrop: {
    label: "Teardrop",
    path: "M0.5,0 H1 V0.5 A0.5,0.5 0 1 1 0.5,0 Z",
  },
  square: { label: "Square", path: "M0,0 H1 V1 H0 Z" },
} as const;

export type IconShape = keyof typeof ICON_SHAPES;
export const ICON_SHAPE_NAMES = Object.keys(ICON_SHAPES) as IconShape[];

interface MaskableIconProps {
  /** Image URL (data:, blob: or http). Rendered full-bleed unless `padding` is set. */
  src: string;
  shape?: IconShape;
  /** Pixel size of the rendered icon. */
  size?: number;
  /** Fill behind the image, e.g. "#ffffff". Transparent by default. */
  background?: string;
  /** Inset of the image on each side, as a fraction of the size (0–0.45). */
  padding?: number;
  /** Draw the maskable safe zone (centre circle, 80% diameter). */
  showSafeZone?: boolean;
  alt?: string;
  className?: string;
}

/** One icon clipped to a launcher shape. Renders the same geometry a server compositor would. */
export function MaskableIcon({
  src,
  shape = "ios",
  size = 96,
  background,
  padding = 0,
  showSafeZone = false,
  alt = "",
  className,
}: MaskableIconProps) {
  const clipId = useId().replace(/:/g, "");
  const inset = Math.max(0, Math.min(0.45, padding));
  const style: CSSProperties = { width: size, height: size };
  return (
    <svg viewBox="0 0 1 1" style={style} className={cx("shrink-0", className)} role="img" aria-label={alt || undefined}>
      <defs>
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={ICON_SHAPES[shape].path} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="1" height="1" fill={background ?? "transparent"} />
        <image
          href={src}
          x={inset}
          y={inset}
          width={1 - inset * 2}
          height={1 - inset * 2}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
      {showSafeZone && (
        <circle cx="0.5" cy="0.5" r="0.4" fill="none" stroke="currentColor" strokeWidth={2 / size} strokeDasharray={`${6 / size} ${4 / size}`} opacity="0.8" />
      )}
    </svg>
  );
}

interface MaskablePreviewProps extends Omit<MaskableIconProps, "shape" | "size" | "className"> {
  shapes?: IconShape[];
  size?: number;
  /** Optional caption under each icon; defaults to the shape label. */
  caption?: (shape: IconShape) => ReactNode;
  className?: string;
}

/** A row of the same icon in several launcher shapes, like maskable-icon editors show. */
export function MaskablePreview({ shapes = ICON_SHAPE_NAMES, size = 72, caption, className, ...icon }: MaskablePreviewProps) {
  return (
    <div className={cx("flex flex-wrap gap-4", className)}>
      {shapes.map((s) => (
        <figure key={s} className="flex flex-col items-center gap-1">
          <MaskableIcon {...icon} shape={s} size={size} />
          <figcaption className="text-xs opacity-70">{caption ? caption(s) : ICON_SHAPES[s].label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
