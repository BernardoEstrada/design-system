/** Join class names, skipping falsy values. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Build an element id from a label when none is given. */
export function idFromLabel(id: string | undefined, label: string | undefined): string | undefined {
  return id || label?.toLowerCase().replace(/\s+/g, "-");
}
