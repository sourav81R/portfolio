import { createAssistantMemory, respond, type AssistantMemory, type AssistantReply } from './brain/brain'
import { handlePersonalityQuery } from './personality-engine'
import { processUtilityQuery } from './utility-engine'

export interface AssistantTurn {
  reply: AssistantReply
  memory: AssistantMemory
}

export { createAssistantMemory, type AssistantMemory, type AssistantReply }

export const askAssistant = (input: string, memory: AssistantMemory = createAssistantMemory()): AssistantTurn => {
  const utility = processUtilityQuery(input)
  if (utility) {
    return {
      reply: {
        text: utility.text,
        speak: utility.speak,
        chips: ['Show his projects', 'His tech stack', 'Contact Sourav'],
        confidence: 1,
        needsAI: false,
        context: [],
        handler: utility.handler,
      },
      memory: { ...memory, turn: memory.turn + 1 },
    }
  }

  const turn = respond(input, memory)
  if (turn.reply.needsAI) {
    const personality = handlePersonalityQuery(input)
    if (personality) {
      return {
        reply: {
          text: personality.text,
          speak: personality.text,
          chips: ['Show his projects', 'His tech stack', 'Contact Sourav'],
          confidence: 0.95,
          needsAI: false,
          context: [],
          handler: `personality:${personality.kind}`,
        },
        memory: turn.memory,
      }
    }
  }
  return turn
}

export default askAssistant
