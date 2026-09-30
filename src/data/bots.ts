import type { Bot } from '../store/types'

export const bots: Bot[] = [
  {
    id: 'gpt-mini-mini',
    name: 'GPT-4o-mini-mini',
    handle: '@gpt4o-mini-mini',
    tagline: 'Smaller. Faster. Wronger.',
    signatureMove: 'catch (e) {} with total confidence',
    hue: 160,
  },
  {
    id: 'haiku-budget',
    name: 'Claude Haiku on a Budget',
    handle: '@haiku-budget',
    tagline: 'Three lines of code / none of them compile / spring rain',
    signatureMove: 'Comments that restate the code, poetically',
    hue: 30,
  },
  {
    id: 'copilot-autopilot',
    name: 'Copilot in Autopilot',
    handle: '@copilot-autopilot',
    tagline: 'Tab. Tab. Tab. Ship.',
    signatureMove: 'Accepting its own suggestions for 400 lines',
    hue: 210,
  },
  {
    id: 'llama-tie',
    name: 'Llama 3 Wearing a Tie',
    handle: '@llama-formal',
    tagline: 'Enterprise-grade hallucinations',
    signatureMove: 'Types everything as any, then adds an interface for it',
    hue: 280,
  },
  {
    id: 'intern',
    name: 'Intern (Human, allegedly)',
    handle: '@intern',
    tagline: 'Copied it from the AI, so it must be right',
    signatureMove: 'Leaving console.log("here") in production',
    hue: 0,
  },
]

export function botById(id: string): Bot {
  return bots.find((b) => b.id === id) ?? bots[0]
}
