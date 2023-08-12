import { GeoPoint } from "firebase/firestore";


export const geoDistance = (coord1:any,coord2:GeoPoint) => {
    const R = 6371e3; // metres
    const phi1 = coord1.latitude * Math.PI/180; // φ, λ in radians
    
    const phi2 = coord2.latitude * Math.PI/180;
    const deltaPhi = (coord2.latitude-coord1.latitude) * Math.PI/180;
    const deltaL = (coord2.longitude-coord1.longitude) * Math.PI/180;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaL/2) * Math.sin(deltaL/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}


export const findClosest = (location:any,points:any[]) => {
        let closestAddress = null;
        let shortestDistance = Infinity;
        for (let i = 0; i < points.length; i++) {
          const address = points[i];
          const addressCoordinates = address.coordinates || address.location;
          
          const distance = geoDistance(location, addressCoordinates);
      
          if (distance < shortestDistance) { 
            shortestDistance = distance;
            closestAddress = address;
          }
        }
      
        return closestAddress;
}