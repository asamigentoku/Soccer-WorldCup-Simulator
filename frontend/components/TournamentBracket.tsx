'use client'

import type { Team } from '@/lib/teams'
import type { MatchResult } from '@/lib/tournament'
import { getKnockoutWinner } from '@/lib/tournament'

type Pair = [Team, Team] | null

export type BracketRound = {
  name: string
  pairs: Pair[]
  results: (MatchResult | null)[]
  canSimulate: boolean
  onSimulate: () => void
}

// ── Layout ────────────────────────────────────────────────────────────────────
// Left side:  R32 → R16 → QF → SF ──┐
//                                  Final (center)
// Right side: R32 → R16 → QF → SF ──┘

const CW   = 122   // card width
const CH   = 46    // card height
const RG   = 14    // gap between rounds
const SH   = 60    // base slot height (8 R32 matches per half)
const TPAD = 44    // top padding for headers

const STEP  = CW + RG           // 136
const X_FIN = 4 * STEP          // center Final x: 544
const TW    = 8 * STEP + CW    // total width: 1088 + 122 = 1210
const TH    = TPAD + 8 * SH + 24  // total height: 44 + 480 + 24 = 548

// x of left-side round r (0=R32, 3=SF)
const xL = (r: number) => r * STEP
// x of right-side round r (0=R32, 3=SF) — mirrored
const xR = (r: number) => (8 - r) * STEP

// slot height for round r
const slotH = (r: number) => SH << r

// y-center for match m in round r (half-bracket: max 8 matches at r=0)
const cy = (r: number, m: number) => TPAD + m * slotH(r) + slotH(r) / 2

// card top for match m in round r
const ct = (r: number, m: number) => { const s = slotH(r); return TPAD + m * s + (s - CH) / 2 }

// ── SVG Connector Lines ───────────────────────────────────────────────────────
function BracketLines() {
  const els: React.ReactNode[] = []
  const sw = 1.5

  for (let r = 0; r < 3; r++) {
    const count = 8 >> r           // 8, 4, 2 matches per half
    const col   = `rgba(148,163,184,${0.2 + r * 0.07})`

    // Left side: right edge → midpoint → left edge of next round
    const xLR = xL(r) + CW
    const xLM = xLR + RG / 2
    const xLN = xL(r + 1)
    for (let m = 0; m < count; m += 2) {
      const yu = cy(r, m), yl = cy(r, m + 1), yp = cy(r + 1, m / 2)
      const k = `l${r}-${m}`
      els.push(
        <line key={`${k}a`} x1={xLR} y1={yu} x2={xLM} y2={yu} stroke={col} strokeWidth={sw} />,
        <line key={`${k}b`} x1={xLR} y1={yl} x2={xLM} y2={yl} stroke={col} strokeWidth={sw} />,
        <line key={`${k}v`} x1={xLM} y1={yu} x2={xLM} y2={yl} stroke={col} strokeWidth={sw} />,
        <line key={`${k}p`} x1={xLM} y1={yp} x2={xLN} y2={yp} stroke={col} strokeWidth={sw} />,
      )
    }

    // Right side: left edge → midpoint → right edge of next round (going inward)
    const xRLL = xR(r)
    const xRM  = xRLL - RG / 2
    const xRN  = xR(r + 1) + CW
    for (let m = 0; m < count; m += 2) {
      const yu = cy(r, m), yl = cy(r, m + 1), yp = cy(r + 1, m / 2)
      const k = `r${r}-${m}`
      els.push(
        <line key={`${k}a`} x1={xRLL} y1={yu} x2={xRM}  y2={yu} stroke={col} strokeWidth={sw} />,
        <line key={`${k}b`} x1={xRLL} y1={yl} x2={xRM}  y2={yl} stroke={col} strokeWidth={sw} />,
        <line key={`${k}v`} x1={xRM}  y1={yu} x2={xRM}  y2={yl} stroke={col} strokeWidth={sw} />,
        <line key={`${k}p`} x1={xRM}  y1={yp} x2={xRN}  y2={yp} stroke={col} strokeWidth={sw} />,
      )
    }
  }

  // SF → Final (left)
  const yMid = cy(3, 0)
  els.push(
    <line key="lsf-fin" x1={xL(3) + CW} y1={yMid} x2={X_FIN}      y2={yMid} stroke="rgba(250,204,21,0.4)" strokeWidth={sw} />,
    <line key="rsf-fin" x1={X_FIN + CW} y1={yMid} x2={xR(3)}      y2={yMid} stroke="rgba(250,204,21,0.4)" strokeWidth={sw} />,
  )

  return <>{els}</>
}

