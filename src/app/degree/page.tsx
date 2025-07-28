'use client';
import React, { useEffect, useState, FC } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';

// Configure axios to point at your backend and include credentials
axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
axios.defaults.withCredentials = true;

interface ClassifyResponse {
  courses: string[][];
}

interface RequirementsResponse {
  message: boolean;
}

interface CategoryItem {
  name: string;
  codes: string[];
}

interface GroupedCategory {
  groupName: string;
  items: CategoryItem[];
}

const ModuleRequirements: FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [classified, setClassified] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const catsRes: AxiosResponse<{ categories: string[] }> = await axios.get('/modules/requirements');
        const clsRes: AxiosResponse<ClassifyResponse> = await axios.get('/modules/classify');
        setCategories(catsRes.data.categories);
        setClassified(clsRes.data.courses);
      } catch (err: any) {
        setError(err.message || 'Failed to load module data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    setError(null);
    try {
      const res: AxiosResponse<RequirementsResponse> = await axios.post(
        '/modules/requirements',
        { courses: classified }
      );
      setVerifyResult(res.data.message);
    } catch (err: any) {
      setVerifyResult(false);
      setError(err.message || 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Identify core CS modules
  const coreIndices = categories
    .map((name, idx) => ({ name, idx }))
    .filter(({ name }) => name.includes('CS'))
    .map(({ idx }) => idx);
  // Identify math modules
  const mathIndices = categories
    .map((name, idx) => ({ name, idx }))
    .filter(({ name }) => /(MA1521|MA1522|ST2334)/.test(name))
    .map(({ idx }) => idx);

  // Group categories
  const grouped: GroupedCategory[] = [];
  if (coreIndices.length) {
    grouped.push({
      groupName: 'Core CS Modules',
      items: coreIndices.map(i => ({ name: categories[i], codes: classified[i] }))
    });
  }
  if (mathIndices.length) {
    grouped.push({
      groupName: 'Mathematics Requirements',
      items: mathIndices.map(i => ({ name: categories[i], codes: classified[i] }))
    });
  }

  const groupedSet = new Set([...coreIndices, ...mathIndices]);
  const individual: CategoryItem[] = categories
    .map((name, idx) => ({ name, codes: classified[idx] }))
    .filter((_, idx) => !groupedSet.has(idx));

  // Define bootstrap color variants
  const allVariants = ['primary','secondary','success','danger','warning','info','light','dark'];

  return (
    <Container className="my-4">
      <h2 className="text-center mb-5">📚 Your Module Classification 📚</h2>
      <Row xs={1} className="g-4">
        {grouped.map((group, gIdx) => {
          const borderVariant = group.groupName === 'Core CS Modules' ? 'danger' : 'success';
          const palette = allVariants.filter(v => v !== borderVariant);
          return (
            <Col key={gIdx}>
              <Card className={`mb-4 border-${borderVariant}`}>
                <Card.Header className={`bg-${borderVariant} text-white`}>
                  <strong>{group.groupName}</strong>
                </Card.Header>
                <Card.Body>
                  {group.items.map((item, idx) => (
                    <div key={idx} className="mb-3">
                      <h5 className="mb-2">{item.name}</h5>
                      <div className="d-flex flex-wrap">
                        {item.codes.map((code, j) => (
                          <Button
                            key={code}
                            variant={palette[j % palette.length]}
                            className="m-1 px-4 py-2"
                            style={{ fontSize: '1.2rem' }}
                            disabled
                          >
                            {code}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          );
        })}

        {individual.map((item, idx) => {
          const borderVariant = 'warning';
          const palette = allVariants.filter(v => v !== borderVariant);
          return (
            <Col key={idx}>
              <Card className={`h-100 border-${borderVariant}`}>
                <Card.Header className={`bg-${borderVariant} text-dark`}>
                  <strong>{item.name}</strong>
                </Card.Header>
                <Card.Body>
                  {item.codes.length ? (
                    <div className="d-flex flex-wrap">
                      {item.codes.map((code, j) => (
                        <Button
                          key={code}
                          variant={palette[j % palette.length]}
                          className="m-1 px-4 py-2"
                          style={{ fontSize: '1.2rem' }}
                          disabled
                        >
                          {code}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <Card.Text className="text-muted">No modules</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      {/* sticky verify button */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '1rem 0',
          boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <Container className="text-center">
          <Button
            size="lg"
            onClick={handleVerify}
            disabled={verifying}
            variant={
              verifyResult === true
                ? 'success'
                : verifyResult === false
                ? 'danger'
                : 'warning'
            }
            style={{ width: '100%', maxWidth: '400px' }}
          >
            {verifying ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : verifyResult === true ? (
              '✔ Requirements Met'
            ) : verifyResult === false ? (
              '✖ Requirements Not Met'
            ) : (
              'Verify Requirements'
            )}
          </Button>
        </Container>
      </div>
    </Container>
  );
};

export default ModuleRequirements;
