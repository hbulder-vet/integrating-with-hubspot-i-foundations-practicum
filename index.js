const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-7d455934-e0dc-4a08-8892-df1eb549c20d';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/albums', async (req, res) => {

    const albums = 'https://api.hubspot.com/crm/v3/objects/2-115195106?properties=name,year,style,artist';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(albums, { headers });
        const data = resp.data.results;
        //res.json(data);
        res.render('albums', { title: 'Albums', data });      
    } catch (error) {
        console.error(error);
    }

});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update', async (req, res) => {

    // http://localhost:3000/update?email=rick@crowbars.net
    const hs_object_id = req.query.hs_object_id;
    if (hs_object_id){


    const getAlbum = `https://api.hubapi.com/crm/v3/objects/2-115195106/${hs_object_id}?properties=name,style,artist,year`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getAlbum, { headers });
        const data = response.data;

        // res.json(data);
        res.render('update', {name: data.properties.name, artist: data.properties.artist, style: data.properties.style, year: data.properties.year});
        
    } catch(err) {
        console.error(err);
    }
}else{

    try {


        // res.json(data);
        res.redirect('add');
        
    } catch(err) {
        console.error(err);
    }
}
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "name": req.body.name,
            "artist": req.body.artist,
            "year": req.body.year,
        }
    }

    const hs_object_id = req.query.hs_object_id;
    const updateAlbum = `https://api.hubapi.com/crm/v3/objects/2-115195106/${hs_object_id}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateAlbum, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});

app.get('/add', async (req, res) => {

    try {


        // res.json(data);
        res.render('add');
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/add', async (req, res) => {
    const create = {
        properties: {
            "name": req.body.name,
            "artist": req.body.artist,
            "year": req.body.year,
            "style": req.body.style
        }
    }
    const createAlbum = `https://api.hubapi.com/crm/v3/objects/2-115195106/`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createAlbum, create, { headers } );
        res.redirect('albums');
    } catch(err) {
        console.error(err);
    }

});




app.listen(3000, () => console.log('Listening on http://localhost:3000'));