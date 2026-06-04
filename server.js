const express = require('express');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.get('/api/apod', async (req, res) =>{
    try{
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
        );
        if(!response.ok){
            throw new Error('NASA API request failed');
        }
        const data = await response.json();
        res.json(data);
    }catch(error){
        res.status(500).json({error: 'Failed to fetch APOD data'});
    }
});

app.get('/api/launch', async(req, res) =>{
    try{
        const response = await fetch(
            'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&format=json&net__gt=' + new Date().toISOString()
        );
        if (!response.ok){
            throw new Error ('Launch API request failed with status: ${response.status}');
        }
        const data = await response.json();
        res.json(data.results[0]);

    }catch (error){
        console.log('Launch error:' , error.message);
        res.status(500).json({error: 'Failed to fetch launch data'});

    }
});

app.get('/api/iss', async(req, res)=>{
    try{
        const response = await fetch(
            'http://api.open-notify.org/iss-now.json'
        );
        if(!response.ok){
            throw new Error('ISS API request failed');
        }
        const data = await response.json();
        res.json(data);
    }catch (error){
        console.log('ISS error:', error.message);
        res.status(500).json({error: 'Failed to fetch ISS data'});
    }
});


app.get('/api/asteroids', async (req, res) => {
    try{
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

        const response = await fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${nextWeek}&api_key=${process.env.NASA_API_KEY}`
        );
        if (!response.ok){
            throw new Error('Asteroid API request failed');
        }
        const data = await response.json();
        const asteroids = Object.values(data.near_earth_objects)
        .flat()
        .sort((a, b) =>{
            const distA= parseFloat(a.close_approach_data[0].miss_distance.kilometers);
            const distB = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
            return distA - distB;
        })
        .slice(0,5);
        res.json(asteroids);

    }catch (error){
        console.log('Asteroid error:', error.message);
        res.status(500).json({error: 'Failed to fetch asteroid data'});

    }
});

app.listen(PORT, ()=>{
    console.log(`Neoma server running at http://localhost:${PORT}`);
});
