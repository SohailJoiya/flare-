import React, {useState, useEffect, useRef} from 'react'
import Card from './Card'
import Button from './Button'

interface ClaimBonusModalProps {
  isOpen: boolean
  onClose: () => void
  onClaim: () => Promise<void> // should throw with { message, nextClaimAt? } on cooldown
}

type Status =
  | 'idle'
  | 'counting'
  | 'claiming'
  | 'success'
  | 'error'
  | 'cooldown'

const ClaimBonusModal: React.FC<ClaimBonusModalProps> = ({
  isOpen,
  onClose,
  onClaim
}) => {
  const [countdown, setCountdown] = useState(10) // pre-claim ad timer
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(
    null
  ) // ms
  const [cooldownTarget, setCooldownTarget] = useState<string | null>(null) // ISO from API
  const adContainerRef = useRef<HTMLDivElement>(null)

  // open/close lifecycle
  useEffect(() => {
    if (isOpen) {
      setStatus('counting')
      setCountdown(10)
      setErrorMessage('')
      setCooldownRemaining(null)
      setCooldownTarget(null)
    } else {
      setStatus('idle')
    }
  }, [isOpen])

  // 10s pre-claim timer
  useEffect(() => {
    if (status !== 'counting') return

    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(prev => prev - 1), 1000)
      return () => clearTimeout(t)
    } else {
      setStatus('claiming')
      ;(async () => {
        try {
          await onClaim()
          setStatus('success')
        } catch (err: any) {
          // try to read server payload
          const msg = err?.message || 'An unexpected error occurred.'
          const nextClaimAt =
            err?.nextClaimAt ||
            err?.response?.data?.nextClaimAt ||
            err?.data?.nextClaimAt

          // If server says already claimed, show cooldown UI with live countdown
          if (nextClaimAt) {
            setCooldownTarget(nextClaimAt)
            setStatus('cooldown')
          } else {
            setErrorMessage(msg)
            setStatus('error')
          }
        }
      })()
    }
  }, [countdown, status, onClaim])

  // cooldown live countdown (to server-provided nextClaimAt)
  useEffect(() => {
    if (status !== 'cooldown' || !cooldownTarget) return

    const tick = () => {
      const diff = new Date(cooldownTarget).getTime() - Date.now()
      setCooldownRemaining(diff > 0 ? diff : 0)
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [status, cooldownTarget])

  // success: auto-close after 5s + inject ad once
  useEffect(() => {
    if (status === 'success') {
      const closeTimer = setTimeout(() => onClose(), 5000)

      if (
        adContainerRef.current &&
        adContainerRef.current.children.length === 0
      ) {
        const scriptOptions = document.createElement('script')
        scriptOptions.type = 'text/javascript'
        scriptOptions.innerHTML = `
          atOptions = {
            'key' : '1e397eb3237f2a31a4b9d00bbba77428',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `
        const scriptInvoke = document.createElement('script')
        scriptInvoke.type = 'text/javascript'
        scriptInvoke.src =
          '//www.highperformanceformat.com/1e397eb3237f2a31a4b9d00bbba77428/invoke.js'

        adContainerRef.current.appendChild(scriptOptions)
        adContainerRef.current.appendChild(scriptInvoke)
      }

      return () => clearTimeout(closeTimer)
    }
  }, [status, onClose])

  if (!isOpen) return null

  const formatHMS = (ms: number) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000))
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const renderContent = () => {
    switch (status) {
      case 'claiming':
        return (
          <div className='text-center'>
            <h3 className='text-xl font-bold text-white mb-2'>
              Claiming Your Bonus...
            </h3>
            <p className='text-gray-400'>Please wait a moment.</p>
            <div className='spinner mt-4'></div>
          </div>
        )
      case 'success':
        return (
          <div className='text-center'>
            <h3 className='text-xl font-bold text-green-400 mb-2'>
              Congratulations!
            </h3>
            <p className='text-gray-400 mb-4'>
              Your daily bonus has been successfully claimed.
            </p>
            <div
              ref={adContainerRef}
              className='flex justify-center items-center w-[300px] h-[250px] mx-auto my-4 bg-brand-dark/50 rounded-lg'></div>
            <p className='text-xs text-gray-500 mt-2'>
              This will close automatically in a few seconds.
            </p>
          </div>
        )
      case 'cooldown': {
        const human =
          cooldownRemaining != null ? formatHMS(cooldownRemaining) : '—'
        const localTime = cooldownTarget
          ? new Date(cooldownTarget).toLocaleString()
          : ''
        return (
          <div className='text-center'>
            <h3 className='text-xl font-bold text-yellow-400 mb-2'>
              Already Claimed Today
            </h3>
            <p className='text-gray-400'>
              You can claim again at your next local midnight.
            </p>
            <p className='text-5xl font-bold text-brand-primary my-4'>
              {human}
            </p>
            {cooldownTarget && (
              <p className='text-xs text-gray-500'>
                Next claim time: {localTime}
              </p>
            )}
            <div className='mt-6'>
              <Button
                onClick={onClose}
                variant='secondary'>
                Close
              </Button>
            </div>
          </div>
        )
      }
      case 'error':
        return (
          <div className='text-center'>
            <h3 className='text-xl font-bold text-red-500 mb-2'>
              Claim Failed
            </h3>
            <p className='text-gray-400 mb-6'>{errorMessage}</p>
            <Button
              onClick={onClose}
              variant='secondary'>
              Close
            </Button>
          </div>
        )
      case 'counting':
      default:
        return (
          <div className='text-center'>
            <img
              src='https://placehold.co/468x120/E61E4D/white/png?text=Special+Bonus!'
              alt='Bonus'
              className='rounded-lg object-cover mx-auto mb-6'
            />
            <h3 className='text-xl font-bold text-white mb-2'>
              Claiming your bonus in...
            </h3>
            <p className='text-5xl font-bold text-brand-primary my-4'>
              {countdown}
            </p>
            <p className='text-xs text-gray-500'>
              Your bonus will be claimed automatically.
            </p>
          </div>
        )
    }
  }

  return (
    <div
      className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in'
      onClick={status !== 'claiming' ? onClose : undefined}
      role='dialog'
      aria-modal='true'>
      <Card
        className='w-full max-w-md animate-scale-in'
        onClick={e => e.stopPropagation()}>
        {renderContent()}
      </Card>

      <style>{`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid #E61E4D;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  )
}

export default ClaimBonusModal
