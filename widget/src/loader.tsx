import { render } from 'preact'
import { App } from './App'
// The ?inline suffix allows us to grab the compiled CSS as a raw string from Vite 
// to inject directly into the Shadow DOM without an external stylesheet loading.
import widgetCss from './App.css?inline'

const WIDGET_TAG = 'intracom-widget'

function initWidget() {
  if (document.querySelector(WIDGET_TAG)) {
    console.warn('Intracom Widget is already initialized on this page.')
    return
  }

  // Find the initialization script tag params if needed (e.g. data-app-id)
  const scriptTag = document.currentScript || document.querySelector(`script[src*="widget.js"]`)
  const appId = scriptTag?.getAttribute('data-app-id') || 'default-app-id'

  const container = document.createElement(WIDGET_TAG)
  document.body.appendChild(container)

  const shadowRoot = container.attachShadow({ mode: 'open' })

  // Inject styles completely isolated from the host page
  const styleEl = document.createElement('style')
  styleEl.textContent = widgetCss
  shadowRoot.appendChild(styleEl)

  // Mount the Preact Application inside the shadow root 
  // We use shadowRoot as the mounting container
  render(<App appId={appId} />, shadowRoot)
}

initWidget()

declare global {
  interface Window {
    Intracom: any
  }
}

// (Optional) Expose a global API for clients to control the widget
window.Intracom = {
  open: () => document.querySelector(WIDGET_TAG)?.dispatchEvent(new CustomEvent('intracom-open')),
  close: () => document.querySelector(WIDGET_TAG)?.dispatchEvent(new CustomEvent('intracom-close'))
}
