"use client";
import { useState, useEffect } from "react";
import BookingFlow from "@/components/BookingFlow/BookingFlow";
import CalendlyBooking from "@/components/CalendlyBooking/CalendlyBooking";
import Copy from "@/components/Copy/Copy";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";
import "./page.css";

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState({ enabled: true, message: null });

  useEffect(() => {
    // Check calendar status on load
    fetch('/api/calendar/status')
      .then(res => res.json())
      .then(data => setCalendarStatus(data))
      .catch(err => console.error('Error checking calendar status:', err));
  }, []);

  return (
    <main className="spa-booking-page">
      {!showBooking ? (
        <section className="spa-hero">
          <div className="container">
            <div className="spa-hero-content">
              <Copy delay={0.85}>
                <h1>Miosotys Spa</h1>
              </Copy>
              <Copy delay={1}>
                <p className="lg">
                  Experiencias de bienestar diseñadas para renovar cuerpo y alma.
                  Desde tratamientos individuales hasta celebraciones en grupo,
                  cada momento está pensado para ti.
                </p>
              </Copy>
              <div className="spa-hero-buttons">
                <div onClick={() => setShowBooking(true)}>
                  <AnimatedButton label="Reservar" delay={1.2} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="spa-booking-section">
          <div className="container">
            {!calendarStatus.enabled ? (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Calendario no disponible
                </h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  {calendarStatus.message || 'El sistema de reservas no está disponible en este momento.'}
                </p>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>
                  Por favor intenta más tarde o contáctanos directamente.
                </p>
              </div>
            ) : (
              <CalendlyBooking onBack={() => setShowBooking(false)} />
            )}
          </div>
        </section>
      )}
    </main>
  );
}
