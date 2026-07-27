const mapElement = document.getElementById("map");

const coordinates = JSON.parse(
    mapElement.dataset.coordinates
);

const listingTitle = mapElement.dataset.title;

const map = L.map("map").setView(
    [coordinates[1], coordinates[0]],
    10
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup(` <h5>${listingTitle}</h5>
        <p>Exact location will be provided after Booking</p>`)
    .openPopup();
    