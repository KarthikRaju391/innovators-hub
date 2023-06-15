import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'

export default function OrderMap() {

    var position = [12.964190, 77.50439]
    var speed = 0
    //geoData.lat, geoData.lng
  
  return (
    
    <MapContainer center={position} zoom={12} scrollWheelZoom={true} style={{ height: '40vh', width: "50vw", }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={position}>
        <Popup>Speed: {speed}</Popup>
      </Marker>
      
    </MapContainer>
  );
}