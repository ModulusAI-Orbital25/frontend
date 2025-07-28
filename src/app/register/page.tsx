'use client';
import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

export default function Home() {
  const [name1, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  const registerUser = async () => {
    try {
      const res1 = await axios.post(
        `${backendUrl}/profile/register`,
        {
          username: name1,
          password: password, 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, 
        }
      );
      setMessage('🎉 Success!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error during registration');
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

        <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <Card.Body>
            <h4 style={{ fontWeight: 500 }}>👤 Register</h4>

            <Form.Group className="mt-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Arjun"
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="warning"
              className="mt-4 w-100"
              style={{ borderRadius: '12px', padding: '0.75rem' }}
              onClick={registerUser}
            >
              Register
            </Button>
          </Card.Body>
        </Card>

        {message && (
          <Alert
            variant={
              message.startsWith('🎉') ? 'success' : message.startsWith('⚠️') ? 'warning' : 'danger'
            }
            className="text-center"
            style={{ borderRadius: '12px', fontSize: '1rem' }}
          >
            {message}
          </Alert>
        )}
      </Container>
    </div>
  );
}
