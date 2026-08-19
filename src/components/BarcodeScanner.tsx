import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import type { IScannerControls } from '@zxing/browser'
import { IconArrowLeft } from './icons'

interface Props {
  onDetect: (code: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onDetect, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    let controls: IScannerControls | undefined
    let cancelled = false

    reader
      .decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current!,
        (result) => {
          if (result && !cancelled) {
            cancelled = true
            controls?.stop()
            onDetect(result.getText())
          }
        }
      )
      .then((c) => {
        controls = c
        if (cancelled) c.stop()
      })
      .catch(() => setError('No se pudo acceder a la cámara. Podés escribir el código a mano.'))

    return () => {
      cancelled = true
      controls?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
          <IconArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-white font-medium">Escanear código de barras</h1>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[80%] h-24 border-2 border-white/70 rounded-lg" />
        </div>
        {error && (
          <div className="absolute inset-x-6 bottom-8 bg-white/90 rounded-xl px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
