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

const AssistantWaveform = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <span className="relative flex h-7 items-center justify-center gap-[3px]" aria-hidden="true">
    {[8, 14, 20, 15, 9].map((height, index) => (
      <motion.span
        key={index}
        className="w-[2.5px] origin-center rounded-full bg-gradient-to-b from-cyan-100 via-cyan-300 to-sky-500 shadow-[0_0_9px_rgba(34,211,238,.95)]"
        style={{ height }}
        animate={reducedMotion ? undefined : { scaleY: [0.55, 1, 0.68, 0.92, 0.55], opacity: [0.65, 1, 0.78, 1, 0.65] }}
        transition={reducedMotion ? undefined : { duration: 1.15, repeat: Infinity, delay: index * 0.09, ease: 'easeInOut' }}
      />
    ))}
  </span>
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
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!showNudge) return
    const timer = window.setTimeout(() => {
      nudgeDismissed.current = true
      setShowNudge(false)
    }, 4500)
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
            className={`portfolio-assistant-panel pointer-events-auto flex flex-col overflow-hidden rounded-[1.4rem] border border-white/80 bg-[#101820] text-gray-100 shadow-2xl shadow-black/50 ring-1 ring-black/30 ${expanded ? 'fixed inset-2 z-[101] h-auto w-auto sm:inset-3' : 'fixed inset-x-3 bottom-3 z-[101] h-[min(40rem,88dvh)] max-h-[calc(100dvh-1.5rem)] w-auto sm:relative sm:inset-auto sm:mb-3 sm:h-[min(37rem,calc(100dvh-7rem))] sm:max-h-none sm:w-[min(25rem,calc(100vw-2rem))]'}`}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-white/15 bg-[#131e28] px-3 py-2 sm:px-4 sm:py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-gradient-to-br from-sky-950 to-black text-cyan-300 shadow-inner sm:h-10 sm:w-10"><Bot size={21} /><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#131e28] bg-emerald-400" /></span>
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

            <div role="tablist" aria-label="Assistant mode" className="grid h-11 shrink-0 grid-cols-2 border-b border-white/15 bg-[#101820] sm:h-12">
              <button type="button" role="tab" aria-selected={chatMode === 'voice'} onClick={() => setChatMode('voice')} className={`flex items-center justify-center gap-2 border-b-2 text-sm font-semibold transition ${chatMode === 'voice' ? 'border-emerald-400 bg-emerald-400/[0.08] text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}><Mic size={17} />Voice</button>
              <button type="button" role="tab" aria-selected={chatMode === 'text'} onClick={() => { stopVoiceInput(); setChatMode('text') }} className={`flex items-center justify-center gap-2 border-b-2 text-sm font-semibold transition ${chatMode === 'text' ? 'border-emerald-400 bg-emerald-400/[0.08] text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}><MessageSquareText size={17} />Text</button>
            </div>

            {chatMode === 'voice' ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="assistant-avatar-stage relative flex min-h-[7rem] flex-1 items-center justify-center overflow-hidden border-b border-white/20 bg-[radial-gradient(ellipse_at_50%_48%,rgba(16,185,129,0.18),transparent_60%),linear-gradient(145deg,#131e28,#101820)] sm:min-h-[10rem]">
                  <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle, #92c5ff 1px, transparent 1.5px)', backgroundSize: '73px 61px', maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 85%, transparent)' }} />
                  <motion.div aria-hidden="true" className="assistant-mascot relative h-28 w-28 sm:h-40 sm:w-40 lg:h-48 lg:w-48" animate={listening || isSpeaking ? { y: [0, -7, 0], rotate: [0, 1.5, 0] } : { y: [0, -4, 0], rotate: [0, -1, 0] }} transition={{ duration: listening ? 0.8 : 3.8, repeat: Infinity, ease: 'easeInOut' }}>
                    <div className="absolute left-1/2 top-2 h-8 w-2 -translate-x-1/2 rounded-full bg-gradient-to-t from-blue-700 to-sky-300 shadow-[0_0_16px_rgba(96,165,250,.6)]" />
                    <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full border border-sky-300/70 bg-sky-300 shadow-[0_0_20px_rgba(96,165,250,.75)]" />
                    <div className="absolute inset-x-2 bottom-1 top-8 rounded-[34%_34%_30%_30%] border border-blue-400/50 bg-[linear-gradient(125deg,#0b43a1_4%,#0757c9_36%,#063580_70%,#021d57)] shadow-[inset_8px_2px_18px_rgba(137,190,255,.38),inset_-10px_-12px_22px_rgba(0,8,37,.55),0_18px_35px_rgba(0,0,0,.5)]" />
                    <div className="absolute left-1/2 top-[28%] flex h-[40%] w-[80%] -translate-x-1/2 items-center justify-center gap-5 rounded-[24%] border border-slate-500/70 bg-[#07111f] shadow-[inset_0_0_20px_rgba(0,0,0,.9),0_4px_8px_rgba(0,0,0,.45)]">
                      <motion.span className="relative h-8 w-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-500 shadow-[0_0_12px_rgba(125,211,252,.4)] sm:h-10 sm:w-10" animate={listening ? { scaleY: [1, 0.65, 1] } : { scaleY: [1, 0.96, 1] }} transition={{ duration: listening ? 0.45 : 4, repeat: Infinity }}><i className="absolute left-[28%] top-[20%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_white]" /></motion.span>
                      <motion.span className="relative h-8 w-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-500 shadow-[0_0_12px_rgba(125,211,252,.4)] sm:h-10 sm:w-10" animate={listening ? { scaleY: [1, 0.65, 1] } : { scaleY: [1, 0.96, 1] }} transition={{ duration: listening ? 0.45 : 4, repeat: Infinity, delay: 0.12 }}><i className="absolute left-[28%] top-[20%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_white]" /></motion.span>
                      <span className="absolute bottom-[14%] left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-sky-200/70" />
                    </div>
                    <div className="absolute right-0 top-[40%] h-14 w-5 rotate-[-15deg] rounded-r-2xl bg-gradient-to-r from-blue-800 to-blue-500 shadow-md" />
                  </motion.div>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((bar) => <motion.span key={bar} className="w-1 rounded-full bg-emerald-300" animate={listening || isSpeaking ? { height: [8, 23 + (bar % 3) * 6, 8], opacity: [0.5, 1, 0.5] } : { height: [7, 11 + (bar % 2) * 3, 7], opacity: 0.65 }} transition={{ duration: 0.65, repeat: Infinity, delay: bar * 0.08 }} />)}
                  </div>
                </div>

                <div aria-live="polite" className="assistant-voice-caption shrink-0 border-b border-white/15 px-3 py-2 sm:px-4 sm:py-2.5">
                  <p className="max-h-28 min-h-10 overflow-y-auto overscroll-contain whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] leading-relaxed text-slate-100">{caption?.text ?? (state === 'thinking' ? 'Thinking through the portfolio details…' : listening ? 'I’m listening. Ask me about Sourav’s work or projects.' : latestAssistantMessage?.text)}</p>
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
                <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,.08),transparent_55%)] px-3 py-3 sm:px-4 sm:py-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-400/60 bg-sky-950/80 text-sky-300"><Bot size={17} /></span>}
                      <div className="flex max-w-[86%] flex-col items-start gap-2">
                        <div className={`rounded-2xl border px-3.5 py-2.5 ${message.role === 'visitor' ? 'rounded-br-md border-emerald-400/35 bg-emerald-950/45 text-gray-100' : 'rounded-bl-md border-white/10 bg-slate-800/80 text-gray-100'}`}>
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

                <form onSubmit={(event) => { event.preventDefault(); submitMessage(draft) }} className="shrink-0 border-t border-white/20 bg-[#131e28] px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="mb-2 flex justify-start">
                    <button type="button" onClick={toggleVoice} className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-emerald-300 transition hover:bg-emerald-400/10" aria-label={voiceEnabled ? 'Turn spoken answers off' : 'Turn spoken answers on'}>{voiceEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}{voiceEnabled ? 'Voice On' : 'Voice Off'}</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Ask the portfolio assistant" placeholder="Ask me anything…" className="h-11 min-w-0 flex-1 rounded-xl border border-white/35 bg-[#101820] px-3 text-[13px] text-white outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/35 sm:px-3.5" />
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
        className="group relative isolate pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-100 bg-[#0b1720] text-emerald-200 shadow-[0_10px_28px_rgba(8,15,30,.4),0_0_24px_rgba(16,185,129,.35)] ring-1 ring-slate-950/20 transition duration-300 before:absolute before:inset-[3px] before:-z-10 before:rounded-full before:bg-[radial-gradient(circle_at_35%_25%,rgba(30,64,64,.98),rgba(7,10,16,1)_60%)] after:absolute after:-inset-1 after:-z-20 after:rounded-full after:border after:border-emerald-400/85 after:shadow-[0_0_16px_rgba(16,185,129,.35)] after:content-[''] after:transition-colors hover:border-emerald-100 hover:shadow-[0_14px_36px_rgba(8,15,30,.46),0_0_34px_rgba(16,185,129,.48)] hover:after:border-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
      >
        {!open && !reducedMotion && <motion.span aria-hidden="true" className="absolute -inset-1 -z-10 rounded-full border border-emerald-400/65" animate={{ scale: [1, 1.12, 1], opacity: [0.8, 0.24, 0.8] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />}
        {open ? <X size={21} className="text-emerald-200" /> : <AssistantWaveform reducedMotion={Boolean(reducedMotion)} />}
      </motion.button>
      </div>
    </div>
  )
}

export default PortfolioAssistant
