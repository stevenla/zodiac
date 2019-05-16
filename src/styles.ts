export type StyleSheet = { [sheet: string]: React.CSSProperties };

export function merge(
  ...args: Array<null | boolean | React.CSSProperties>
): React.CSSProperties {
  const filtered = args.filter(x => x);
  return Object.assign({}, ...filtered);
}
