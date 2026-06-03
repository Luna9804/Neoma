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

app.listen(PORT, ()=>{
    console.log(`Neoma server running at http://localhost:${PORT}`);
});
