/**
 * Design
 * - Everything is based on the key of the license (SUM1)
 * - Character
 *   - jobs: Array<Job>
 *   - summons: Array<LicenseKey>
 *   - quickenings: Array<LicenseKey>
 * - From there, can do a BFS to figure out which license keys the character has
 * - new CharacterBoardCache(character)
 *   - getLicenseAt(job, x, y): null | License
 *   - getPositionsOf(licenseKey): Array<[x, y]>
 *   - getLicenses(): Array<License>
 *   - getLicensesByCategory(category): Array<License>
 * - License
 *   - id
 *   - name
 *   - cost
 *   - category
 *   - number
 */

import { LicenseId } from './License';

export type StyleSheet = { [sheet: string]: React.CSSProperties };

export enum Job {
  Archer,
  Shikari,
  Machinist,
  Monk,
  Bushi,
  RedBattlemage,
  WhiteMage,
  BlackMage,
  TimeBattlemage,
  Uhlan,
  Knight,
  Foebreaker
}

export interface Character {
  jobs: [Job, Job];
  summons: Array<LicenseId>;
  quickenings: Array<LicenseId>;
}