// ── Team row ──────────────────────────────────────────────────────────────────
function TeamRow({ team, score, isWinner, hasPen }: {
  team: Team | undefined; score: number | undefined; isWinner: boolean; hasPen: boolean
}) {
  if (!team) return (
    <div className="flex flex-1 items-center px-3">
      <span className="text-[11px] italic" style={{ color: 'rgba(255,255,255,0.18)' }}>TBD</span>
    </div>
  )
  return (
    <div
      className={`flex flex-1 items-center gap-2 px-3 transition-all duration-300 border-l-2 ${
        isWinner ? 'border-emerald-400' : 'border-transparent'
      }`}
      style={isWinner ? { background: 'rgba(52,211,153,0.1)' } : undefined}
    >
      <span className="text-sm leading-none shrink-0">{team.flag}</span>
      <span className={`flex-1 text-[12px] truncate transition-colors duration-300 ${
        isWinner ? 'text-white font-semibold' : 'text-white/50'
      }`}>
        {team.name}
      </span>
      {score !== undefined && (
        <span className={`font-mono text-[12px] font-bold shrink-0 animate-score-in ${
          isWinner ? 'text-emerald-400' : 'text-white/25'
        }`}>
          {score}{hasPen && isWinner && <span className="text-[9px] ml-0.5 text-yellow-400">P</span>}
        </span>
      )}
    </div>
  )
}

