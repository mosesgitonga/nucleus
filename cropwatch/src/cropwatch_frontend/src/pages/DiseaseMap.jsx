import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { cropwatch_backend } from 'declarations/cropwatch_backend';

function DiseaseMap() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await cropwatch_backend.getAllReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      }
    };

    loadReports();
  }, []);

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <h2 style={{ textAlign: 'center', margin: '1rem' }}>🌍 Disease Spread in Kenya</h2>

      <MapContainer
        center={[0.0236, 37.9062]} 
        zoom={6}
        style={{ height: '80%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />

        {reports.map((r, idx) => (
          <Marker key={idx} position={[r.lat, r.lng]}>
            <Popup>
              <strong>Crop:</strong> {r.crop}<br />
              <strong>Disease:</strong> {r.disease}<br />
              <strong>Time:</strong> {new Date(r.timestamp * 1000).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default DiseaseMap;
