import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    source: string;
    chapter: string;
    page_url: string;
    relevance_score: number;
  }>;
  selected_text_used?: boolean;
}

interface ChatbotProps {
  apiUrl?: string;
}

export default function Chatbot({ apiUrl = 'http://localhost:8000' }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for text selection events
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      if (selectedText && selectedText.length > 10) {
        setSelectedText(selectedText);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          selected_text: selectedText || undefined,
          conversation_id: conversationId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        sources: data.sources,
        selected_text_used: data.selected_text_used,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Clear selected text after using it
      if (data.selected_text_used) {
        setSelectedText('');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId('');
    setSelectedText('');
  };

  const useSelectedText = () => {
    if (selectedText) {
      setInput(`Can you explain this: "${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}"`);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className={styles.chatToggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
        {!isOpen && messages.length > 0 && (
          <span className={styles.unreadBadge}>{messages.length}</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatContainer}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <h3>Physical AI Assistant</h3>
              <p className={styles.status}>
                {selectedText ? (
                  <span className={styles.hasSelection}>📝 Text selected - Click "Use Selection" to ask about it</span>
                ) : (
                  'Online'
                )}
              </p>
            </div>
            <div className={styles.headerActions}>
              {selectedText && (
                <button
                  className={styles.useSelectionBtn}
                  onClick={useSelectedText}
                  title="Use selected text in question"
                >
                  Use Selection
                </button>
              )}
              <button
                className={styles.clearBtn}
                onClick={clearChat}
                title="Clear conversation"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.welcomeMessage}>
                <h4>👋 Welcome!</h4>
                <p>I'm your Physical AI textbook assistant.</p>
                <ul>
                  <li>Ask questions about ROS 2, Gazebo, NVIDIA Isaac, and more</li>
                  <li>Select text in the textbook and click "Use Selection" to ask about it</li>
                  <li>I'll answer based on the textbook content</li>
                </ul>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${styles[message.role]}`}
                >
                  <div className={styles.messageContent}>
                    {message.content}
                    {message.sources && message.sources.length > 0 && (
                      <div className={styles.sources}>
                        <h5>Sources:</h5>
                        {message.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.page_url}
                            className={styles.sourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📖 {source.chapter} ({Math.round(source.relevance_score * 100)}% match)
                          </a>
                        ))}
                      </div>
                    )}
                    {message.selected_text_used && (
                      <p className={styles.selectionNote}>
                        ✅ Answered using your selected text
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about Physical AI..."
              rows={2}
              disabled={isLoading}
              className={styles.input}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={styles.sendButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
