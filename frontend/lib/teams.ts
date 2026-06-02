export type Team = {
  id: string
  name: string
  flag: string
  group: string
  attack: number
  defense: number
}

export const TEAMS: Team[] = [
  { id: 'QAT', name: 'Qatar',       flag: '🇶🇦', group: 'A', attack: 55, defense: 55 },
  { id: 'ECU', name: 'Ecuador',     flag: '🇪🇨', group: 'A', attack: 62, defense: 60 },
  { id: 'SEN', name: 'Senegal',     flag: '🇸🇳', group: 'A', attack: 72, defense: 70 },
  { id: 'NED', name: 'Netherlands', flag: '🇳🇱', group: 'A', attack: 84, defense: 82 },

  { id: 'ENG', name: 'England',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'B', attack: 87, defense: 83 },
  { id: 'IRN', name: 'IR Iran',     flag: '🇮🇷', group: 'B', attack: 56, defense: 60 },
  { id: 'USA', name: 'USA',         flag: '🇺🇸', group: 'B', attack: 75, defense: 73 },
  { id: 'WAL', name: 'Wales',       flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', group: 'B', attack: 59, defense: 62 },

  { id: 'ARG', name: 'Argentina',   flag: '🇦🇷', group: 'C', attack: 91, defense: 85 },
  { id: 'KSA', name: 'Saudi Arabia',flag: '🇸🇦', group: 'C', attack: 61, defense: 63 },
  { id: 'MEX', name: 'Mexico',      flag: '🇲🇽', group: 'C', attack: 74, defense: 76 },
  { id: 'POL', name: 'Poland',      flag: '🇵🇱', group: 'C', attack: 73, defense: 72 },

  { id: 'FRA', name: 'France',      flag: '🇫🇷', group: 'D', attack: 90, defense: 86 },
  { id: 'AUS', name: 'Australia',   flag: '🇦🇺', group: 'D', attack: 65, defense: 64 },
  { id: 'DEN', name: 'Denmark',     flag: '🇩🇰', group: 'D', attack: 79, defense: 80 },
  { id: 'TUN', name: 'Tunisia',     flag: '🇹🇳', group: 'D', attack: 60, defense: 63 },

  { id: 'ESP', name: 'Spain',       flag: '🇪🇸', group: 'E', attack: 88, defense: 84 },
  { id: 'CRC', name: 'Costa Rica',  flag: '🇨🇷', group: 'E', attack: 57, defense: 61 },
  { id: 'GER', name: 'Germany',     flag: '🇩🇪', group: 'E', attack: 85, defense: 82 },
  { id: 'JPN', name: 'Japan',       flag: '🇯🇵', group: 'E', attack: 68, defense: 70 },

  { id: 'BEL', name: 'Belgium',     flag: '🇧🇪', group: 'F', attack: 83, defense: 80 },
  { id: 'CAN', name: 'Canada',      flag: '🇨🇦', group: 'F', attack: 58, defense: 60 },
  { id: 'MAR', name: 'Morocco',     flag: '🇲🇦', group: 'F', attack: 71, defense: 75 },
  { id: 'CRO', name: 'Croatia',     flag: '🇭🇷', group: 'F', attack: 80, defense: 78 },

  { id: 'BRA', name: 'Brazil',      flag: '🇧🇷', group: 'G', attack: 92, defense: 88 },
  { id: 'SRB', name: 'Serbia',      flag: '🇷🇸', group: 'G', attack: 70, defense: 68 },
  { id: 'SUI', name: 'Switzerland', flag: '🇨🇭', group: 'G', attack: 77, defense: 78 },
  { id: 'CMR', name: 'Cameroon',    flag: '🇨🇲', group: 'G', attack: 64, defense: 62 },

  { id: 'POR', name: 'Portugal',    flag: '🇵🇹', group: 'H', attack: 86, defense: 80 },
  { id: 'GHA', name: 'Ghana',       flag: '🇬🇭', group: 'H', attack: 63, defense: 62 },
  { id: 'URU', name: 'Uruguay',     flag: '🇺🇾', group: 'H', attack: 78, defense: 77 },
  { id: 'KOR', name: 'South Korea', flag: '🇰🇷', group: 'H', attack: 69, defense: 68 },
]

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const
export type GroupName = (typeof GROUPS)[number]
