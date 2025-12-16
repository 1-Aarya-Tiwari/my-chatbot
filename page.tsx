'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { useEffect, useRef, useState } from 'react'

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="animate-bounce [animation-delay:0ms]">.</span>
      <span className="animate-bounce [animation-delay:150ms]">.</span>
      <span className="animate-bounce [animation-delay:300ms]">.</span>
    </span>
  )
}

export default function Page() {
  const [input, setInput] = useState('')

  const { messages, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const isThinking =
    messages.length > 0 &&
    messages[messages.length - 1].role === 'user'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    await sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: input }],
    })

    setInput('')
  }

  function renderMessage(m: UIMessage) {
    return m.parts
      ?.map((p) => (p.type === 'text' ? p.text : ''))
      .join('')
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">🤖 My AI Chatbot</h1>

      <div className="flex-1 overflow-y-auto space-y-3 border rounded p-3 bg-gray-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === 'user' ? 'text-right' : 'text-left'}
          >
            <div
              className={`inline-block px-3 py-2 rounded ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white'
              }`}
            >
              {renderMessage(m)}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="text-left text-sm text-gray-500 px-3">
            Thinking<TypingDots />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  )
}
