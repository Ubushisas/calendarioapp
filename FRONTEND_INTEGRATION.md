# Frontend Integration Guide

Complete guide for integrating your frontend with the Miosotys Spa backend API.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [API Reference](#api-reference)
3. [React Examples](#react-examples)
4. [State Management](#state-management)
5. [Error Handling](#error-handling)
6. [Production Setup](#production-setup)

---

## Quick Start

### 1. Set Up API URL

Create a `.env.local` file in your frontend project:

```bash
# Local development
NEXT_PUBLIC_API_URL=http://localhost:3002

# Or for production
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

### 2. Create API Client

```javascript
// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function bookAppointment(bookingData) {
  const response = await fetch(`${API_URL}/api/calendar/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Booking failed');
  }

  return await response.json();
}

export async function getAvailability(date) {
  const response = await fetch(`${API_URL}/api/calendar/availability?date=${date}`);

  if (!response.ok) {
    throw new Error('Failed to fetch availability');
  }

  return await response.json();
}

export async function getAllAppointments() {
  const response = await fetch(`${API_URL}/api/calendar/appointments`, {
    credentials: 'include' // Important for auth
  });

  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }

  return await response.json();
}
```

---

## API Reference

### POST `/api/calendar/book`

Create a new booking.

**Request Body**:
```typescript
{
  date: string;         // Format: "YYYY-MM-DD"
  time: string;         // Format: "HH:MM AM/PM"
  service: {
    name: string;       // Service name
    price: number;      // Price in COP
    duration: number;   // Duration in minutes
  };
  customerInfo: {
    name: string;       // Customer full name
    phone: string;      // 10-digit Colombian number
    email: string;      // Customer email
  };
}
```

**Example**:
```javascript
await bookAppointment({
  date: '2025-11-15',
  time: '10:00 AM',
  service: {
    name: 'Masaje Relajante',
    price: 150000,
    duration: 60
  },
  customerInfo: {
    name: 'María García',
    phone: '3213582608',
    email: 'maria@example.com'
  }
});
```

**Response**:
```json
{
  "success": true,
  "booking": {
    "id": "abc123",
    "confirmationMessage": "Gracias María! Tu cita está confirmada...",
    "calendarEventId": "google-calendar-event-id",
    "paymentInfo": {
      "bank": "Bancolombia",
      "type": "Llave Brilla",
      "key": "3213582608",
      "holder": "Pedro"
    }
  }
}
```

---

### GET `/api/calendar/availability?date=YYYY-MM-DD`

Get available time slots for a date.

**Parameters**:
- `date` (required): Date in format "YYYY-MM-DD"

**Example**:
```javascript
const { availableSlots } = await getAvailability('2025-11-15');
// Returns: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]
```

**Response**:
```json
{
  "availableSlots": [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
  ]
}
```

---

### GET `/api/calendar/appointments`

Get all appointments (requires authentication).

**Example**:
```javascript
const { appointments } = await getAllAppointments();
```

**Response**:
```json
{
  "appointments": [
    {
      "id": "abc123",
      "date": "2025-11-15",
      "time": "10:00 AM",
      "service": "Masaje Relajante",
      "customerName": "María García",
      "customerPhone": "3213582608",
      "customerEmail": "maria@example.com"
    }
  ]
}
```

---

## React Examples

### Complete Booking Form Component

```jsx
'use client';

import { useState, useEffect } from 'react';
import { bookAppointment, getAvailability } from '@/lib/api';

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Masaje Relajante'
  });

  const services = [
    { name: 'Masaje Relajante', price: 150000, duration: 60 },
    { name: 'Masaje Deportivo', price: 160000, duration: 60 },
    { name: 'Masaje con Piedras Calientes', price: 200000, duration: 90 },
    { name: 'Facial Hidratante', price: 120000, duration: 60 },
    { name: 'Facial Antienvejecimiento', price: 150000, duration: 75 },
    { name: 'Limpieza Facial Profunda', price: 130000, duration: 90 },
    { name: 'Tratamiento Corporal', price: 250000, duration: 120 },
    { name: 'Paquete Relajación Total', price: 350000, duration: 150 }
  ];

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getAvailability(selectedDate)
        .then(data => {
          setAvailableSlots(data.availableSlots);
          setSelectedTime(''); // Reset time selection
        })
        .catch(err => {
          setError('Error al cargar horarios disponibles');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const selectedService = services.find(s => s.name === formData.service);

    try {
      const result = await bookAppointment({
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        }
      });

      if (result.success) {
        setSuccess(true);
        // Reset form
        setFormData({ name: '', phone: '', email: '', service: 'Masaje Relajante' });
        setSelectedDate('');
        setSelectedTime('');

        // Show confirmation message
        alert(result.booking.confirmationMessage);
      }
    } catch (err) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">¡Reserva confirmada!</div>}

      {/* Customer Info */}
      <div className="form-group">
        <label>Nombre Completo</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="María García"
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          placeholder="3213582608"
          pattern="[0-9]{10}"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="maria@example.com"
        />
      </div>

      {/* Service Selection */}
      <div className="form-group">
        <label>Servicio</label>
        <select
          value={formData.service}
          onChange={e => setFormData({ ...formData, service: e.target.value })}
        >
          {services.map(service => (
            <option key={service.name} value={service.name}>
              {service.name} - ${service.price.toLocaleString()} ({service.duration} min)
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div className="form-group">
        <label>Fecha</label>
        <input
          type="date"
          required
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="form-group">
          <label>Hora</label>
          {loading ? (
            <p>Cargando horarios...</p>
          ) : availableSlots.length > 0 ? (
            <select
              required
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
            >
              <option value="">Selecciona una hora</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          ) : (
            <p>No hay horarios disponibles para esta fecha</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedTime}
      >
        {loading ? 'Procesando...' : 'Confirmar Reserva'}
      </button>
    </form>
  );
}
```

---

### Simple Availability Checker

```jsx
'use client';

import { useState } from 'react';
import { getAvailability } from '@/lib/api';

export default function AvailabilityChecker() {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async () => {
    setLoading(true);
    try {
      const data = await getAvailability(date);
      setSlots(data.availableSlots);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al verificar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />
      <button onClick={checkAvailability} disabled={!date || loading}>
        {loading ? 'Verificando...' : 'Ver Disponibilidad'}
      </button>

      {slots.length > 0 && (
        <div className="slots">
          <h3>Horarios Disponibles:</h3>
          <ul>
            {slots.map(slot => (
              <li key={slot}>{slot}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

### Admin Dashboard - View All Appointments

```jsx
'use client';

import { useState, useEffect } from 'react';
import { getAllAppointments } from '@/lib/api';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar citas. ¿Has iniciado sesión?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="admin-dashboard">
      <h2>Todas las Citas</h2>

      {appointments.length === 0 ? (
        <p>No hay citas programadas</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id}>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>{apt.customerName}</td>
                <td>{apt.service}</td>
                <td>{apt.customerPhone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## State Management

### Using React Context

```jsx
// context/BookingContext.jsx
'use client';

import { createContext, useContext, useState } from 'react';
import { bookAppointment, getAvailability } from '@/lib/api';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await bookAppointment(bookingData);
      setBooking(result.booking);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (date) => {
    setLoading(true);
    try {
      return await getAvailability(date);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider value={{
      booking,
      loading,
      error,
      createBooking,
      checkAvailability
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
```

**Usage**:
```jsx
// In your component
import { useBooking } from '@/context/BookingContext';

export default function BookingPage() {
  const { createBooking, loading, error } = useBooking();

  const handleSubmit = async (data) => {
    try {
      await createBooking(data);
      alert('Booking confirmed!');
    } catch (err) {
      console.error(err);
    }
  };

  return <BookingForm onSubmit={handleSubmit} loading={loading} error={error} />;
}
```

---

## Error Handling

### Comprehensive Error Handler

```javascript
// lib/errorHandler.js

export class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function handleAPIResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new APIError(
      error.error || 'Request failed',
      response.status,
      error.details || {}
    );
  }

  return await response.json();
}

// Usage in API client
export async function bookAppointment(bookingData) {
  const response = await fetch(`${API_URL}/api/calendar/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });

  return handleAPIResponse(response);
}
```

### Error Display Component

```jsx
export function ErrorMessage({ error }) {
  if (!error) return null;

  const errorMessages = {
    400: 'Datos inválidos. Verifica la información.',
    404: 'Recurso no encontrado.',
    409: 'Ya existe una cita en este horario.',
    500: 'Error del servidor. Intenta nuevamente.'
  };

  const message = error.status
    ? errorMessages[error.status] || error.message
    : error.message;

  return (
    <div className="error-message">
      <strong>Error:</strong> {message}
    </div>
  );
}
```

---

## Production Setup

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

### Update CORS (Ask Pedro)

Once your frontend is deployed, Pedro needs to update the backend's `next.config.js`:

```javascript
{
  key: "Access-Control-Allow-Origin",
  value: "https://your-frontend.vercel.app"  // Your domain
}
```

### Testing Production

```javascript
// Test production API
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calendar/availability?date=2025-11-15`)
  .then(res => res.json())
  .then(data => console.log('Production API works!', data));
```

---

## Complete Integration Checklist

- [ ] Set up `NEXT_PUBLIC_API_URL` environment variable
- [ ] Create API client functions (`lib/api.js`)
- [ ] Test booking endpoint locally
- [ ] Test availability endpoint locally
- [ ] Implement booking form UI
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test with real data
- [ ] Deploy frontend
- [ ] Update backend CORS with your domain
- [ ] Test production API
- [ ] Monitor for errors

---

## Tips

1. **Always use environment variables** for API URLs
2. **Handle errors gracefully** - show user-friendly messages
3. **Add loading states** - users should know when data is being fetched
4. **Validate input** - before sending to API (phone format, date range, etc.)
5. **Test locally first** - ensure backend is running on localhost:3002
6. **Use TypeScript** (optional) - for better type safety

---

You're ready to integrate! The backend handles all the complex logic - you just need to call the API and display the results beautifully. 🎨
