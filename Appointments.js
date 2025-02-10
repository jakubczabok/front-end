import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [physiotherapists, setPhysiotherapists] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPhysiotherapist, setSelectedPhysiotherapist] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchPhysiotherapists();
  }, []);

  const fetchAppointments = () => {
    fetch('http://localhost:8081/api/appointments')
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching appointments:', error));
  };

  const fetchServices = () => {
    fetch('http://localhost:8081/api/services')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  };

  const fetchPhysiotherapists = () => {
    fetch('http://localhost:8081/api/blog-posts')
      .then(response => response.json())
      .then(data => {
        const uniquePhysiotherapists = [...new Set(data.map(post => post.author))];
        setPhysiotherapists(uniquePhysiotherapists);
      })
      .catch(error => console.error('Error fetching physiotherapists:', error));
  };


  const getAvailableTimes = (date) => {
    const workHours = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
    const dateStr = date.toISOString().split('T')[0];

    const busyTimes = appointments
      .filter(app => app.appointmentTime && app.appointmentTime.split('T')[0] === dateStr)
      .map(app => app.appointmentTime.split('T')[1]?.substring(0, 5))
      .filter(time => time !== undefined);

    const available = workHours.filter(hour => !busyTimes.includes(hour));

    setAvailableTimes(available);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setErrorMessage('');
    setConfirmationMessage('');

    const day = date.getDay();
    if (day === 0 || day === 6) {
      setErrorMessage('Wybierz dzień roboczy.');
      setAvailableTimes([]);
    } else if (date < new Date()) {
      setErrorMessage('Należy rezerwować z conajmniej jednodniowym wyprzedzeniem.');
      setAvailableTimes([]);
    } else {
      getAvailableTimes(date);
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !email || !selectedService || !selectedPhysiotherapist) {
      setErrorMessage('Wypełnij wszystkie pola.');
      return;
    }

    const appointment = {
      email: email,
      appointmentTime: selectedDate.toISOString().split('T')[0] + 'T' + selectedTime + ':00',
      serviceName: selectedService.name,
      physiotherapistName: selectedPhysiotherapist,
      status: "PENDING",
    };

    fetch('http://localhost:8081/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Błąd podczas rezerwacji wizyty.');
        }
        return response.json();
      })
      .then(data => {
        // Refresh appointments and available times
        fetchAppointments();  // <--- Add this line
        getAvailableTimes(selectedDate); // <--- And this one
        setSelectedTime('');
        setEmail('');
        setSelectedService(null);
        setSelectedPhysiotherapist(null);
        setErrorMessage('');
        setConfirmationMessage('Wizyta została pomyślnie zarezerwowana.');
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
        setErrorMessage('Nie udało się zarezerwować wizyty.');
      });
  };

  return (
    <div>
      <h2>Rezerwacja wizyty</h2>

      <div>
        <label>Wybierz datę: </label>
        <DatePicker selected={selectedDate} onChange={handleDateChange} minDate={new Date()} dateFormat="yyyy/MM/dd" />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {confirmationMessage && <p style={{ color: 'green' }}>{confirmationMessage}</p>}
      </div>

      {selectedDate && availableTimes.length > 0 && (
        <div>
          <h3>Dostępne godziny</h3>
          <ul>
            {availableTimes.map(time => (
              <li key={time}><button onClick={() => setSelectedTime(time)}>{time}</button></li>
            ))}
          </ul>
        </div>
      )}

      {selectedTime && (
        <div>
          <h3>Wybrana godzina: {selectedTime}</h3>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Usługa:</label>
          <select onChange={(e) => setSelectedService(services.find(s => s.id === Number(e.target.value))) }>
            <option value="">Wybierz usługę</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>

          <label>Fizjoterapeuta:</label>
          <select onChange={(e) => setSelectedPhysiotherapist(e.target.value)}>
            <option value="">Wybierz fizjoterapeutę</option>
            {physiotherapists.map((physio, index) => (
              <option key={index} value={physio}>{physio}</option>
            ))}
          </select>

          <button onClick={handleBooking}>Potwierdź wizytę</button>
        </div>
      )}
    </div>
  );
};

export default Appointments;
