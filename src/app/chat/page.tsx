// pages/chat.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const oldMessages = messages;
    const newMessages = [...messages, { sender: 'user' as 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/chat/groq`,
        { message: input, history: oldMessages },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      const data = res.data;
      setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'bot', text: 'Error: Could not fetch response.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-start min-vh-100 pt-2 bg-light">
      <Card style={{ width: '100%', maxWidth: '720px' }} className="shadow-lg border-0 rounded-4 mt-2">
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-3">🎓 ModulusAI Chatbot</Card.Title>

          <div
            ref={chatRef}
            style={{ height: '400px', overflowY: 'auto', backgroundColor: '#f1f3f5', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    backgroundColor: msg.sender === 'user' ? '#007bff' : '#e2e3e5',
                    color: msg.sender === 'user' ? 'white' : 'black',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                    fontSize: '0.95rem',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-muted small">ModulusAI is typing... <Spinner animation="grow" size="sm" /></div>
            )}
          </div>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Form.Group className="d-flex gap-2">
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about modules, majors, internships..."
                disabled={loading}
              />
              <Button type="submit" disabled={loading} variant="warning">
                Send
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
