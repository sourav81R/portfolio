export type VoiceError = {
  code: string
  message: string
  suggestion: string
}

type RecognitionResult = { transcript: string }
type RecognitionEvent = { resultIndex: number; results: ArrayLike<ArrayLike<RecognitionResult & { isFinal?: boolean }>> }
type RecognitionErrorEvent = { error?: string }
type RecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => RecognitionLike
  webkitSpeechRecognition?: new () => RecognitionLike
}

let recognition: RecognitionLike | null = null
let recognitionWatchdog = 0
let recognitionSession = 0
let speechSession = 0
let speaking = false
let speechKeepAlive = 0

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false
  const browser = window as SpeechWindow
  return Boolean(browser.SpeechRecognition ?? browser.webkitSpeechRecognition)
}

export const isSpeechSynthesisSupported = (): boolean => typeof window !== 'undefined' && 'speechSynthesis' in window
export const isVoiceSupported = (): boolean => isSpeechRecognitionSupported() && isSpeechSynthesisSupported()
export const isCurrentlyListening = (): boolean => recognition !== null
export const isCurrentlySpeaking = (): boolean => speaking

const voiceErrorDetails = (code: string): VoiceError => {
  if (code === 'not-allowed' || code === 'service-not-allowed') return {
    code, message: 'Microphone access is blocked.', suggestion: 'Allow microphone access in your browser’s site settings, then try again.',
  }
  if (code === 'no-speech') return { code, message: 'I did not hear anything that time.', suggestion: 'Move closer to your microphone and try again.' }
  if (code === 'audio-capture') return { code, message: 'No microphone was found.', suggestion: 'Connect or enable a microphone, or type your question instead.' }
  if (code === 'network') return { code, message: 'Voice recognition could not connect.', suggestion: 'Check your internet connection, or type your question instead.' }
  return { code, message: 'Voice input stopped unexpectedly.', suggestion: 'Please try again or type your question instead.' }
}

export const startListening = (
  onTranscript: (text: string, isFinal: boolean) => void,
  onError: (error: VoiceError) => void,
  onEnd: () => void,
  options: { language?: string; continuous?: boolean } = {}
): void => {
  stopListening()
  const browser = window as SpeechWindow
  const Recognition = browser.SpeechRecognition ?? browser.webkitSpeechRecognition
  if (!Recognition) {
    onError({ code: 'unsupported', message: 'Voice input is not supported in this browser.', suggestion: 'Use Chrome or Edge, or type your question.' })
    return
  }

  const instance = new Recognition()
  const session = ++recognitionSession
  recognition = instance
  instance.lang = options.language ?? 'en-IN'
  instance.continuous = options.continuous ?? false
  instance.interimResults = true
  instance.maxAlternatives = 1
  instance.onresult = (event) => {
    if (session !== recognitionSession) return
    const result = event.results[event.resultIndex]?.[0]
    const transcript = result?.transcript?.trim()
    if (transcript) onTranscript(transcript, Boolean(result.isFinal))
  }
  instance.onerror = (event) => {
    if (session !== recognitionSession) return
    clearTimeout(recognitionWatchdog)
    recognition = null
    onError(voiceErrorDetails(event.error ?? 'unknown'))
  }
  instance.onend = () => {
    if (session !== recognitionSession) return
    clearTimeout(recognitionWatchdog)
    recognition = null
    onEnd()
  }
  recognitionWatchdog = window.setTimeout(() => {
    if (session !== recognitionSession || !recognition) return
    recognition.stop()
  }, 12000)
  try {
    instance.start()
  } catch {
    clearTimeout(recognitionWatchdog)
    recognition = null
    onError(voiceErrorDetails('unknown'))
  }
}

export const stopListening = (): void => {
  clearTimeout(recognitionWatchdog)
  recognitionSession += 1
  const active = recognition
  recognition = null
  try { active?.stop() } catch { active?.abort() }
}

export const checkMicrophonePermission = async (): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> => {
  if (!navigator.permissions?.query) return 'unknown'
  try {
    const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    return permission.state
  } catch {
    return 'unknown'
  }
}

