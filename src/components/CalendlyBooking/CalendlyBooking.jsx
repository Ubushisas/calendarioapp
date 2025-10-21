"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, Globe, Info, Settings } from "lucide-react";
import "./CalendlyBooking.css";

export default function CalendlyBooking({ onBack }) {
  const [settings, setSettings] = useState(null);
  const [step, setStep] = useState(1); // 1: Service, 2: Date & Time, 3: Details, 4: Confirmation
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Check if form is complete and valid
  const isFormComplete =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.email.includes('@') &&
    formData.phone.trim().length === 10 &&
    /^\d+$/.test(formData.phone.trim());

  // Load settings
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  // Rotate loading messages every 5 seconds
  useEffect(() => {
    if (loadingTimes) {
      setLoadingMessage(0);
      const interval = setInterval(() => {
        setLoadingMessage((prev) => (prev + 1) % 2);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loadingTimes]);

  // Fetch available times when date is selected
  useEffect(() => {
    if (selectedDate && selectedService && settings) {
      setLoadingTimes(true);
      fetch("/api/calendar/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          service: selectedService,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Generate time slots and filter out unavailable ones
          const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          const dayName = dayNames[selectedDate.getDay()];
          const daySettings = settings.workingHours[dayName];

          if (!daySettings?.enabled) {
            setAvailableTimes([]);
            setLoadingTimes(false);
            return;
          }

          // Parse start and end times
          const [startHour] = daySettings.start.split(":").map(Number);
          const [endHour] = daySettings.end.split(":").map(Number);

          const slots = [];
          for (let hour = startHour; hour < endHour; hour++) {
            const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            const period = hour < 12 ? "AM" : "PM";
            slots.push(`${hour12}:00 ${period}`);
            slots.push(`${hour12}:30 ${period}`);
          }

          // Filter out unavailable slots
          const unavailableSlots = data.unavailableSlots || [];
          const availableSlots = slots.filter((timeSlot) => {
            const [timeStr, period] = timeSlot.split(" ");
            const [hours, minutes] = timeStr.split(":").map(Number);
            let hours24 = hours;
            if (period === "PM" && hours !== 12) hours24 = hours + 12;
            else if (period === "AM" && hours === 12) hours24 = 0;

            const slotStart = new Date(selectedDate);
            slotStart.setHours(hours24, minutes, 0, 0);

            // Check if in the past
            if (slotStart <= new Date()) return false;

            const slotEnd = new Date(slotStart.getTime() + selectedService.duration * 60000);

            // Check for overlap with booked slots
            for (const unavailable of unavailableSlots) {
              const bookedStart = new Date(unavailable.start);
              const bookedEnd = new Date(unavailable.end);
              if (slotStart < bookedEnd && slotEnd > bookedStart) return false;
            }

            return true;
          });

          setAvailableTimes(availableSlots);
          setLoadingTimes(false);
        })
        .catch((err) => {
          console.error("Error fetching times:", err);
          setLoadingTimes(false);
        });
    }
  }, [selectedDate, selectedService, settings]);

  // Generate categories dynamically from settings
  const getCategoryDisplayName = (categoryId) => {
    const nameMap = {
      individual: "Experiencias Individuales",
      parejas: "Experiencias en Pareja",
      amigas: "Entre Amigas",
      familia: "En Familia",
      eventos: "Eventos Especiales",
      premium: "Premium",
      elite: "Elite"
    };
    // If not in map, capitalize first letter
    return nameMap[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  const getCategoryRoom = (categoryId) => {
    // Individual uses individual room, everything else uses principal
    return categoryId === "individual" ? "individual" : "principal";
  };

  const categories = settings && settings.services
    ? Object.keys(settings.services).map(categoryId => ({
        id: categoryId,
        name: getCategoryDisplayName(categoryId),
        room: getCategoryRoom(categoryId)
      }))
    : [];

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const formatPrice = (price) => {
    return `$${(price / 1000).toFixed(0)}k COP`;
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateAvailable = (date) => {
    if (!date || !settings) return false;
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayName = dayNames[date.getDay()];
    const daySettings = settings.workingHours[dayName];
    return daySettings?.enabled === true;
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    if (isPastDate(date) || !isDateAvailable(date)) return;
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      service: selectedService,
      date: selectedDate.toISOString(),
      time: selectedTime,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      guestNames: [],
    };

    try {
      const response = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setStep(4);
      } else {
        const error = await response.json();
        console.error("Booking error:", error);
        alert(`Error al crear la reserva: ${error.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert('Error de conexión al crear la reserva');
    }
  };

  if (!settings) {
    return (
      <div className="calendly-loading">
        <div className="calendly-spinner"></div>
      </div>
    );
  }

  return (
    <div className="calendly-container">
      <div className="calendly-layout">
        {/* Left sidebar - Info panel */}
        <div className="calendly-sidebar">
          <div className="calendly-brand">
            <h1>Miosotys Spa</h1>
            <p>Experiencias de bienestar</p>
          </div>

          {selectedService && (
            <div className="calendly-selection-info">
              <h3>{selectedService.name}</h3>
              <div className="calendly-info-items">
                <div className="calendly-info-item">
                  <Clock className="w-4 h-4" />
                  <span>{selectedService.duration} minutos</span>
                </div>
                <div className="calendly-info-item">
                  <MapPin className="w-4 h-4" />
                  <span>Miosotys Spa, Colombia</span>
                </div>
              </div>
              {selectedDate && selectedTime && (
                <div className="calendly-datetime-display">
                  <CalendarIcon className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">
                      {selectedDate.toLocaleDateString("es-CO", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm" style={{color: 'rgb(204, 200, 194)'}}>{selectedTime}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel - Booking flow */}
        <div className="calendly-main">
          <Card className="calendly-card">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div className="calendly-step">
                <button
                  onClick={onBack}
                  className="calendly-back-btn"
                  title="Volver al inicio"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="calendly-step-title">Selecciona tu experiencia</h2>
                <div className="calendly-categories">
                  {categories.map((category) => {
                    const isRoomEnabled = settings.rooms[category.room]?.enabled;
                    const services = settings.services?.[category.id]?.filter((s) => s.enabled) || [];

                    if (!isRoomEnabled || services.length === 0) return null;

                    return (
                      <div key={category.id} className="calendly-category-section">
                        <div className="calendly-category-header">
                          <h3>{category.name}</h3>
                        </div>
                        <div className="calendly-services-list">
                          {services.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => handleServiceSelect(service)}
                              className="calendly-service-card"
                            >
                              <div className="calendly-service-info">
                                <h4>{service.name}</h4>
                                <div className="calendly-service-meta">
                                  <span>{service.duration} min</span>
                                  <span>•</span>
                                  <span>{formatPrice(service.price)}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5" style={{color: 'rgb(204, 200, 194)'}} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 2 && (
              <div className="calendly-step">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedDate(null);
                    setSelectedTime(null);
                  }}
                  className="calendly-back-btn"
                  title="Volver a selección de servicio"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="calendly-step-title">Selecciona fecha y hora</h2>

                {/* Unified Calendly-style container */}
                <div className="calendly-unified-picker">
                  {/* Calendar section */}
                  <div className="calendly-unified-calendar">
                    <div className="calendly-calendar-header">
                      <button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                          )
                        }
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h3>
                        {currentMonth.toLocaleDateString("es-CO", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                          )
                        }
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="calendly-calendar-grid">
                      <div className="calendly-weekdays">
                        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                          <div key={day} className="calendly-weekday">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="calendly-days">
                        {getDaysInMonth(currentMonth).map((date, index) => {
                          if (!date) {
                            return <div key={index} className="calendly-day empty"></div>;
                          }

                          const isToday =
                            date.toDateString() === new Date().toDateString();
                          const isSelected =
                            selectedDate &&
                            date.toDateString() === selectedDate.toDateString();
                          const isPast = isPastDate(date);
                          const isAvailable = isDateAvailable(date);

                          if (isPast || !isAvailable) {
                            return (
                              <div key={index} className="calendly-day unavailable">
                                {date.getDate()}
                              </div>
                            );
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => handleDateSelect(date)}
                              className={`calendly-day ${isToday ? "today" : ""} ${
                                isSelected ? "selected" : ""
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timezone display */}
                    <div className="calendly-timezone">
                      <Globe className="w-4 h-4" />
                      <span>Ibagué, Colombia (UTC-5)</span>
                    </div>
                  </div>

                  {/* Time slots section */}
                  {selectedDate && (
                    <div className="calendly-unified-times">
                      <h3 className="calendly-times-title">
                        {selectedDate.toLocaleDateString("es-CO", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </h3>
                      {loadingTimes ? (
                        <div className="calendly-loading-times">
                          <div className="calendly-spinner-small"></div>
                          <p className="calendly-loading-message">
                            {loadingMessage === 0
                              ? "Cargando horarios disponibles..."
                              : "Casi listo, un momento más..."}
                          </p>
                        </div>
                      ) : availableTimes.length > 0 ? (
                        <div className="calendly-time-slots">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className="calendly-time-slot"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="calendly-no-times">
                          No hay horarios disponibles para esta fecha
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer with Cookie settings and Troubleshoot */}
                <div className="calendly-footer">
                  <button className="calendly-footer-link">
                    <Settings className="w-4 h-4" />
                    <span>Cookie settings</span>
                  </button>
                  <button className="calendly-footer-link">
                    <Info className="w-4 h-4" />
                    <span>Troubleshoot</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Enter Details */}
            {step === 3 && (
              <div className="calendly-step">
                <button
                  onClick={() => {
                    setStep(2);
                    setSelectedTime(null);
                  }}
                  className="calendly-back-btn"
                  title="Volver a selección de fecha y hora"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="calendly-step-title">Ingresa tus datos</h2>

                <form onSubmit={handleSubmit} className="calendly-form">
                  <div className="calendly-form-group">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="calendly-form-group">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="calendly-form-group">
                    <label htmlFor="phone">Teléfono (WhatsApp) *</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="3001234567"
                    />
                  </div>

                  <Button
                    type="submit"
                    className={`calendly-submit-btn ${isFormComplete ? 'calendly-submit-btn-active' : ''}`}
                    disabled={!isFormComplete}
                  >
                    Confirmar reserva
                  </Button>
                </form>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="calendly-step calendly-confirmation">
                <div className="calendly-success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{width: '50px', height: '50px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="calendly-step-title">¡Reserva confirmada!</h2>
                <p className="calendly-confirmation-text">
                  Recibirás un mensaje de confirmación por WhatsApp con todos los detalles de tu
                  cita.
                </p>
                <div className="calendly-confirmation-details">
                  <h3>{selectedService.name}</h3>
                  <p>
                    {selectedDate.toLocaleDateString("es-CO", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p style={{color: 'rgb(242, 237, 230)', fontWeight: 600}}>{selectedTime}</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Hacer otra reserva
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
