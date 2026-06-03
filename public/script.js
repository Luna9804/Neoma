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

fetchAPOD();
fetchLaunch();