export const preloadVoices = (): Promise<SpeechSynthesisVoice[]> => new Promise((resolve) => {
  if (!isSpeechSynthesisSupported()) { resolve([]); return }
  const synth = window.speechSynthesis
  const loaded = synth.getVoices()
  if (loaded.length) { resolve(loaded); return }
  let timeout = 0
  const finish = () => {
    clearTimeout(timeout)
    synth.removeEventListener('voiceschanged', finish)
    resolve(synth.getVoices())
  }
  synth.addEventListener('voiceschanged', finish, { once: true })
  timeout = window.setTimeout(finish, 1400)
})

const speechChunks = (text: string, maxLength = 160): string[] => {
  const readable = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, 'link in the chat')
    .replace(/[*_`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const sentences = readable.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [readable]
  const chunks: string[] = []
  let current = ''
  for (const sentence of sentences) {
    for (const word of sentence.trim().split(/\s+/)) {
      if (!word) continue
      if (current && current.length + word.length + 1 > maxLength) {
        chunks.push(current)
        current = ''
      }
      if (word.length > maxLength) {
        for (let offset = 0; offset < word.length; offset += maxLength) {
          const piece = word.slice(offset, offset + maxLength)
          if (current) chunks.push(current)
          current = piece
          if (offset + maxLength < word.length) {
            chunks.push(current)
            current = ''
          }
        }
      } else current = current ? `${current} ${word}` : word
    }
  }
  if (current) chunks.push(current)
  return chunks.filter(Boolean)
}

export const speak = (
  text: string,
  onEnd?: () => void,
  onStart?: () => void,
  options: { onCaption?: (chunk: string) => void; language?: string } = {}
): void => {
  if (!isSpeechSynthesisSupported() || !text.trim()) { onEnd?.(); return }
  cancelSpeaking()
  const session = ++speechSession
  const synth = window.speechSynthesis
  const chunks = speechChunks(text)
  let index = 0
  let keepAliveTimer = 0
  const stopKeepAlive = () => {
    if (keepAliveTimer) window.clearInterval(keepAliveTimer)
    keepAliveTimer = 0
    speechKeepAlive = 0
  }
  const startKeepAlive = () => {
    stopKeepAlive()
    keepAliveTimer = window.setInterval(() => {
      if (synth.speaking && synth.paused) synth.resume()
    }, 5000)
    speechKeepAlive = keepAliveTimer
  }
  const next = () => {
    if (session !== speechSession) return
    if (index >= chunks.length) {
      speaking = false
      stopKeepAlive()
      onEnd?.()
      return
    }
    const chunk = chunks[index++]
    const utterance = new SpeechSynthesisUtterance(chunk)
    utterance.lang = options.language ?? 'en-IN'
    utterance.rate = 0.98
    utterance.pitch = 1.02
    const voices = synth.getVoices()
    utterance.voice = voices.find((voice) => /^en[-_]in$/i.test(voice.lang))
      ?? voices.find((voice) => /^en[-_]gb$/i.test(voice.lang))
      ?? voices.find((voice) => /^en/i.test(voice.lang))
      ?? null
    let settled = false
    let started = false
    let startWatchdog = 0
    let chunkWatchdog = 0
    const advance = () => {
      if (session !== speechSession || settled) return
      settled = true
      window.clearTimeout(startWatchdog)
      window.clearTimeout(chunkWatchdog)
      window.setTimeout(next, 100)
    }
    startWatchdog = window.setTimeout(() => {
      if (session !== speechSession || started || settled) return
      synth.cancel()
      advance()
    }, 3000)
    chunkWatchdog = window.setTimeout(() => {
      if (session !== speechSession || settled) return
      synth.cancel()
      advance()
    }, Math.max(20000, (chunk.length / 7) * 1000 + 6000))
    utterance.onstart = () => {
      if (session !== speechSession) return
      started = true
      window.clearTimeout(startWatchdog)
      speaking = true
      startKeepAlive()
      onStart?.()
      options.onCaption?.(chunk)
    }
    utterance.onend = advance
    utterance.onerror = advance
    synth.speak(utterance)
  }
  // Chrome can drop utterances queued in the same tick as cancel().
  window.setTimeout(next, 100)
}

export const cancelSpeaking = (): void => {
  speechSession += 1
  speaking = false
  if (speechKeepAlive && typeof window !== 'undefined') window.clearInterval(speechKeepAlive)
  speechKeepAlive = 0
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
