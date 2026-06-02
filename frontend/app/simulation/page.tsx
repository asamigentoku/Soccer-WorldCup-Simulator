'use client'

import {useState, useEffect, useCallback, useRef} from 'react'
import Link from 'next/link'
import { Howl } from 'howler';
import { TEAMS, type Team } from '@/lib/teams'
import { simulateKnockoutMatch, getKnockoutWinner, type MatchResult } from '@/lib/tournament'
import TournamentBracket, { type BracketRound } from '@/components/TournamentBracket'

type Pair = [Team, Team]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function toPairs(teams: Team[]): Pair[] {
  const pairs: Pair[] = []
  for (let i = 0; i < teams.length; i += 2) pairs.push([teams[i], teams[i + 1]])
  return pairs
}

function winners(results: (MatchResult | null)[]): Team[] | null {
  if (results.length === 0 || results.some((r) => !r)) return null
  return (results as MatchResult[]).map(getKnockoutWinner)
}

function simRound(pairs: Pair[]): MatchResult[] {
  return pairs.map(([t1, t2]) => simulateKnockoutMatch(t1, t2))
}

export default function SimulationPage() {
  const [r32Pairs, setR32Pairs] = useState<Pair[]>([])
  const [r32, setR32] = useState<(MatchResult | null)[]>([])
  const [r16, setR16] = useState<(MatchResult | null)[]>([])
  const [qf,  setQF]  = useState<(MatchResult | null)[]>([])
  const [sf,  setSF]  = useState<(MatchResult | null)[]>([])
  const [fin, setFin] = useState<MatchResult | null>(null)

  //音声
  const main_sound =useRef(new Howl({ src: ['/audio/main_sound.mp3'] ,volume: 0.4}))
  const win_sound =useRef(new Howl({ src: ['/audio/win_sound.mp3'] }))
  const loss_sound =useRef(new Howl({ src: ['/audio/loss_sound.mp3'] }))




  const draw = useCallback(() => {
    setR32Pairs(toPairs(shuffle([...TEAMS])))
    setR32(Array(16).fill(null))
    setR16(Array(8).fill(null))
    setQF(Array(4).fill(null))
    setSF(Array(2).fill(null))
    setFin(null)
  }, [])
  useEffect(() => { draw() }, [draw])

  useEffect(() => {
    main_sound.current.play()
    return () => { main_sound.current.stop() }
  }, [])



  const w32 = winners(r32)
  const r16Pairs = w32 ? toPairs(w32) : null

  const w16 = winners(r16)
  const qfPairs = w16 ? toPairs(w16) : null

  const wQF = winners(qf)
  const sfPairs = wQF ? toPairs(wQF) : null

  const wSF = winners(sf)
  const finalPair: Pair | null = wSF ? [wSF[0], wSF[1]] : null

  const champion = fin ? getKnockoutWinner(fin) : null

  const nullPairs = (n: number): ([Team, Team] | null)[] => Array(n).fill(null)

  // Step-by-step simulate with animation delay
  const simulateAll = async () => {
    if (!r32Pairs.length) return
    const nr32 = simRound(r32Pairs);                         setR32(nr32)
    await delay(600)
    const nr16 = simRound(toPairs(nr32.map(getKnockoutWinner))); setR16(nr16)
    await delay(500)
    const nqf  = simRound(toPairs(nr16.map(getKnockoutWinner))); setQF(nqf)
    await delay(400)
    const nsf  = simRound(toPairs(nqf.map(getKnockoutWinner)));  setSF(nsf)
    await delay(400)
    const nfin = simulateKnockoutMatch(getKnockoutWinner(nsf[0]), getKnockoutWinner(nsf[1]))
    setFin(nfin)
    win_sound.current.play()
  }

  const rounds: BracketRound[] = [
    {
      name: 'Round of 32',
      pairs: r32Pairs.length ? r32Pairs : nullPairs(16),
      results: r32,
      canSimulate: r32Pairs.length > 0,
      onSimulate: () => setR32(simRound(r32Pairs)),
    },
    {
      name: 'Round of 16',
      pairs: r16Pairs ?? nullPairs(8),
      results: r16,
      canSimulate: !!r16Pairs,
      onSimulate: () => r16Pairs && setR16(simRound(r16Pairs)),
    },
    {
      name: 'Quarter Finals',
      pairs: qfPairs ?? nullPairs(4),
      results: qf,
      canSimulate: !!qfPairs,
      onSimulate: () => qfPairs && setQF(simRound(qfPairs)),
    },
    {
      name: 'Semi Finals',
      pairs: sfPairs ?? nullPairs(2),
      results: sf,
      canSimulate: !!sfPairs,
      onSimulate: () => sfPairs && setSF(simRound(sfPairs)),
    },
    {
      name: 'Final',
      pairs: [finalPair],
      results: [fin],
      canSimulate: !!finalPair,
      onSimulate: () => finalPair && setFin(simulateKnockoutMatch(finalPair[0], finalPair[1])),
    },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ position: 'relative' }}>

      {/* Stadium background image */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: "url('/people-soccer-stadium.jpg')",
        backgroundSize: '200%',
        backgroundPosition: 'center',
        zIndex: -2,
      }} />
      {/* Dark overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)',
        zIndex: -1,
      }} />

      {/* Header */}
      <header
        className="sticky top-0 z-10 px-6 py-3 flex items-center justify-between gap-4"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
          >
            ← Back
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span className="text-xl">⚽</span>
          <h1 className="font-black text-base sm:text-lg tracking-wide"
            style={{
              color: 'transparent',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)',
            }}
          >
            FIFA World Cup 2026
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateAll}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              boxShadow: '0 0 20px rgba(245,158,11,0.35)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(245,158,11,0.55)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(245,158,11,0.35)')}
          >
            ▶ Simulate All
          </button>
          <button
            onClick={draw}
            className="px-4 py-2 rounded-full text-sm transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.7)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)')}
          >
            ↺ New Draw
          </button>
        </div>
      </header>

      <main className="flex-1 px-3 py-3">
        <TournamentBracket rounds={rounds} champion={champion} />
      </main>
    </div>
  )
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
