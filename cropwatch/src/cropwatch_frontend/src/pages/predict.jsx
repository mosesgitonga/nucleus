import React, { useState, useEffect, useCallback } from 'react';
import { cropwatch_backend } from 'declarations/cropwatch_backend';
import './predict.css';

const ADVICE_API_URL = 'https://nucleus-api-190822451001.us-central1.run.app/api/advice';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const REQUEST_TIMEOUT = 30000; // 30 seconds

function PredictPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selection and validation
  const handleFileChange = useCallback((e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file (e.g., PNG, JPEG).');
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
    setPrediction(null);
    setAdvice(null);
    setConfidence(null);
  }, [previewUrl]);

  // Get geolocation asynchronously without timeout
  const getGeolocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.');
        setError('Geolocation not supported. Using default coordinates.');
        resolve({ lat: 0.0, lng: 0.0 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('Geolocation retrieved:', pos.coords.latitude, pos.coords.longitude);
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (geoErr) => {
          let message = 'Location access failed. Using default coordinates.';
          if (geoErr.code === geoErr.PERMISSION_DENIED) {
            message = 'Location access denied. Using default coordinates.';
          } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
            message = 'Location unavailable. Using default coordinates.';
          }
          console.warn('Geolocation error:', message);
          setError(message);
          resolve({ lat: 0.0, lng: 0.0 });
        }
      );
    });
  }, []);

  // Fetch prediction and advice from /api/advice
  const fetchCropHealthAdvice = useCallback(async (formData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn('Advice API request timed out after 30 seconds');
    }, REQUEST_TIMEOUT);

    try {
      console.log('Sending POST to advice API:', ADVICE_API_URL, 'with file:', file?.name);
      const res = await fetch(ADVICE_API_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
        signal: controller.signal,
      });

      console.log('Advice API response status:', res.status, 'Content-Type:', res.headers.get('content-type'));

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Advice API failed: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Unexpected response from Advice API: ${text}`);
      }

      const data = await res.json();
      console.log('Advice API response:', data);
      const disease = data.advice?.prediction?.label;
      const advice = data.advice?.advice;
      const confidence = data.advice?.prediction?.confidence;
      if (!disease || !advice) {
        throw new Error('Invalid response: missing prediction label or advice');
      }
      return { disease, advice, confidence };
    } finally {
      clearTimeout(timeoutId);
    }
  }, [file]);

  // Submit report to IC canister
  const submitReport = useCallback(async (disease, advice) => {
    try {
      const { lat, lng } = await getGeolocation();
      const timestamp = BigInt(Math.floor(Date.now() / 1000));
      const crop = 'tomato';

      console.log('Submitting report:', { crop, disease, advice, lat, lng, timestamp });
      await cropwatch_backend.submitReport({ crop, disease, advice, lat, lng, timestamp });
    } catch (err) {
      console.error('Report submission error:', err);
      setError(`Prediction and advice displayed, but failed to submit report: ${err.message}`);
    }
  }, [getGeolocation]);

  // Handle predict button click
  const handlePredict = useCallback(async () => {
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);
    setAdvice(null);
    setConfidence(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const { disease, advice, confidence } = await fetchCropHealthAdvice(formData);
      const crop = 'tomato';
      const formattedDisease = disease.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      setPrediction(`${crop.toUpperCase()} diagnosed with ${formattedDisease} (${confidence.toFixed(2)}%)`);
      setAdvice(advice);
      setConfidence(confidence);
      // Submit report asynchronously
      submitReport(disease, advice);
    } catch (err) {
      console.error('Advice API error:', err);
      setError(err.name === 'AbortError' ? 'Request timed out. Please try again.' : err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [file, fetchCropHealthAdvice, submitReport]);

  return (
    <div className="predict-container">
      <header className="header">
        <span className="header-icon">🧠</span>
        <h1>Nucleus Disease Prediction</h1>
      </header>
      <div className="content-wrapper">
        <div className="upload-column">
          <section className="upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              id="file-upload"
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-label">
              <span className="upload-icon">📷</span>
              {file ? 'Change Image' : 'Upload Crop Image (Max 5MB)'}
            </label>
          </section>
          {previewUrl && (
            <div className="preview-container">
              <img src={previewUrl} alt="Crop preview" className="preview-image" />
            </div>
          )}
          <button
            className={`predict-button ${loading ? 'loading' : ''}`}
            onClick={handlePredict}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                Analyzing
                <span className="loading-spinner" />
              </>
            ) : (
              'Predict & Submit'
            )}
          </button>
        </div>
        <div className="results-column">
          {prediction && (
            <div className="message success">
              <strong>Prediction:</strong> {prediction}
            </div>
          )}
          {advice && (
            <div className="message advice">
              <strong>Advice:</strong>
              <p>{advice}</p>
            </div>
          )}
          {error && (
            <div className="message error">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictPage;