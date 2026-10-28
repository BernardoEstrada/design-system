import { forwardRef, useEffect, useState, type JSX } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import {
  DynamicIcon as LucideDynamicIcon,
  iconNames as lucideIconNames,
  type IconName as LucideIconName,
} from "lucide-react/dynamic";
import { labIconNames, type LabIconName } from "../../icons/lab-names";

/** Any Lucide (including aliases) or Lucide Lab icon name, in kebab-case. */
export type IconName = LucideIconName | LabIconName;

export const iconNames: IconName[] = [...lucideIconNames, ...labIconNames];

export interface DynamicIconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
  /** Rendered while the icon loads, or when the name is unknown. */
  fallback?: () => JSX.Element | null;
}

const lucideSet = new Set<string>(lucideIconNames);
const labSet = new Set<string>(labIconNames);

// All lab icons live in one chunk, loaded the first time any lab icon renders.
let labModule: Promise<Record<string, LucideIcon>> | undefined;
const loadLab = () => (labModule ??= import("../../icons/lab").then((m) => m.labIcons as Record<string, LucideIcon>));

const LabDynamicIcon = forwardRef<SVGSVGElement, DynamicIconProps>(function LabDynamicIcon(
  { name, fallback: Fallback, ...props },
  ref,
) {
  const [Icon, setIcon] = useState<LucideIcon>();
  useEffect(() => {
    let ignore = false;
    loadLab().then((icons) => {
      if (!ignore) setIcon(() => icons[name]);
    });
    return () => {
      ignore = true;
    };
  }, [name]);
  if (!Icon) return Fallback ? <Fallback /> : null;
  return <Icon ref={ref} {...props} />;
});

/**
 * Render a Lucide or Lucide Lab icon by name, loading it on demand.
 * Same API as lucide-react's DynamicIcon, plus lab icons.
 * Prefer static imports from "/icons" when the icon is known at build time.
 */
export const DynamicIcon = forwardRef<SVGSVGElement, DynamicIconProps>(function DynamicIcon(props, ref) {
  if (lucideSet.has(props.name)) {
    return <LucideDynamicIcon ref={ref} {...props} name={props.name as LucideIconName} />;
  }
  if (labSet.has(props.name)) return <LabDynamicIcon ref={ref} {...props} />;
  const Fallback = props.fallback;
  return Fallback ? <Fallback /> : null;
});
