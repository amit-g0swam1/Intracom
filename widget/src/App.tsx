import { useEffect } from 'preact/hooks'
import { useWidgetStore } from './store/useWidgetStore'

interface AppProps {
  appId: string
}

export function App({ appId }: AppProps) {
  const { isOpen, toggleWidget, unreadCount } = useWidgetStore()

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

  return (
    <div class="intracom-container">
      {isOpen && (
        <div class="intracom-window">
          <div class="intracom-header">
            <h3>Intracom ({appId})</h3>
            <button class="close-btn" onClick={toggleWidget}>&times;</button>
          </div>
          <div class="intracom-messages">
            <p>Welcome! How can we help you today?</p>
          </div>
          <div class="intracom-input">
            <input type="text" placeholder="Send a message..." />
            <button>&rarr;</button>
          </div>
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
