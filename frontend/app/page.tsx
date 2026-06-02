'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const Earth = dynamic(() => import('@/3D/3D-component/Earth'), { ssr: false })

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Earth />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
        <div className="text-center px-6">
          <p className="text-yellow-400 text-sm font-semibold tracking-[0.3em] uppercase mb-3 drop-shadow">
            FIFA World Cup 2026
          </p>
          <h1 className="text-5xl sm:text-7xl font-black text-white drop-shadow-lg leading-tight mb-2">
            Simulator
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-10 drop-shadow">
            Simulate the full tournament — Group Stage to Final
          </p>
          <Link
            href="/simulation"
            className="inline-block px-10 py-4 bg-yellow-500 text-black font-black rounded-2xl text-lg hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-500/30 hover:scale-105 active:scale-95"
          >
            ⚽ Start Simulation
          </Link>
        </div>
      </div>
    </div>
  )
}
