import React from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const CustomMap = () => (
  // shows marker on London by default
  <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
   <Map
      defaultZoom={13}
      defaultCenter={ { lat: 36.1420163, lng: -86.8038583 } }
      onCameraChanged={ (ev) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }>
   </Map>
 </APIProvider>
);

export default CustomMap;