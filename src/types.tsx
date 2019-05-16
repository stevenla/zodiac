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

export enum Job {
  Archer = 'archer',
  Shikari = 'shikari',
  Machinist = 'machinist',
  Monk = 'monk',
  Bushi = 'bushi',
  RedBattlemage = 'redbattlemage',
  WhiteMage = 'whitemage',
  BlackMage = 'blackmage',
  TimeBattlemage = 'timebattlemage',
  Uhlan = 'uhlan',
  Knight = 'knight',
  Foebreaker = 'foebreaker',
}
