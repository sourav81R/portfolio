import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Bot,
  Eraser,
  LoaderCircle,
  MessageSquareText,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Send,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useAssistant } from '../../lib/assistant/assistant-context'
import { useSmoothScroll } from '../../providers/SmoothScrollProvider'

const renderMessageText = (text: string) => {
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^)]+|mailto:[^)]+|tel:[^)]+)\)|\*\*(.+?)\*\*)/g
  const parts: React.ReactNode[] = []
  let cursor = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > cursor) parts.push(text.slice(cursor, index))
    if (match[3]) parts.push(<a key={`link-${index}`} href={match[3]} target={match[3].startsWith('http') ? '_blank' : undefined} rel={match[3].startsWith('http') ? 'noopener noreferrer' : undefined} className="font-medium text-cyan-300 underline decoration-cyan-300/50 underline-offset-2 hover:text-cyan-200">{match[2]}</a>)
    else if (match[4]) parts.push(<strong key={`bold-${index}`} className="font-semibold text-white">{match[4]}</strong>)
    cursor = index + match[0].length
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

const AssistantMascot = () => (
  <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible" aria-hidden="true">
    <defs>
      <linearGradient id="assistant-shell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset=".55" stopColor="#dce8f3" /><stop offset="1" stopColor="#8da9bf" /></linearGradient>
      <linearGradient id="assistant-body" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f8fcff" /><stop offset="1" stopColor="#a7bfd0" /></linearGradient>
      <linearGradient id="assistant-face" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#07121f" /><stop offset="1" stopColor="#020811" /></linearGradient>
      <filter id="assistant-cyan-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      <filter id="assistant-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#020617" floodOpacity=".55" /></filter>
    </defs>
    <ellipse cx="120" cy="222" rx="58" ry="8" fill="#22d3ee" opacity=".16" />
    <g filter="url(#assistant-shadow)">
      <path d="M54 106V88a66 66 0 0 1 132 0v18" fill="none" stroke="#dbe8f1" strokeWidth="12" strokeLinecap="round" />
      <path d="M59 83a62 62 0 0 1 122-5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
      <rect x="43" y="84" width="22" height="49" rx="11" fill="url(#assistant-shell)" stroke="#91aabd" strokeWidth="2" />
      <rect x="175" y="84" width="22" height="49" rx="11" fill="url(#assistant-shell)" stroke="#91aabd" strokeWidth="2" />
      <rect x="67" y="159" width="106" height="67" rx="30" fill="url(#assistant-body)" stroke="#d8e7f2" strokeWidth="2" />
      <path d="M99 164v-8a21 21 0 0 1 42 0v8" fill="none" stroke="#27d7ee" strokeWidth="7" />
      <rect x="96" y="169" width="48" height="14" rx="7" fill="#b8d5e4" />
      <circle cx="120" cy="200" r="12" fill="#cffafe" stroke="#27d7ee" strokeWidth="4" filter="url(#assistant-cyan-glow)" />
      <rect x="50" y="47" width="140" height="119" rx="49" fill="url(#assistant-shell)" stroke="#f8fdff" strokeWidth="3" />
      <path d="M66 93c0-17 14-31 31-31h46c17 0 31 14 31 31v28c0 15-12 27-27 27H93c-15 0-27-12-27-27V93Z" fill="url(#assistant-face)" stroke="#71889a" strokeWidth="2" />
      <motion.ellipse cx="96" cy="103" rx="10" ry="15" fill="#22d3ee" filter="url(#assistant-cyan-glow)" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ scaleY: [1, 1, 0.08, 1, 1] }} transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.78, 0.82, 0.86, 1], ease: 'easeInOut' }} />
      <motion.ellipse cx="144" cy="103" rx="10" ry="15" fill="#22d3ee" filter="url(#assistant-cyan-glow)" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ scaleY: [1, 1, 0.08, 1, 1] }} transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.78, 0.82, 0.86, 1], ease: 'easeInOut' }} />
      <path d="M108 124q12 12 24 0" fill="none" stroke="#38e7f5" strokeWidth="4" strokeLinecap="round" />
      <path d="M189 112q18 3 16 19-2 13-20 15" fill="none" stroke="#dbe8f1" strokeWidth="7" strokeLinecap="round" />
      <circle cx="202" cy="132" r="5" fill="#22d3ee" filter="url(#assistant-cyan-glow)" />
      <path d="M80 55q40-20 80 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
    </g>
  </svg>
)

