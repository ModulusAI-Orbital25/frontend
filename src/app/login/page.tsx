'use client';
import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:5000';

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/login`,
        { username : username, password: password }, // password will be added later
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      setMessage('🎉 Login successful!');
    } catch (err) {
      setMessage('❌ Login failed. Please check your credentials.');
    }
  };

  return (
    <div
      style={{
        background: '#f9f9fb',
        minHeight: '100vh',
        padding: '2rem 2rem',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
      }}
    >
      <Container style={{ maxWidth: '450px' }}>
        <h1
          style={{
            fontFamily: `'Georgia', 'Times New Roman', serif`,
            fontWeight: 'bold',
            fontSize: '2.8rem',
            color: '#1a1a1a',
            textAlign: 'center',
          }}
        >
          ModulusAI
        </h1>

        <Card className="mt-5 shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <Card.Body>
            <h4 style={{ fontWeight: 500 }}>🔐 Login</h4>

            <Form.Group className="mt-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Arjun"
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="warning"
              className="mt-4 w-100"
              style={{ borderRadius: '12px', padding: '0.75rem' }}
              onClick={handleLogin}
            >
              Log In
            </Button>
          </Card.Body>
        </Card>

        {message && (
          <Alert
            variant={message.startsWith('🎉') ? 'success' : 'danger'}
            className="text-center mt-4"
            style={{ borderRadius: '12px', fontSize: '1rem' }}
          >
            {message}
          </Alert>
        )}
      </Container>
    </div>
  );
}
