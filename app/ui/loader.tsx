'use client'

import { BeatLoader } from 'react-spinners'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
      <BeatLoader color="#2EC4B6" size={12} />
    </div>
  )
}
