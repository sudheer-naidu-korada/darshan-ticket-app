import { useEffect, useState } from 'react';

function App() {
  const [temples, setTemples] = useState([]);
  const [form, setForm] = useState({
    templeId: '',
    name: '',
    slot: '',
    poojaType: 'General Darshan'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/temples')
      .then((res) => res.json())
      .then((data) => setTemples(data))
      .catch(() => setMessage('Unable to load temples right now.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setMessage(data.success ? `Booking confirmed for ${data.booking.name} at ${data.booking.templeName}.` : data.message);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Darshan Ticket Booking</h1>
        <p>Book sacred temple visits with ease and confidence.</p>
      </header>

      <main className="content-grid">
        <section className="card">
          <h2>Available Temples</h2>
          <ul>
            {temples.map((temple) => (
              <li key={temple.id}>
                <strong>{temple.name}</strong> - {temple.location}
                <div>Slots: {temple.slots.join(', ')}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Book Your Darshan</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Temple
              <select value={form.templeId} onChange={(e) => setForm({ ...form, templeId: e.target.value })} required>
                <option value="">Select temple</option>
                {temples.map((temple) => (
                  <option key={temple.id} value={temple.id}>{temple.name}</option>
                ))}
              </select>
            </label>

            <label>
              Full Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>

            <label>
              Preferred Time Slot
              <input value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} placeholder="e.g. 06:00" required />
            </label>

            <label>
              Pooja Type
              <select value={form.poojaType} onChange={(e) => setForm({ ...form, poojaType: e.target.value })}>
                <option value="General Darshan">General Darshan</option>
                <option value="Special Pooja">Special Pooja</option>
                <option value="Seva Booking">Seva Booking</option>
              </select>
            </label>

            <button type="submit">Confirm Booking</button>
          </form>

          {message ? <p className="message">{message}</p> : null}
        </section>
      </main>
    </div>
  );
}

export default App;
