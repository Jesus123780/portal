import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMemo } from 'react';

const Map = ({ latitude, longitude }) => {
  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(() => ({ lat: latitude, lng: longitude }), []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAeBDp4D2wlpI3qhOvNeXZwDPoVh2CybTE' as string,
    libraries: libraries as any
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', height: '450px' }}
        onLoad={() => console.log('Map Component Loaded...')}
      >
        <MarkerF position={mapCenter} onLoad={() => console.log('Marker Loaded')} />
      </GoogleMap>
    </div>
  );
};

export default Map;
