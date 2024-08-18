    mapboxgl.accessToken = mapToken;  //mapToken's .env is in show.ejs....

    const map = new mapboxgl.Map({
        container: "map", //Container Id
        //Choose from Mapbox's core styles, or make your own style with Mapbox Studio.
        style: "mapbox://styles/mapbox/streets-v12",  //style url (dark-v11 for dark map)
        center: listing.geometry.coordinates, //starting position [lng,lat]
        zoom:8,  //starting zoom
    });
//npm install @mapbox/mapbox-sdk --legacy-peer-deps  -geocoding ke liye

const marker = new mapboxgl.Marker({color: "red"})        //Map marker
.setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})                //Map Popup
.setHTML(
    `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
  ) 
)
.addTo(map);

