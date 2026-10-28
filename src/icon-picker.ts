// Separate entry point so the picker stays out of the root bundle. Icons load
// on demand through DynamicIcon; search tags load when a picker mounts.
// Import from "@bernardoestrada/design-system/icon-picker".
export { IconPicker, searchIcons, preloadIconTags, type IconSource, type IconEntry } from "./components/IconPicker/IconPicker";
export { DynamicIcon, iconNames, type IconName, type DynamicIconProps } from "./components/DynamicIcon/DynamicIcon";
