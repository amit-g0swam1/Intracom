import { useEffect, useState, useRef } from 'preact/hooks'
import { useWidgetStore } from './store/useWidgetStore'

interface AppProps {
  appId: string
}

export function App({ appId }: AppProps) {
  const { 
    isOpen, 
    toggleWidget, 
    unreadCount, 
    messages, 
    sendMessage, 
    initChat, 
    isConnected 
  } = useWidgetStore()
  
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize socket connection on mount
    initChat()
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Listen to custom events dispatched via the window.Intracom API
  useEffect(() => {
    const handleOpen = () => {
      const store = useWidgetStore.getState()
      if (!store.isOpen) store.toggleWidget()
    }
    const handleClose = () => {
      const store = useWidgetStore.getState()
      if (store.isOpen) store.toggleWidget()
    }

    const host = document.querySelector('intracom-widget')
    host?.addEventListener('intracom-open', handleOpen)
    host?.addEventListener('intracom-close', handleClose)

    return () => {
      host?.removeEventListener('intracom-open', handleOpen)
      host?.removeEventListener('intracom-close', handleClose)
    }
  }, [])

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (inputText.trim()) {
      sendMessage(inputText.trim())
      setInputText('')
    }
  }

  return (
    <div class="intracom-container">
      {isOpen && (
        <div class="intracom-window">
          <div class="intracom-header">
            <div class="title-container">
              <span class={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              <h3>Intracom ({appId})</h3>
            </div>
            <button class="close-btn" onClick={toggleWidget}>&times;</button>
          </div>
          <div class="intracom-messages">
            {messages.length === 0 ? (
               <p class="welcome-text">Welcome! How can we help you today?</p>
            ) : (
               messages.map(msg => (
                 <div key={msg.id} class={`message ${msg.isAdmin ? 'admin' : 'user'}`}>
                   <span class="message-text">{msg.text}</span>
                 </div>
               ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form class="intracom-input" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Send a message..." 
              value={inputText}
              onInput={(e) => setInputText((e.target as HTMLInputElement).value)}
            />
            <button type="submit" disabled={!isConnected || !inputText.trim()}>&rarr;</button>
          </form>
        </div>
      )}
      
      <button class="intracom-launcher" onClick={toggleWidget}>
        {isOpen ? (
          <span>&#x2715;</span> // X icon
        ) : (
          <span>&#x1F4AC;</span> // Chat icon
        )}
        {!isOpen && unreadCount > 0 && <span class="badge">{unreadCount}</span>}
      </button>
    </div>
  )
}
