import React, { useState, useEffect } from 'react';
import { cropwatch_backend } from 'declarations/cropwatch_backend';
import './predict.css';

function PredictPage() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (!selected.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            if (selected.size > 5 * 1024 * 1024) {
                setError('File too large. Maximum size is 5MB.');
                return;
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setFile(selected);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(selected);
            setError(null);
        }
    };

    const handleGeolocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }),
                (geoErr) => {
                    let message = 'Location access failed. Using default coordinates.';
                    if (geoErr.code === geoErr.PERMISSION_DENIED) {
                        message = 'Location access denied. Using default coordinates.';
                    } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
                        message = 'Location unavailable. Using default coordinates.';
                    } else if (geoErr.code === geoErr.TIMEOUT) {
                        message = 'Location request timed out. Using default coordinates.';
                    }
                    setError(message);
                    resolve({ lat: 0.0, lng: 0.0 });
                },
                { timeout: 20000 }
            );
        });
    };

    const handlePredict = async () => {
        if (!file) {
            setError('Please select an image file');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch('http://localhost:8000/api/predict', {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Prediction API failed: ${res.statusText}`);
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                throw new Error(`Unexpected response from API: ${text}`);
            }

            const data = await res.json();
            console.log('FastAPI response:', data);
            const disease = typeof data.prediction === 'string' ? data.prediction : data.prediction?.label;
            if (!disease) {
                throw new Error('Invalid prediction response: disease label missing');
            }

            try {
                const { lat, lng } = await handleGeolocation();
                const timestamp = BigInt(Math.floor(Date.now() / 1000));
                const crop = 'tomato';

                console.log('Submitting report:', { crop, disease, lat, lng, timestamp });
                await cropwatch_backend.submitReport({
                    crop,
                    disease,
                    lat,
                    lng,
                    timestamp,
                });

                setPrediction(`${crop.toUpperCase()} diagnosed with ${disease.toUpperCase()}`);
            } catch (err) {
                setError(`Failed to submit report: ${err.message}`);
            } finally {
                setLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="predict-container">
            <header className="header">
                <span className="header-icon">🧠</span>
                <h1>Nucleus Disease Prediction</h1>
            </header>

            <section className="upload-section">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    id="file-upload"
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

            {prediction && <div className="message success">{prediction}</div>}
            {error && <div className="message error">{error}</div>}
        </div>
    );
}

export default PredictPage;