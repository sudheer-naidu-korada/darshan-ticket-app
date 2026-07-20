import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const temples = [
  { id: 1, name: 'Tirumala Temple', location: 'Andhra Pradesh', slots: ['06:00', '09:00', '12:00'] },
  { id: 2, name: 'Kedarnath Temple', location: 'Uttarakhand', slots: ['05:30', '08:00', '11:30'] },
  { id: 3, name: 'Vaishno Devi', location: 'Jammu & Kashmir', slots: ['04:30', '07:00', '10:00'] }
];

app.get('/api/temples', (req, res) => {
  res.json(temples);
});

app.post('/api/bookings', (req, res) => {
  const { templeId, name, slot, poojaType } = req.body;

  if (!templeId || !name || !slot || !poojaType) {
    return res.status(400).json({ message: 'Please provide all booking details.' });
  }

  const temple = temples.find((item) => item.id === Number(templeId));

  if (!temple) {
    return res.status(404).json({ message: 'Temple not found.' });
  }

  res.status(201).json({
    success: true,
    booking: {
      templeName: temple.name,
      name,
      slot,
      poojaType,
      status: 'Confirmed'
    }
  });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      server.close(() => startServer(port + 1));
    } else {
      console.error(error);
      process.exit(1);
    }
  });
}

startServer(Number(process.env.PORT) || 5000);
