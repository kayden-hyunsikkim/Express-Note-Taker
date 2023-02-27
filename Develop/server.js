const express = require('express');
const path = require('path');
const dbdata = require('./db/db.json');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//app.get('*', (req, res) =>
//    res.sendFile(path.join(__dirname, 'public/index.html'))
//);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    try {
        const dbdata = fs.readFileSync('./db/db.json', 'utf-8')
        const parseddata = JSON.parse(dbdata);
        res.json(parseddata);
    } catch (err) {
        console.log(err);
        res.json({msg: err});
    }
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newtodo = {
            title,
            text,
        };
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedReviews = JSON.parse(data);

                // Add a new review
                parsedReviews.push(newtodo);
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedReviews, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated todolist!')
                );
            }
        });


        const response = {
            status: 'success',
            body: req.body,
        };

        console.log(response);
        res.status(201).json(response);
    }
});


app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);