// ── Match card ────────────────────────────────────────────────────────────────
function MatchCard({ pair, result, left, top, isFinal = false }: {
  pair: Pair; result: MatchResult | null; left: number; top: number; isFinal?: boolean
}) {
  const [t1, t2] = pair ?? [undefined, undefined]
  const winner   = result ? getKnockoutWinner(result) : null
  const pen      = !!result?.penaltyWinner

  return (
    <div
      style={{
        position: 'absolute', left, top, width: CW, height: isFinal ? CH + 8 : CH,
        background: isFinal ? 'rgba(10, 8, 2, 0.88)' : 'rgba(6, 10, 24, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isFinal
          ? '1px solid rgba(250,204,21,0.25)'
          : result
          ? '1px solid rgba(255,255,255,0.13)'
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: isFinal ? 10 : 7,
        boxShadow: isFinal
          ? '0 0 32px rgba(250,204,21,0.12), 0 4px 24px rgba(0,0,0,0.7)'
          : result
          ? '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)'
          : '0 2px 10px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}
      className={`flex flex-col ${result ? 'animate-winner' : ''}`}
    >
      <TeamRow team={t1} score={result?.score1} isWinner={winner?.id === t1?.id} hasPen={pen} />
      <div style={{ height: 1, background: isFinal ? 'rgba(250,204,21,0.15)' : 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
      <TeamRow team={t2} score={result?.score2} isWinner={winner?.id === t2?.id} hasPen={pen} />
    </div>
  )
}

// ── Round header ──────────────────────────────────────────────────────────────
function ColHeader({ label, x, canSimulate, onSimulate, isDone, showButton }: {
  label: string; x: number; canSimulate: boolean; onSimulate: () => void; isDone: boolean; showButton: boolean
}) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width: CW }}
      className="flex flex-col items-center gap-1.5 pt-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] w-full text-center truncate"
        style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </span>
      {isDone ? (
        <span className="text-[10px] text-emerald-400 font-bold">✓</span>
      ) : showButton && canSimulate ? (
        <button
          onClick={onSimulate}
          className="text-[10px] px-3 py-1 rounded-full font-medium transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.7)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.16)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}
        >
          ▶ Simulate
        </button>
      ) : (
        <span style={{ height: 20 }} />
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TournamentBracket({ rounds, champion }: {
  rounds: BracketRound[]
  champion: Team | null
}) {
  // rounds[0]=R32(16), [1]=R16(8), [2]=QF(4), [3]=SF(2), [4]=Final(1)
  // Split each half-round into left/right
  const halves = rounds.slice(0, 4).map((rnd) => {
    const h = Math.floor(rnd.pairs.length / 2)
    return {
      ...rnd,
      lPairs:  rnd.pairs.slice(0, h),
      rPairs:  rnd.pairs.slice(h),
      lRes:    rnd.results.slice(0, h),
      rRes:    rnd.results.slice(h),
      isDone:  rnd.results.length > 0 && rnd.results.every(v => v !== null),
    }
  })

  const finalRound = rounds[4]
  const yMid  = cy(3, 0)  // vertical center of SF / Final
  const yCard = yMid - (CH + 8) / 2  // Final card top

  const roundLabels = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals']

  return (
    <div className="overflow-x-auto rounded-2xl flex justify-center" style={{ background: 'rgba(0,0,0,0.1)' }}>
      <div style={{ position: 'relative', width: TW, height: TH, flexShrink: 0 }}>

        {/* SVG bracket lines */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={TW} height={TH}>
          <BracketLines />
        </svg>

        {/* Left column headers */}
        {halves.map((rnd, r) => (
          <ColHeader key={`lh-${r}`} label={roundLabels[r]} x={xL(r)}
            canSimulate={rnd.canSimulate} onSimulate={rnd.onSimulate}
            isDone={rnd.isDone} showButton={true} />
        ))}

        {/* Final header (center) */}
        {finalRound && (
          <div style={{ position: 'absolute', left: X_FIN, top: 0, width: CW }}
            className="flex flex-col items-center gap-1.5 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] w-full text-center"
              style={{ color: 'rgba(250,204,21,0.6)' }}>Final</span>
            {finalRound.results[0] ? (
              <span className="text-[10px] text-emerald-400 font-bold">✓</span>
            ) : finalRound.canSimulate ? (
              <button onClick={finalRound.onSimulate}
                className="text-[10px] px-3 py-1 rounded-full font-medium transition-all"
                style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)', color: 'rgba(250,204,21,0.85)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(250,204,21,0.18)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(250,204,21,0.1)' }}
              >
                ▶ Final
              </button>
            ) : <span style={{ height: 20 }} />}
          </div>
        )}

        {/* Right column headers (mirrored order: SF, QF, R16, R32) */}
        {halves.map((rnd, r) => (
          <ColHeader key={`rh-${r}`} label={roundLabels[r]} x={xR(r)}
            canSimulate={rnd.canSimulate} onSimulate={rnd.onSimulate}
            isDone={rnd.isDone} showButton={false} />
        ))}

        {/* Left match cards */}
        {halves.map((rnd, r) =>
          rnd.lPairs.map((pair, m) => (
            <MatchCard key={`L${r}-${m}`} pair={pair} result={rnd.lRes[m] ?? null} left={xL(r)} top={ct(r, m)} />
          ))
        )}

        {/* Center Final card */}
        {finalRound && (
          <MatchCard
            pair={finalRound.pairs[0]}
            result={finalRound.results[0] ?? null}
            left={X_FIN}
            top={yCard}
            isFinal
          />
        )}

        {/* Right match cards */}
        {halves.map((rnd, r) =>
          rnd.rPairs.map((pair, m) => (
            <MatchCard key={`R${r}-${m}`} pair={pair} result={rnd.rRes[m] ?? null} left={xR(r)} top={ct(r, m)} />
          ))
        )}

        {/* Champion badge — centered above Final card */}
        {champion && (
          <div
            key={champion.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: yCard - 112,
              transform: 'translateX(-50%)',
            }}
            className="flex flex-col items-center animate-champion"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(250,204,21,0.35) 0%, transparent 70%)',
                border: '1px solid rgba(250,204,21,0.4)',
                boxShadow: '0 0 32px rgba(250,204,21,0.3)',
              }}
            >🏆</div>
            <div
              className="mt-2 text-[15px] font-black whitespace-nowrap tracking-wide"
              style={{
                color: 'transparent',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                backgroundImage: 'linear-gradient(135deg, #fde68a, #f59e0b)',
              }}
            >
              {champion.flag} {champion.name}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              World Cup Champion
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
