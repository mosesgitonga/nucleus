import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cropwatch_backend } from 'declarations/cropwatch_backend';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

import './DiseaseMap.css';

function MapPage() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({ totalDiseases: 0, uniqueDiseases: new Set(), uniqueCrops: new Set(), invalidReports: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);

  // Kenya's bounding box for client-side filtering
  const KENYA_BOUNDS = {
    minLat: -4.7,
    maxLat: 5.5,
    minLng: 33.9,
    maxLng: 41.9,
  };

  // Calculate reports from last 3 months
  const getLastThreeMonthsReports = useCallback((reports) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return reports.filter(report => {
      const reportDate = new Date(Number(report.timestamp) * 1000);
      return reportDate >= threeMonthsAgo;
    });
  }, []);

  // Summarize diseases and crops
  const summarizeReports = useCallback((reports) => {
    const validReports = reports.filter(report => 
      report && 
      typeof report.lat === 'number' && 
      typeof report.lng === 'number' &&
      !isNaN(report.lat) && 
      !isNaN(report.lng) &&
      report.lat !== 0 && 
      report.lng !== 0 &&
      report.lat >= KENYA_BOUNDS.minLat &&
      report.lat <= KENYA_BOUNDS.maxLat &&
      report.lng >= KENYA_BOUNDS.minLng &&
      report.lng <= KENYA_BOUNDS.maxLng
    );
    
    const invalidReports = reports.length - validReports.length;
    const lastThreeMonthsReports = getLastThreeMonthsReports(validReports);
    const uniqueDiseases = new Set(lastThreeMonthsReports.map(report => report.disease).filter(Boolean));
    const uniqueCrops = new Set(lastThreeMonthsReports.map(report => report.crop).filter(Boolean));
    
    return {
      totalDiseases: lastThreeMonthsReports.length,
      uniqueDiseases,
      uniqueCrops,
      invalidReports
    };
  }, [getLastThreeMonthsReports]);

  // Fetch all reports from canister
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await cropwatch_backend.getAllReports();
      console.log('Fetched reports:', result);
      setReports(result);
      const summaryData = summarizeReports(result);
      setSummary(summaryData);
      if (summaryData.invalidReports > 0) {
        console.warn(`${summaryData.invalidReports} reports filtered out due to invalid coordinates`);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load disease reports: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [summarizeReports]);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current) {
      try {
        mapRef.current = L.map('map').setView([1.286389, 36.817223], 6);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(mapRef.current);

        console.log('Map initialized successfully');
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to initialize map: ' + err.message);
      }
    }

    // Invalidate map size after initialization to ensure full width
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 0);
    }

    // Cleanup on unmount
    return () => {
      if (heatLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update heat map when reports change
  useEffect(() => {
    if (!mapRef.current || loading) return;

    // Invalidate map size to ensure it adjusts to container
    mapRef.current.invalidateSize();

    // Remove existing heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // Add new heat layer if we have reports
    if (reports.length > 0) {
      try {
        // Validate report data
        const validReports = reports.filter(report => 
          report && 
          typeof report.lat === 'number' && 
          typeof report.lng === 'number' &&
          !isNaN(report.lat) && 
          !isNaN(report.lng) &&
          report.lat !== 0 && 
          report.lng !== 0 &&
          report.lat >= KENYA_BOUNDS.minLat &&
          report.lat <= KENYA_BOUNDS.maxLat &&
          report.lng >= KENYA_BOUNDS.minLng &&
          report.lng <= KENYA_BOUNDS.maxLng
        );

        if (validReports.length === 0) {
          console.warn('No valid reports with lat/lng coordinates');
          return;
        }

        // For overlapping points, increase intensity
        const locationMap = new Map();
        validReports.forEach(report => {
          const key = `${report.lat},${report.lng}`;
          locationMap.set(key, (locationMap.get(key) || 0) + 1);
        });

        const heatDataWithIntensity = Array.from(locationMap.entries()).map(([coords, count]) => {
          const [lat, lng] = coords.split(',').map(Number);
          return [lat, lng, count];
        });

        console.log('Heat data with intensity:', heatDataWithIntensity);

        // Check if L.heatLayer is available
        if (typeof L.heatLayer !== 'function') {
          console.error('L.heatLayer is not available. leaflet.heat plugin not loaded properly.');
          
          // Fallback: Create colored circle markers
          heatDataWithIntensity.forEach(([lat, lng, intensity]) => {
            const color = intensity > 3 ? '#ff0000' : intensity > 2 ? '#ff8000' : intensity > 1 ? '#ffff00' : '#00ff00';
            const circle = L.circleMarker([lat, lng], {
              radius: Math.max(10, intensity * 5),
              fillColor: color,
              color: color,
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.6
            }).addTo(mapRef.current);
            
            circle.bindPopup(`Disease Reports: ${intensity}`);
          });
          
          setError('Heat layer not available - showing circle markers instead');
        } else {
          // Create heat layer
          heatLayerRef.current = L.heatLayer(heatDataWithIntensity, {
            radius: 80,
            blur: 35,
            maxZoom: 17,
            minOpacity: 0.3,
            max: Math.max(...heatDataWithIntensity.map(point => point[2])),
            gradient: {
              0.0: '#0000ff',
              0.2: '#00ffff',
              0.4: '#00ff00',
              0.6: '#ffff00',
              0.8: '#ff8000',
              1.0: '#ff0000'
            }
          });

          if (heatLayerRef.current) {
            heatLayerRef.current.addTo(mapRef.current);
            console.log('Heat layer added successfully');
          } else {
            console.error('Failed to create heat layer');
          }
        }

        // Auto-zoom to show the heat points
        const coordinates = heatDataWithIntensity.map(point => [point[0], point[1]]);
        if (coordinates.length === 1) {
          mapRef.current.setView([coordinates[0][0], coordinates[0][1]], 14);
        } else {
          const group = new L.featureGroup(coordinates.map(coord => L.marker(coord)));
          mapRef.current.fitBounds(group.getBounds().pad(0.1));
        }

        console.log(`Heat visualization created with ${heatDataWithIntensity.length} unique locations, max intensity: ${Math.max(...heatDataWithIntensity.map(point => point[2]))}`);
      } catch (err) {
        console.error('Heat layer creation error:', err);
        setError('Failed to create heat map: ' + err.message);
        
        // Emergency fallback - simple markers
        validReports.forEach(report => {
          L.marker([report.lat, report.lng])
            .addTo(mapRef.current)
            .bindPopup(`Disease Report: ${report.crop || 'Unknown crop'} - ${report.disease || 'Unknown disease'}`);
        });
      }
    }
  }, [reports, loading]);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="map-container">
      <header className="header">
        <span className="header-icon">🔥</span>
        <h1>Disease Heat Map - Kenya</h1>
      </header>
      <div className="map-content">
        {loading && (
          <div className="message info">
            <strong>Loading:</strong> Fetching disease reports...
          </div>
        )}
        {error && (
          <div className="message error">
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchReports} 
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Retry
            </button>
          </div>
        )}
        {!loading && reports.length === 0 && !error && (
          <div className="message info">
            <strong>Info:</strong> No disease reports found in Kenya.
          </div>
        )}
        {!loading && reports.length > 0 && (
          <>
            <div className="message success">
              <strong>Heat Map:</strong> Showing {reports.length - summary.invalidReports} valid disease reports. 
              Red areas indicate higher disease concentration.
            </div>
            <div className="message summary">
              <strong>Last 3 Months Summary:</strong>
              <ul>
                <li>Total Disease Reports: {summary.totalDiseases}</li>
                <li>Unique Diseases: {summary.uniqueDiseases.size} ({Array.from(summary.uniqueDiseases).join(', ') || 'None'})</li>
                <li>Unique Crops Affected: {summary.uniqueCrops.size} ({Array.from(summary.uniqueCrops).join(', ') || 'None'})</li>
                {summary.invalidReports > 0 && (
                  <li>Invalid Reports (excluded): {summary.invalidReports}</li>
                )}
              </ul>
            </div>
          </>
        )}
        <div id="map" className="map"></div>
      </div>
    </div>
  );
}

export default MapPage;