const VoiceStageMascot = ({ listening }: { listening: boolean }) => (
  <motion.div
    aria-hidden="true"
    className="assistant-mascot relative h-36 w-36 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
    animate={listening ? { y: [0, -7, 0], rotate: [0, 1.5, 0] } : { y: [0, -4, 0], rotate: [0, -1, 0] }}
    transition={{ duration: listening ? 0.8 : 3.8, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div className="absolute left-1/2 top-2 h-8 w-2 -translate-x-1/2 rounded-full bg-gradient-to-t from-blue-700 to-sky-300 shadow-[0_0_16px_rgba(96,165,250,.6)]" />
    <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full border border-sky-300/70 bg-sky-300 shadow-[0_0_20px_rgba(96,165,250,.75)]" />
    <div className="absolute inset-x-2 bottom-1 top-8 rounded-[34%_34%_30%_30%] border border-blue-400/50 bg-[linear-gradient(125deg,#0b43a1_4%,#0757c9_36%,#063580_70%,#021d57)] shadow-[inset_8px_2px_18px_rgba(137,190,255,.38),inset_-10px_-12px_22px_rgba(0,8,37,.55),0_18px_35px_rgba(0,0,0,.5)]" />
    <div className="absolute left-1/2 top-[28%] flex h-[40%] w-[80%] -translate-x-1/2 items-center justify-center gap-5 rounded-[24%] border border-slate-500/70 bg-[#07111f] shadow-[inset_0_0_20px_rgba(0,0,0,.9),0_4px_8px_rgba(0,0,0,.45)]">
      <motion.span className="relative h-8 w-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-500 shadow-[0_0_12px_rgba(125,211,252,.4)] sm:h-10 sm:w-10" animate={listening ? { scaleY: [1, 0.72, 1, 0.08, 1] } : { scaleY: [1, 1, 0.08, 1, 1] }} transition={{ duration: listening ? 0.9 : 2.6, repeat: Infinity, times: listening ? [0, 0.24, 0.45, 0.49, 1] : [0, 0.78, 0.82, 0.86, 1], ease: 'easeInOut' }}><i className="absolute left-[28%] top-[20%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_white]" /></motion.span>
      <motion.span className="relative h-8 w-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-500 shadow-[0_0_12px_rgba(125,211,252,.4)] sm:h-10 sm:w-10" animate={listening ? { scaleY: [1, 0.72, 1, 0.08, 1] } : { scaleY: [1, 1, 0.08, 1, 1] }} transition={{ duration: listening ? 0.9 : 2.6, repeat: Infinity, delay: 0.12, times: listening ? [0, 0.24, 0.45, 0.49, 1] : [0, 0.78, 0.82, 0.86, 1], ease: 'easeInOut' }}><i className="absolute left-[28%] top-[20%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_white]" /></motion.span>
      <span className="absolute bottom-[14%] left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-sky-200/70" />
    </div>
    <div className="absolute right-0 top-[40%] h-14 w-5 rotate-[-15deg] rounded-r-2xl bg-gradient-to-r from-blue-800 to-blue-500 shadow-md" />
  </motion.div>
)

const PortfolioAssistant = () => {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [chatMode, setChatMode] = useState<'voice' | 'text'>('voice')
  const [draft, setDraft] = useState('')
  const [showNudge, setShowNudge] = useState(false)
  const nudgeDismissed = useRef(false)
  const listRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollTo } = useSmoothScroll()
  const {
    messages, state, caption, voiceEnabled, voiceSupported, isSpeaking,
    sendMessage, startVoiceInput, startVoiceToText, stopVoiceInput, stopSpeaking,
    setVoiceEnabled, clearMessages,
  } = useAssistant((target) => scrollTo(target))
  const listening = state === 'listening'

  useEffect(() => {
    if (open) return
    stopVoiceInput()
    stopSpeaking()
  }, [open, stopSpeaking, stopVoiceInput])

  useEffect(() => {
    if (open) return
    const timer = window.setTimeout(() => {
      if (!nudgeDismissed.current) setShowNudge(true)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!showNudge) return
    const timer = window.setTimeout(() => {
      nudgeDismissed.current = true
      setShowNudge(false)
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [showNudge])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const submitMessage = (text: string) => {
    if (!text.trim()) return
    sendMessage(text)
    setDraft('')
  }

  const toggleListening = () => listening ? stopVoiceInput() : startVoiceInput()
  const toggleVoice = () => setVoiceEnabled(!voiceEnabled)
  const toggleAssistant = () => {
    nudgeDismissed.current = true
    setShowNudge(false)
    setOpen((value) => !value)
  }

  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant')
  const latestVoiceError = [...messages].reverse().find((message) => message.role === 'system' && message.messageType === 'error')
  const currentVoiceError = latestVoiceError && (!latestAssistantMessage || latestVoiceError.timestamp > latestAssistantMessage.timestamp)
    ? latestVoiceError
    : null

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[96] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="Sourav's portfolio assistant"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`portfolio-assistant-panel pointer-events-auto flex flex-col overflow-hidden rounded-[1.4rem] border border-cyan-100/45 bg-[#0b1420] text-gray-100 shadow-[0_24px_80px_rgba(0,0,0,.62),0_0_36px_rgba(34,211,238,.12)] ring-1 ring-white/10 ${expanded ? 'fixed inset-2 z-[101] h-auto w-auto sm:inset-3' : 'fixed inset-x-3 bottom-3 z-[101] h-[min(40rem,88dvh)] max-h-[calc(100dvh-1.5rem)] w-auto sm:relative sm:inset-auto sm:mb-3 sm:h-[min(37rem,calc(100dvh-7rem))] sm:max-h-none sm:w-[min(25rem,calc(100vw-2rem))]'}`}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-cyan-100/15 bg-[linear-gradient(115deg,#101e2b_0%,#101923_58%,#102c35_100%)] px-3 py-2 sm:px-4 sm:py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-cyan-200/35 bg-gradient-to-br from-cyan-300/20 to-emerald-400/10 text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_0_18px_rgba(34,211,238,.12)] sm:h-10 sm:w-10"><Bot size={21} /><span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#101923] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" /></span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-white sm:text-base">Sourav&apos;s Assistant</h2>
                  <p className="text-xs text-slate-400">Online · Portfolio guide</p>
                </div>
              </div>
              <div className="ml-1 flex shrink-0 items-center gap-0.5 sm:ml-2 sm:gap-1">
                <button type="button" onClick={clearMessages} aria-label="Start a new conversation" title="New conversation" className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white sm:p-2"><Eraser size={16} /></button>
                <button type="button" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? 'Exit full screen' : 'Expand assistant'} title={expanded ? 'Exit full screen' : 'Expand'} className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white sm:p-2">{expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" title="Close assistant" className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white sm:p-2"><X size={18} /></button>
              </div>
            </header>

            <div role="tablist" aria-label="Assistant mode" className="grid h-11 shrink-0 grid-cols-2 border-b border-white/10 bg-[#0b1420] sm:h-12">
              <button type="button" role="tab" aria-selected={chatMode === 'voice'} onClick={() => setChatMode('voice')} className={`flex items-center justify-center gap-2 border-b-2 text-sm font-semibold transition ${chatMode === 'voice' ? 'border-cyan-300 bg-cyan-300/[0.08] text-cyan-200' : 'border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'}`}><Mic size={17} />Voice</button>
              <button type="button" role="tab" aria-selected={chatMode === 'text'} onClick={() => { stopVoiceInput(); setChatMode('text') }} className={`flex items-center justify-center gap-2 border-b-2 text-sm font-semibold transition ${chatMode === 'text' ? 'border-cyan-300 bg-cyan-300/[0.08] text-cyan-200' : 'border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'}`}><MessageSquareText size={17} />Text</button>
            </div>

            {chatMode === 'voice' ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="assistant-avatar-stage relative flex min-h-[7rem] flex-1 items-center justify-center overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_50%_64%,rgba(34,211,238,.12),transparent_48%),radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,.10),transparent_58%),linear-gradient(145deg,#101e2a,#0b1420)] sm:min-h-[10rem]">
                  <div className="absolute inset-0 opacity-35" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle, #67e8f9 1px, transparent 1.5px)', backgroundSize: '73px 61px', maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 85%, transparent)' }} />
                  <VoiceStageMascot listening={listening || isSpeaking} />
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((bar) => <motion.span key={bar} className="w-1 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,.7)]" animate={listening || isSpeaking ? { height: [8, 23 + (bar % 3) * 6, 8], opacity: [0.5, 1, 0.5] } : { height: [7, 11 + (bar % 2) * 3, 7], opacity: 0.65 }} transition={{ duration: 0.65, repeat: Infinity, delay: bar * 0.08 }} />)}
                  </div>
                </div>

                <div aria-live="polite" className="assistant-voice-caption shrink-0 border-b border-white/15 px-3 py-2 sm:px-4 sm:py-2.5">
                  <p className={`max-h-28 min-h-10 overflow-y-auto overscroll-contain whitespace-pre-wrap break-words rounded-xl border px-3 py-2 text-[13px] leading-relaxed ${currentVoiceError && state === 'idle' ? 'border-amber-400/30 bg-amber-400/[0.06] text-amber-100' : 'border-white/10 bg-white/[0.04] text-slate-100'}`}>{caption?.text ?? (state === 'thinking' ? 'Thinking through the portfolio details…' : listening ? 'I’m listening. Ask me about Sourav’s work or projects.' : state === 'idle' && currentVoiceError ? currentVoiceError.text : latestAssistantMessage?.text)}</p>
                </div>

                <div className="assistant-voice-controls flex shrink-0 flex-col items-center gap-1.5 px-3 py-2 sm:gap-2 sm:px-4 sm:py-3">
                  <div className="flex w-full items-center justify-between px-2 text-[13px]">
                    <span className={listening || state === 'thinking' || isSpeaking ? 'font-medium text-emerald-300' : 'text-slate-400'}>{listening ? 'Listening…' : state === 'thinking' ? 'Thinking…' : isSpeaking ? 'Speaking…' : 'Ready'}</span>
                    <button type="button" onClick={toggleVoice} className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-emerald-300 transition hover:bg-emerald-400/10" aria-label={voiceEnabled ? 'Turn spoken answers off' : 'Turn spoken answers on'}>{voiceEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}{voiceEnabled ? 'Voice On' : 'Voice Off'}</button>
                  </div>
                  <motion.button type="button" onClick={isSpeaking ? stopSpeaking : toggleListening} aria-label={isSpeaking ? 'Stop speaking' : listening ? 'Stop listening' : 'Start voice conversation'} whileTap={reducedMotion ? undefined : { scale: 0.94 }} className={`assistant-voice-mic relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_0_3px_rgba(16,185,129,.18),0_8px_22px_rgba(0,0,0,.4)] transition hover:from-emerald-400 hover:to-teal-500 sm:h-16 sm:w-16 ${listening ? 'animate-pulse' : ''}`}>
                    {listening ? <MicOff size={23} /> : isSpeaking ? <Square size={20} /> : <Mic size={23} />}
                  </motion.button>
                  <p className="text-center text-[11px] text-slate-500">{voiceSupported ? 'Tap the microphone to ask by voice' : 'Voice input is unavailable in this browser; use the Text tab.'}</p>
                </div>
              </div>
            ) : (
              <>
                <div ref={listRef} data-lenis-prevent role="log" aria-live="polite" aria-label="Conversation messages" tabIndex={0} className="min-h-0 flex-1 touch-pan-y space-y-4 overflow-y-auto overscroll-contain bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,.08),transparent_55%)] px-3 py-3 sm:px-4 sm:py-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-400/60 bg-sky-950/80 text-sky-300"><Bot size={17} /></span>}
                      <div className="flex max-w-[86%] flex-col items-start gap-2">
                        <div className={`rounded-2xl border px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,.12)] ${message.role === 'visitor' ? 'rounded-br-md border-emerald-300/30 bg-gradient-to-br from-emerald-700 to-teal-800 text-white' : 'rounded-bl-md border-sky-200/10 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100'}`}>
                          <p className="whitespace-pre-line text-[13px] leading-relaxed sm:text-sm">{renderMessageText(message.text)}</p>
                          <time className="mt-2 block text-[10px] text-slate-400">{new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(message.timestamp)}</time>
                          {message.action?.type === 'navigate' && <button type="button" onClick={() => scrollTo(`#${message.action?.target ?? ''}`)} className="mt-2 text-xs font-semibold text-cyan-300 underline underline-offset-2">Open {message.action.target} section</button>}
                        </div>
                        {message.chips?.length ? <div className="flex flex-wrap gap-2">{message.chips.map((chip) => <button type="button" key={`${message.id}-${chip}`} onClick={() => submitMessage(chip)} className="rounded-full border border-white/35 px-3 py-1.5 text-left text-xs font-medium text-slate-200 transition hover:border-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200">{chip}</button>)}</div> : null}
                      </div>
                    </div>
                  ))}
                  {state === 'thinking' && <div className="flex items-center gap-2 pl-12 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin" /> Looking through Sourav’s portfolio…</div>}
                </div>

                <form onSubmit={(event) => { event.preventDefault(); submitMessage(draft) }} className="shrink-0 border-t border-cyan-100/10 bg-[linear-gradient(180deg,#101b27,#0c151f)] px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="mb-2 flex justify-start">
                    <button type="button" onClick={toggleVoice} className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-emerald-300 transition hover:bg-emerald-400/10" aria-label={voiceEnabled ? 'Turn spoken answers off' : 'Turn spoken answers on'}>{voiceEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}{voiceEnabled ? 'Voice On' : 'Voice Off'}</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Ask the portfolio assistant" placeholder="Ask me anything…" className="h-11 min-w-0 flex-1 rounded-xl border border-slate-500/60 bg-[#0a121b] px-3 text-[13px] text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25 sm:px-3.5" />
                    <button type="button" onClick={() => listening ? stopVoiceInput() : startVoiceToText(setDraft)} aria-label={listening ? 'Stop voice input' : 'Dictate a message'} title={voiceSupported ? 'Dictate a message' : 'Voice input is not supported in this browser'} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 transition ${listening ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/10'} disabled:opacity-40`} disabled={!voiceSupported}>{listening ? <MicOff size={18} /> : <Mic size={18} />}</button>
                    <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/40 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_0_rgba(255,255,255,.12)] transition hover:from-emerald-400 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} /></button>
                  </div>
                  <p className="mt-2 text-center text-[11px] text-slate-500">Ask about projects, skills, experience, or say “help”</p>
                </form>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <div className="relative flex items-center gap-3">
      <AnimatePresence>
        {showNudge && !open && (
          <motion.button type="button" onClick={toggleAssistant} aria-label="Open Sourav's portfolio assistant" initial={reducedMotion ? false : { opacity: 0, x: 8, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.96 }} transition={{ duration: 0.2 }} className="pointer-events-auto relative max-w-[min(17rem,calc(100vw-6rem))] rounded-2xl border border-emerald-300/60 bg-[#101820] px-4 py-3 text-left text-sm font-semibold text-white shadow-[0_12px_32px_rgba(0,0,0,.4),0_0_24px_rgba(16,185,129,.2)] after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2 after:border-y-[9px] after:border-y-transparent after:border-l-[9px] after:border-l-[#101820]">
            <span className="flex items-center gap-2"><span className="text-emerald-300">✦</span> Ask about Sourav&apos;s portfolio</span>
            <span className="mt-1 block text-xs font-normal text-slate-400">Projects, skills, or experience</span>
          </motion.button>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={toggleAssistant}
        aria-label={open ? 'Close portfolio assistant' : 'Open portfolio assistant'}
        aria-expanded={open}
        title="Ask Sourav's AI portfolio assistant"
        whileHover={reducedMotion ? undefined : { scale: 1.055, y: -2 }}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        className="group relative isolate pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-100 bg-[#071823] text-cyan-100 shadow-[0_10px_30px_rgba(2,8,23,.65),0_0_28px_rgba(34,211,238,.5)] ring-1 ring-cyan-100/35 transition duration-300 before:absolute before:inset-[3px] before:-z-10 before:rounded-full before:bg-[radial-gradient(circle_at_35%_25%,rgba(16,70,82,.98),rgba(4,12,22,1)_68%)] after:absolute after:-inset-1 after:-z-20 after:rounded-full after:border after:border-cyan-300 after:shadow-[0_0_20px_rgba(34,211,238,.58)] after:content-[''] after:transition-colors hover:border-white hover:shadow-[0_14px_36px_rgba(8,15,30,.5),0_0_36px_rgba(34,211,238,.72)] hover:after:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
      >
        {!open && !reducedMotion && <motion.span aria-hidden="true" className="absolute -inset-1 -z-10 rounded-full border border-cyan-200/85" animate={{ scale: [1, 1.16, 1], opacity: [0.92, 0.32, 0.92] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />}
        {open ? <X size={21} className="text-cyan-100" /> : (
          <motion.span
            aria-hidden="true"
            className="relative z-10 flex h-14 w-14 items-center justify-center drop-shadow-[0_0_14px_rgba(34,211,238,.62)]"
            animate={reducedMotion ? undefined : { y: [0, -1.5, 0] }}
            transition={reducedMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AssistantMascot />
          </motion.span>
        )}
      </motion.button>
      </div>
    </div>
  )
}

export default PortfolioAssistant
