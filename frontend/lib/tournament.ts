import type { Team } from './teams'

export type MatchResult = {
  team1: Team
  team2: Team
  score1: number
  score2: number
  penaltyWinner?: string
}

export type Standing = {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
}

function poissonRandom(lambda: number): number {
  if (lambda <= 0) return 0
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    p *= Math.random()
    if (p > L) k++
  } while (p > L)
  return k
}

function expectedGoals(attack: number, defense: number): number {
  return (attack / 100) * 1.6 * (1.2 - defense / 100)
}

export function simulateMatch(team1: Team, team2: Team): MatchResult {
  return {
    team1,
    team2,
    score1: poissonRandom(Math.max(0.2, expectedGoals(team1.attack, team2.defense))),
    score2: poissonRandom(Math.max(0.2, expectedGoals(team2.attack, team1.defense))),
  }
}

export function simulateKnockoutMatch(team1: Team, team2: Team): MatchResult {
  const result = simulateMatch(team1, team2)
  if (result.score1 !== result.score2) return result
  const penWinner =
    Math.random() < team1.attack / (team1.attack + team2.attack) ? team1.id : team2.id
  return { ...result, penaltyWinner: penWinner }
}

export function getKnockoutWinner(result: MatchResult): Team {
  if (result.score1 > result.score2) return result.team1
  if (result.score2 > result.score1) return result.team2
  return result.penaltyWinner === result.team1.id ? result.team1 : result.team2
}

export function getGroupMatchups(teams: Team[]): [Team, Team][] {
  const pairs: [Team, Team][] = []
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      pairs.push([teams[i], teams[j]])
    }
  }
  return pairs
}

export function computeStandings(teams: Team[], results: MatchResult[]): Standing[] {
  const map = new Map<string, Standing>(
    teams.map((t) => [
      t.id,
      { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    ])
  )
  for (const r of results) {
    const s1 = map.get(r.team1.id)!
    const s2 = map.get(r.team2.id)!
    s1.played++
    s2.played++
    s1.gf += r.score1
    s1.ga += r.score2
    s2.gf += r.score2
    s2.ga += r.score1
    s1.gd = s1.gf - s1.ga
    s2.gd = s2.gf - s2.ga
    if (r.score1 > r.score2) {
      s1.won++; s1.points += 3; s2.lost++
    } else if (r.score2 > r.score1) {
      s2.won++; s2.points += 3; s1.lost++
    } else {
      s1.drawn++; s1.points++; s2.drawn++; s2.points++
    }
  }
  return [...map.values()].sort(
    (a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf
  )
}
