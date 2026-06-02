'use client'

import type { Standing, MatchResult } from '@/lib/tournament'

type Props = {
  group: string
  standings: Standing[]
  results: MatchResult[]
  onSimulate: () => void
  simulated: boolean
}

export default function GroupCard({ group, standings, results, onSimulate, simulated }: Props) {
  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/60 border-b border-gray-700/30">
        <h3 className="font-black text-yellow-400 tracking-widest text-sm">GROUP {group}</h3>
        {!simulated ? (
          <button
            onClick={onSimulate}
            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors font-medium"
          >
            Simulate
          </button>
        ) : (
          <span className="text-xs text-green-400 font-medium">✓ Done</span>
        )}
      </div>

      <div className="px-2 py-2 flex-1">
        <div className="grid grid-cols-[1fr_24px_24px_24px_28px] gap-x-1 text-xs text-gray-500 mb-1 px-2">
          <span>Team</span>
          <span className="text-center">P</span>
          <span className="text-center">W</span>
          <span className="text-center">D</span>
          <span className="text-center font-semibold">PTS</span>
        </div>
        {standings.map((s, i) => (
          <div
            key={s.team.id}
            className={`grid grid-cols-[1fr_24px_24px_24px_28px] gap-x-1 items-center text-xs px-2 py-1 rounded ${
              i < 2 && simulated ? 'bg-green-900/20' : ''
            }`}
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="shrink-0">{s.team.flag}</span>
              <span className="truncate text-gray-200">{s.team.name}</span>
            </span>
            <span className="text-center text-gray-500">{s.played}</span>
            <span className="text-center text-gray-500">{s.won}</span>
            <span className="text-center text-gray-500">{s.drawn}</span>
            <span
              className={`text-center font-bold ${
                i < 2 && simulated ? 'text-green-400' : 'text-white'
              }`}
            >
              {s.points}
            </span>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="border-t border-gray-700/30 px-3 py-2 space-y-1 bg-gray-900/30">
          {results.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-1 min-w-0 flex-1">
                <span>{r.team1.flag}</span>
                <span className="text-gray-400 truncate">{r.team1.name}</span>
              </span>
              <span className="font-mono font-bold text-white shrink-0 px-1">
                {r.score1}–{r.score2}
              </span>
              <span className="flex items-center gap-1 min-w-0 flex-1 justify-end">
                <span className="text-gray-400 truncate">{r.team2.name}</span>
                <span>{r.team2.flag}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
