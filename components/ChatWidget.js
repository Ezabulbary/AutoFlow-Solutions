'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';

const GREETING = { role: 'assistant', content: "Hi! 👋 I'm Maya from AutoFlow. How can I help you automate your business today?" };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function send(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I didn't catch that — could you try again?";
      // small human-like delay
      setTimeout(() => {
        setMessages((m) => [...m, { role: 'assistant', content: reply }]);
        setTyping(false);
      }, 500);
    } catch {
      setTyping(false);
      setMessages((m) => [...m, { role: 'assistant', content: 'Hmm, I had trouble sending that. Mind trying again?' }]);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Chat with support">
          <div className={styles.header}>
            <div className={styles.headAvatar}>M</div>
            <div>
              <div className={styles.headName}>Maya · AutoFlow</div>
              <div className={styles.headStatus}><span className={styles.dot} /> Online now</div>
            </div>
          </div>

          <div className={styles.body} ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.user : styles.bot}`}>
                {m.content}
              </div>
            ))}
            {typing && (
              <div className={`${styles.msg} ${styles.bot} ${styles.typing}`}>
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className={styles.inputRow} onSubmit={send}>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || typing} aria-label="Send">➤</button>
          </form>
        </div>
      )}
    </>
  );
}
