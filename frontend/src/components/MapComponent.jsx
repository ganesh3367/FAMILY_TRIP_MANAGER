import React, { useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '2rem',
    overflow: 'hidden'
};

const MapComponent = ({ destinations = [], isLoaded }) => {
    // We derive the center based on the first destination that has coordinates
    const center = useMemo(() => {
        const firstWithCoords = destinations.find(d =>
            d.lat !== undefined && d.lng !== undefined &&
            !isNaN(Number(d.lat)) && !isNaN(Number(d.lng))
        );
        if (firstWithCoords) {
            return { lat: Number(firstWithCoords.lat), lng: Number(firstWithCoords.lng) };
        }
        return { lat: 20, lng: 0 }; // Default global view
    }, [destinations]);

    // Filter and normalize coordinates for the route line
    const pathCoords = useMemo(() => {
        return destinations
            .filter(d => d.lat !== undefined && d.lng !== undefined && !isNaN(Number(d.lat)))
            .map(d => ({ lat: Number(d.lat), lng: Number(d.lng) }));
    }, [destinations]);

    if (!isLoaded) {
        return (
            <div className="map-placeholder glass-card animate-fade">
                <div className="setup-hint">
                    <h4>Map loading...</h4>
                    <p>Fetching satellite data and routes.</p>
                </div>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={destinations.length > 0 ? 5 : 2}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                styles: [
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
                    },
                    // Clean, modern map style
                ]
            }}
        >
            {destinations.map((dest, idx) => {
                const lat = Number(dest.lat);
                const lng = Number(dest.lng);
                if (isNaN(lat) || isNaN(lng)) return null;

                return (
                    <Marker
                        key={dest._id || idx}
                        position={{ lat, lng }}
                        label={{
                            text: (idx + 1).toString(),
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    />
                );
            })}

            {pathCoords.length > 1 && (
                <Polyline
                    path={pathCoords}
                    options={{
                        strokeColor: '#0071e3',
                        strokeOpacity: 0.6,
                        strokeWeight: 4,
                        geodesic: true
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default React.memo(MapComponent);
