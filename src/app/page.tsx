'use client';

import { Container, Button, Card, Row, Col } from 'react-bootstrap';

export default function Home() {
  return (
    <div
      style={{
        background: '#f9f9fb',
        minHeight: '100vh',
        padding: '4rem 1rem',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
      }}
    >
      <Container style={{ maxWidth: '900px' }}>
        <h1
          style={{
            fontFamily: `'Georgia', 'Times New Roman', serif`,
            fontWeight: 'bold',
            fontSize: '3rem',
            color: '#1a1a1a',
            textAlign: 'center',
          }}
        >
          ModulusAI
        </h1>

        <p className="text-center mt-3" style={{ fontSize: '1.2rem', color: '#555' }}>
          🎓 Your Intelligent NUS Academic Planner – Built to Balance, Predict, and Optimize.
        </p>

        <Row className="mt-5 g-4">
          <Col md={6}>
            <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <Card.Body>
                <h5>📅 4-Year Planner</h5>
                <p>
                  Automatically generate a personalized module schedule based on your interests, major requirements, and internship plans.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <Card.Body>
                <h5>🧠 Smart Chatbot Assistant</h5>
                <p>
                  Chat with ModulusAI to discover suitable modules, avoid clashes, and get study-friendly suggestions tailored to your goals.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <Card.Body>
                <h5>📊 Sentiment-Based Reviews</h5>
                <p>
                  Make informed choices with community-driven feedback and sentiment analysis of past module reviews.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <Card.Body>
                <h5>🎯 Bidding Strategy Helper</h5>
                <p>
                  Access historical bidding data + your interests to optimize module ranking and CAP-safe planning.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-5">
          <Button href="/register" variant="dark" style={{ padding: '0.8rem 2rem', borderRadius: '12px' }}>
            Get Started →
          </Button>
        </div>
      </Container>
    </div>
  );
}
