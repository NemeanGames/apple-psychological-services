const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

let crmRecords = [];

// List all records
router.get('/', (req, res) => {
  res.json(crmRecords);
});

// Get a single record
router.get('/:id', (req, res) => {
  const record = crmRecords.find(r => r.id === req.params.id);
  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
});

// Create a record
router.post('/', (req, res) => {
  const { name, email, phone, notes } = req.body;
  const newRecord = {
    id: uuidv4(),
    name,
    email,
    phone,
    notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  crmRecords.push(newRecord);
  res.status(201).json(newRecord);
});

// Update a record
router.put('/:id', (req, res) => {
  const record = crmRecords.find(r => r.id === req.params.id);
  if (record) {
    record.name = req.body.name ?? record.name;
    record.email = req.body.email ?? record.email;
    record.phone = req.body.phone ?? record.phone;
    record.notes = req.body.notes ?? record.notes;
    record.updatedAt = new Date();
    res.json(record);
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
});

// Delete a record
router.delete('/:id', (req, res) => {
  const index = crmRecords.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    crmRecords.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
});

module.exports = router;
