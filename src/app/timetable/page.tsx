'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';

interface ModuleInput {
  semester: number;
  modules: string[];
  completed: boolean;
}

const NUM_SEMESTERS = 8;

export default function ModulePlannerPage() {
  const [semesters, setSemesters] = useState<ModuleInput[]>(
    Array.from({ length: NUM_SEMESTERS }, (_, i) => ({ semester: i + 1, modules: [''], completed: false }))
  );
  const [validModules, setValidModules] = useState<string[]>([]);

  useEffect(() => {
  const fetchValidModules = async () => {
    try {
      const res = await axios.get('http://localhost:5000/modules/alll', {
        withCredentials: true
      });
      setValidModules(res.data.modules);
    } catch (err) {
      console.error('Failed to load valid modules', err);
    }
  };

  const fetchPlan = async () => {
    try {
      const res = await axios.get('http://localhost:5000/modules/loadPlan', {
        withCredentials: true
      });

            if (res.data.semesters && res.data.semesters.length > 0) {
        const loaded = res.data.semesters.map((sem: any, i: number) => ({
          semester: i + 1,
          modules: sem.modules.length ? sem.modules : [''],
          completed: sem.completed
        }));
        setSemesters(loaded);
      } else {
        setSemesters(
          Array.from({ length: NUM_SEMESTERS }, (_, i) => ({
            semester: i + 1,
            modules: [''],
            completed: false
          }))
        );
      }

    } catch (err) {
      console.error('Failed to load plan', err);
    }
  };

  const loadEverything = async () => {
    await fetchValidModules();
    await fetchPlan();
  };

  loadEverything();
}, []);


  const handleModuleChange = (semIndex: number, modIndex: number, value: string) => {
    const newSems = [...semesters];
    newSems[semIndex].modules[modIndex] = value;
    setSemesters(newSems);
  };

  const addModuleField = (semIndex: number) => {
    const newSems = [...semesters];
    newSems[semIndex].modules.push('');
    setSemesters(newSems);
  };

  const handleCompletedChange = (semIndex: number, checked: boolean) => {
    const newSems = [...semesters];
    newSems[semIndex].completed = checked;
    setSemesters(newSems);
  };

  const handleSave = async () => {
    try {
      const res = await axios.post('http://localhost:5000/modules/savePlan', { semesters }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      alert('📘 Module plan saved!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save plan');
    }
  };

  return (
    <Container className="py-2">
      <h2 className="text-center mb-4">📘 Plan Your Modules</h2>

      {semesters.map((sem, semIndex) => (
        <Card className="mb-4 shadow-sm border-success">
  <Card.Body>
    <Row className="align-items-center justify-content-between mb-3">
      <Col xs="auto">
        <h5 className="mb-0">📚 Semester {sem.semester}</h5>
      </Col>
      <Col xs="auto">
        <Form.Check
          type="checkbox"
          label="Completed"
          checked={sem.completed}
          onChange={(e) => handleCompletedChange(semIndex, e.target.checked)}
        />
      </Col>
    </Row>

    {sem.modules.map((mod, modIndex) => {
      const options = validModules.map((code) => ({
        value: code,
        label: code
      }));

      return (
        <Form.Group controlId={`sem${semIndex}-mod${modIndex}`} key={modIndex} className="mb-2">
          <Select
            options={options}
            value={options.find((opt) => opt.value === mod) || null}
            onChange={(selectedOption) => handleModuleChange(semIndex, modIndex, selectedOption?.value || "")}
            placeholder="Select or search module"
            isClearable
          />
        </Form.Group>
      );
    })}

    <Button variant="outline-primary" onClick={() => addModuleField(semIndex)} size="sm">
      ➕ Add Module
    </Button>
  </Card.Body>
</Card>

      ))}

      <div className="text-center">
        <Button variant="success" onClick={handleSave} className="px-5 py-2">
          💾 Save Plan
        </Button>
      </div>
    </Container>
  );
}
