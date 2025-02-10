import React, { useEffect, useState } from 'react';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/services')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  return (
    <div>
      <h2>Nasze usługi</h2>
      <ul>
        {services.length > 0 ? (
          services.map(service => (
            <li key={service.id}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p><strong>Cena: </strong>${service.price}</p>
            </li>
          ))
        ) : (
          <p>Loading services...</p>
        )}
      </ul>
    </div>
  );
};

export default Services;
