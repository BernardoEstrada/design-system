// Separate entry point so the picker stays out of the root bundle. Icons load
// on demand through DynamicIcon; the search index (tags, categories, aliases) loads when a picker mounts.
// Import from "@bernardoestrada/design-system/icon-picker".
export {
  IconPicker,
  searchIcons,
  preloadIconSearch,
  preloadIconTags,
  iconCategories,
  type IconCategory,
  type IconSource,
  type IconEntry,
  type SearchIconsOptions,
} from "./components/IconPicker/IconPicker";
export { DynamicIcon, iconNames, type IconName, type DynamicIconProps } from "./components/DynamicIcon/DynamicIcon";
