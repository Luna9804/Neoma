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

fetchAPOD();