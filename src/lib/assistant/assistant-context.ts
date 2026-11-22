import { useCallback, useEffect, useRef, useState } from 'react'
import { askAssistant, createAssistantMemory, type AssistantMemory } from './engine'
import { welcomeReply } from './brain/brain'
import {
  cancelSpeaking,
  isSpeechRecognitionSupported,
  preloadVoices,
  speak,
  startListening,
  stopListening,
  type VoiceError,
} from './voice-service'

export type AssistantState = 'idle' | 'listening' | 'speaking' | 'thinking'
export type Message = {
  id: number
  role: 'assistant' | 'visitor' | 'system'
  text: string
  timestamp: number
  messageType?: 'normal' | 'error' | 'info'
  chips?: string[]
  action?: { type: 'navigate'; target: string }
}
export type Caption = { text: string; source: 'visitor' | 'assistant' }

const VOICE_KEY = 'sourav_assistant_voice_enabled'
const MAX_HISTORY = 6
const REMOTE_TIMEOUT_MS = 6500
const REMOTE_FAILURE_BUDGET = 2

const conciseVoiceReply = (text: string): string => {
  const plain = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/(?:^|\n)\s*[•*-]\s+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= 260) return plain

  const sentences = plain.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [plain]
  let summary = ''
  for (const sentence of sentences) {
    const next = `${summary} ${sentence}`.trim()
    if (next.length > 260) break
    summary = next
    if (summary.split(/\s+/).length >= 45) break
  }
  if (summary.length >= 60) return summary
  const words = plain.split(/\s+/)
  return `${words.slice(0, 40).join(' ')}${words.length > 40 ? '…' : ''}`
}

const readVoicePreference = (): boolean => {
  try { return window.localStorage.getItem(VOICE_KEY) !== 'false' } catch { return true }
}

const createMessage = (role: Message['role'], text: string, options: Partial<Message> = {}): Message => ({
  id: Date.now() + Math.random(), role, text, timestamp: Date.now(), messageType: 'normal', ...options,
})

interface RemoteResponse { text: string | null; disabled: boolean }

const askRemote = async (
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  context: string[]
): Promise<RemoteResponse> => {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS)
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, context }),
      signal: controller.signal,
    })
    const payload = await response.json() as { ok?: boolean; text?: string; reason?: string }
    return payload.ok && typeof payload.text === 'string' && payload.text.trim()
      ? { text: payload.text.trim(), disabled: false }
      : { text: null, disabled: payload.reason === 'no_key' }
  } catch {
    return { text: null, disabled: false }
  } finally {
    window.clearTimeout(timeout)
  }
}

