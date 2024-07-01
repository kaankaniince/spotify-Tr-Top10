const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let accessToken = '';

const getAccessToken = async () => {
    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        data: 'grant_type=client_credentials',
    });

    accessToken = response.data.access_token;
};

/*app.get('/api/token', async (req, res) => {
    try {
        const token = await getAccessToken();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch token' });
    }
});*/

app.get('/api/top10', async (req, res) => {
    if (!accessToken) {
        await getAccessToken();
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbIVYVBNw9D5K/tracks', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.json(response.data.items);
    } catch (error) {
        if (error.response.status === 401) {
            await getAccessToken();
            return res.redirect('/api/top10');
        }
        res.status(500).json({ error: 'Failed to fetch top 10 tracks' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {
    accessToken,
};