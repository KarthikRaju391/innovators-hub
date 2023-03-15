import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function OrderMap() {

    var position = [13.007517,77.491970]
    var speed = 50
    //geoData.lat, geoData.lng
  
  return (
    
    <MapContainer center={position} zoom={12} scrollWheelZoom={true} style={{ height: '40vh', width: "50vw", }}>
      <TileLayer
        // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
        <Marker position={position} >
            <Popup>Speed: {speed}</Popup>
        </Marker>
      
    </MapContainer>
  );
}