export const useAssistant = (scrollTo: (target: string) => void) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const welcome = welcomeReply()
    return [createMessage('assistant', welcome.text, { chips: welcome.chips })]
  })
  const [state, setState] = useState<AssistantState>('idle')
  const [caption, setCaption] = useState<Caption | null>(null)
  const [voiceEnabled, setVoiceEnabledState] = useState(true)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const memory = useRef<AssistantMemory>(createAssistantMemory())
  const history = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const remoteFailures = useRef(0)
  const interimTranscript = useRef('')
  const textTranscript = useRef<((text: string) => void) | null>(null)
  const sequence = useRef(1)

  useEffect(() => {
    setVoiceSupported(isSpeechRecognitionSupported())
    setVoiceEnabledState(readVoicePreference())
    void preloadVoices()
  }, [])

  const addSystemMessage = useCallback((text: string, messageType: 'error' | 'info' = 'info') => {
    setMessages((current) => [...current, createMessage('system', text, { id: sequence.current++, messageType })])
  }, [])

  const speakReply = useCallback((text: string) => {
    const maxDuration = Math.min(120000, (text.length / 10) * 1000 + 15000)
    const watchdog = window.setTimeout(() => {
      cancelSpeaking()
      setState('idle')
      setCaption(null)
    }, maxDuration)
    speak(text,
      () => { window.clearTimeout(watchdog); setState('idle'); setCaption(null) },
      () => setState('speaking'),
      { onCaption: (chunk) => setCaption({ text: chunk, source: 'assistant' }) }
    )
  }, [])

  const addAssistantReply = useCallback((reply: {
    text: string
    speak: string
    chips: string[]
    action?: { type: 'navigate'; target: string }
  }) => {
    setMessages((current) => [...current, createMessage('assistant', reply.text, {
      id: sequence.current++, chips: reply.chips, action: reply.action,
    })])
    history.current = [...history.current, { role: 'assistant' as const, content: reply.text }].slice(-MAX_HISTORY)
    if (reply.action?.type === 'navigate') {
      window.setTimeout(() => scrollTo(`#${reply.action!.target}`), 350)
    }
    if (voiceEnabled && reply.speak.trim()) speakReply(conciseVoiceReply(reply.speak))
    else setState('idle')
  }, [scrollTo, speakReply, voiceEnabled])

  const processInput = useCallback(async (input: string) => {
    const text = input.trim().slice(0, 400)
    if (!text) return

    cancelSpeaking()
    setCaption(null)
    setMessages((current) => [...current, createMessage('visitor', text, { id: sequence.current++ })])
    const previousHistory = history.current.slice(-MAX_HISTORY)
    history.current = [...history.current, { role: 'user' as const, content: text }].slice(-MAX_HISTORY)
    setState('thinking')

    try {
      const turn = askAssistant(text, memory.current)
      memory.current = turn.memory
      let reply = turn.reply

      if (reply.needsAI && remoteFailures.current < REMOTE_FAILURE_BUDGET) {
        const remote = await askRemote(text, previousHistory, reply.context)
        if (remote.text) {
          remoteFailures.current = 0
          reply = { ...reply, text: remote.text, speak: remote.text, needsAI: false, handler: 'llm:fallback' }
        } else {
          remoteFailures.current = remote.disabled ? REMOTE_FAILURE_BUDGET : remoteFailures.current + 1
        }
      }
      addAssistantReply(reply)
    } catch {
      setState('idle')
      addAssistantReply({
        text: 'I ran into a problem answering that. Please try again, or ask about Sourav’s projects, skills, or experience.',
        speak: 'I ran into a problem answering that. Please try again.',
        chips: ['Show his projects', 'His tech stack', 'Contact Sourav'],
      })
    }
  }, [addAssistantReply])

  const sendMessage = useCallback((text: string) => {
    stopListening()
    interimTranscript.current = ''
    textTranscript.current = null
    void processInput(text)
  }, [processInput])

  const handleVoiceError = useCallback((error: VoiceError) => {
    setState('idle')
    setCaption(null)
    addSystemMessage(`${error.message} ${error.suggestion}`, 'error')
  }, [addSystemMessage])

  const startVoiceInput = useCallback(() => {
    if (!voiceSupported) {
      addSystemMessage('Voice input is not supported by this browser. Try Chrome or Edge, or type your question.', 'error')
      return
    }
    cancelSpeaking()
    setCaption(null)
    setState('listening')
    interimTranscript.current = ''
    textTranscript.current = null
    startListening((transcript, isFinal) => {
      setCaption({ text: transcript, source: 'visitor' })
      if (isFinal) {
        interimTranscript.current = ''
        void processInput(transcript)
      } else interimTranscript.current = transcript
    }, handleVoiceError, () => {
      setState((current) => current === 'listening' ? 'idle' : current)
    })
  }, [addSystemMessage, handleVoiceError, processInput, voiceSupported])

  const startVoiceToText = useCallback((onTranscript: (text: string) => void) => {
    if (!voiceSupported) {
      addSystemMessage('Voice input is not supported in this browser. Try Chrome or Edge.', 'error')
      return
    }
    cancelSpeaking()
    setState('listening')
    textTranscript.current = onTranscript
    interimTranscript.current = ''
    startListening((transcript, isFinal) => {
      setCaption({ text: transcript, source: 'visitor' })
      interimTranscript.current = transcript
      textTranscript.current?.(transcript)
      if (isFinal) {
        interimTranscript.current = ''
        textTranscript.current = null
        setState('idle')
        window.setTimeout(() => setCaption(null), 900)
      }
    }, handleVoiceError, () => {
      textTranscript.current = null
      setState((current) => current === 'listening' ? 'idle' : current)
    })
  }, [addSystemMessage, handleVoiceError, voiceSupported])

  const stopVoiceInput = useCallback(() => {
    const pending = interimTranscript.current.trim()
    const isDictation = textTranscript.current !== null
    stopListening()
    interimTranscript.current = ''
    textTranscript.current = null
    setCaption(null)
    setState((current) => current === 'listening' ? 'idle' : current)
    if (pending && !isDictation) void processInput(pending)
  }, [processInput])

  const stopSpeaking = useCallback(() => {
    cancelSpeaking()
    setCaption(null)
    setState((current) => current === 'speaking' || current === 'thinking' ? 'idle' : current)
  }, [])

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setVoiceEnabledState(enabled)
    try { window.localStorage.setItem(VOICE_KEY, String(enabled)) } catch { /* preference is optional */ }
    if (!enabled) stopSpeaking()
  }, [stopSpeaking])

  const clearMessages = useCallback(() => {
    const welcome = welcomeReply()
    setMessages([createMessage('assistant', welcome.text, { chips: welcome.chips })])
    memory.current = createAssistantMemory()
    history.current = []
    remoteFailures.current = 0
    setCaption(null)
    setState('idle')
    cancelSpeaking()
    stopListening()
  }, [])

  const isSpeaking = state === 'speaking'

  return {
    messages,
    state,
    caption,
    isOpen: true,
    voiceEnabled,
    voiceSupported,
    isSpeaking,
    suggestions: messages[messages.length - 1]?.chips ?? [],
    sendMessage,
    startVoiceInput,
    startVoiceToText,
    stopVoiceInput,
    stopSpeaking,
    setVoiceEnabled,
    clearMessages,
    addMessage: addSystemMessage,
  }
}
