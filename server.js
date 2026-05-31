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

app.listen(PORT, ()=>{
    console.log(`Neoma server running at http://localhost:${PORT}`);
});
