'use client'

import type { Team } from '@/lib/teams'
import type { MatchResult } from '@/lib/tournament'
import { getKnockoutWinner } from '@/lib/tournament'

type Pair = [Team, Team] | null

export type Round = {
  name: string
  pairs: Pair[]
  results: (MatchResult | null)[]
  canSimulate: boolean
  onSimulate: () => void
  cols: 1 | 2 | 4
}

function TeamRow({ team, score, isWinner }: { team: Team; score?: number; isWinner: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 ${isWinner ? 'bg-green-900/25' : ''}`}>
      <span className="flex items-center gap-2 min-w-0">
        <span className="text-base shrink-0">{team.flag}</span>
        <span className={`text-sm truncate ${isWinner ? 'text-white font-bold' : 'text-gray-400'}`}>
          {team.name}
        </span>
      </span>
      {score !== undefined && (
        <span className={`font-mono font-bold text-sm ml-2 shrink-0 ${isWinner ? 'text-green-400' : 'text-gray-500'}`}>
          {score}
        </span>
      )}
    </div>
  )
}

function MatchCard({ pair, result }: { pair: Pair; result: MatchResult | null }) {
  if (!pair) {
    return (
      <div className="bg-gray-900/30 border border-gray-700/20 rounded-lg p-4 flex items-center justify-center text-gray-600 text-sm">
        TBD
      </div>
    )
  }
  const [t1, t2] = pair
  const winner = result ? getKnockoutWinner(result) : null
  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-lg overflow-hidden">
      <TeamRow team={t1} score={result?.score1} isWinner={winner?.id === t1.id} />
      <div className="border-t border-gray-700/30" />
      <TeamRow team={t2} score={result?.score2} isWinner={winner?.id === t2.id} />
      {result?.penaltyWinner && (
        <div className="text-center text-xs text-gray-500 py-1 bg-gray-800/30">
          {winner?.name} wins on pens
        </div>
      )}
    </div>
  )
}

function RoundSection({ name, pairs, results, canSimulate, onSimulate, cols }: Round) {
  const allPlayed = results.length > 0 && results.every((r) => r !== null)
  const colClass =
    cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : cols === 2 ? 'sm:grid-cols-2' : ''

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-base ${name === 'Final' ? 'text-yellow-400 text-lg' : 'text-gray-300'}`}>
          {name === 'Final' ? '🏆 ' : ''}{name}
        </h3>
        {!allPlayed && canSimulate && (
          <button
            onClick={onSimulate}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors"
          >
            Simulate
          </button>
        )}
        {allPlayed && <span className="text-green-400 text-xs">✓ Done</span>}
      </div>
      <div className={`grid grid-cols-1 ${colClass} gap-3`}>
        {pairs.map((pair, i) => (
          <MatchCard key={i} pair={pair} result={results[i] ?? null} />
        ))}
      </div>
    </section>
  )
}

type Props = {
  rounds: Round[]
  champion: Team | null
}

export default function KnockoutView({ rounds, champion }: Props) {
  return (
    <div>
      {champion && (
        <div className="mb-10 text-center py-8 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
          <div className="text-5xl mb-3">🏆</div>
          <div className="text-yellow-400 text-3xl font-black">
            {champion.flag} {champion.name}
          </div>
          <div className="text-gray-400 mt-2 text-sm">FIFA World Cup 2022 Champion</div>
        </div>
      )}
      {rounds.map((round) => (
        <RoundSection key={round.name} {...round} />
      ))}
    </div>
  )
}
