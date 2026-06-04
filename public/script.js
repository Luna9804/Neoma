async function fetchAPOD(){
    try{
        const response = await fetch('/api/apod');
        const data = await response.json();
        const content = document.getElementById('apod-content');

        if(data.media_type == 'image'){
            content.innerHTML = `
            <img src="${data.url}" alt="${data.title}" />
            <h3>${data.title}</h3>
            <p class="date">${data.date}</p>
            <p class="explanation">${data.explanation}</p>

            `;
        }else {
            content.innerHTML = `
            <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
            <h3>${data.title}</h3>
            <p class="date">${data.date}</p>
            <p class="explanation">${data.explanation}</p>
            `;
        }
    }catch (error) {
        document.getElementById('apod-content').innerHTML = 
        '<p>Failed to load astronomy picture. Please try again later.</p>';
    }
}

async function fetchLaunch(){
    try{
        const response = await fetch ('/api/launch');
        const data = await response.json();

        const content = document.getElementById('launch-content');

        const launchDate = new Date(data.net);

        content.innerHTML = `
        <div class="launch-info">
            <h3>${data.name}</h3>
            <p class = "launch-provider">${data.launch_service_provider.name}</p>
            <p class = "launch-location"> ${data.pad.location.name}</p>
            <div class = "countdown" id="countdown"></div>
            <p class="launch-status"> Status: ${data.status.name}</p>
        </div>
        `;

        function updateCountdown(){
            const now = new Date();
            const diff = launchDate-now;

            if(diff <= 0){
                document.getElementById('countdown').innerHTML = 'Launching now!';
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 *24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60))/ (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('countdown').innerHTML = `
            <div class="countdown-grid">
                <div class="countdown-item"><span>${days}</span><p>Days</p></div>
                <div class="countdown-item"><span>${hours}</span><p>Hours</p></div>
                <div class="countdown-item"><span>${minutes}</span><p>Minutes</p></div>
                <div class="countdown-item"><span>${seconds}</span><p>Seconds</p></div>
            </div>

            `;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }catch(error){
        document.getElementById('launch-content').innerHTML = 
        '<p>Failed to load launch data. Please try again later.</p>';

    }
}

let issMap = null;
let issMarker = null;

async function fetchISS(){
    try{
        const response = await fetch('/api/iss');
        const data = await response.json();

        const lat = parseFloat(data.iss_position.latitude);
        const lon = parseFloat(data.iss_position.longitude);

        const content = document.getElementById('iss-content');

        if(!issMap){
            content.innerHTML = `
            <div id="iss-map"></div>
            <div class="iss-coords">
                <div class="iss-coord-item">
                    <span id="iss-lat"> ${lat.toFixed(4)}</span>
                    <p>Latitude</p>
                </div>
                <div class="iss-coord-item">
                    <span id="iss-lon">${lon.toFixed(4)}</span>
                    <p>Longitude</p>
                </div>
            </div>
            `;

            issMap = L.map('iss-map').setView([lat, lon], 3);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(issMap);

            issMarker = L.marker([lat, lon]).addTo(issMap)
                .bindPopup('ISS is here!')
                .openPopup();
        } else{
            issMarker.setLatLng([lat, lon]);
            issMap.setView([lat, lon], 3);
            document.getElementById('iss-lat').textContent = lat.toFixed(4);
            document.getElementById('iss-lon').textContent = lon.toFixed(4);
        
        } 
    } catch(error){
        if(!issMap){
            document.getElementById('iss-content').innerHTML = '<p>Failed to load ISS data. Please try again later.</p>';
        }
    }
}
setInterval(fetchISS, 5000);

async function fetchAsteroids(){
    try{
        const response = await fetch('/api/asteroids');
        const asteroids = await response.json();

        const content = document.getElementById('asteroid-content');
        const asteroidHTML = asteroids.map(asteroid => {
            const diameter = asteroid.estimated_diameter.meters;
            const avgDiameter = ((diameter.estimated_diameter_min + diameter.estimated_diameter_max) /2 ).toFixed(0);
            const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString('en-US', {maximumFractionDigits: 0});
            const velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString('en-US', {maximumFractionDigits:0});
            const date = asteroid.close_approach_data[0].close_approach_date;
            const hazardous = asteroid.is_potentially_hazardous_asteroid;

            return `
                <div class="asteroid-card">
                    <div class="asteroid-header">
                        <h3>${asteroid.name}</h3>
                        <span class="asteroid-badge ${hazardous ? 'hazardous' : 'safe'}">
                            ${hazardous ? 'Hazardous' : 'Safe'}
                        </span>
                    </div>
                    <div class="asteroid-stats">
                        <div class="asteroid-stat">
                            <span>${distance} km</span>
                            <p>Miss Distance</p>
                        </div>
                        <div class="asteroid-stat">
                            <span>${avgDiameter} m</span>
                            <p>Avg Diameter</p>
                        </div>
                        <div class="asteroid-stat">
                            <span>${velocity} km/h</span>
                            <p>Velocity</p>
                        </div>
                        <div class= "asteroid-stat">
                            <span>${date}</span>
                            <p>Close Approach</p>
                        </div>
                    </div>
                </div>
                `;
        }).join('');
        content.innerHTML = asteroidHTML;
    } catch(error){
        document.getElementById('asteroid-content').innerHTML = 
        '<p>Failed to load asteroid data. Please try again later.</p>';
    }
}
fetchAPOD();
fetchLaunch();
fetchISS();
fetchAsteroids();
