import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css"; // Add this line
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

function sendLog(payload) {
  try {
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (_) {
    // ignore network errors
  }
}

const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError(...args);
  sendLog({
    level: 'error',
    message: args.map((a) => (a && a.stack) ? a.stack : a).join(' '),
  });
};

window.addEventListener('error', (event) => {
  sendLog({ level: 'error', message: event.message, stack: event.error?.stack });
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason || {};
  sendLog({ level: 'error', message: reason.message || String(reason), stack: reason.stack });
});

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
