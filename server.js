const express = require('express');
const path = require('path');

const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);


app.get('/api/notes', (req, res) => {
    try {
        const newdbdata = fs.readFileSync('./db/db.json', 'utf-8')
        console.log(newdbdata);
        const parseddata = JSON.parse(newdbdata);
        res.json(parseddata);
        console.log(parseddata)
    } catch (err) {
        console.log(err);
        res.json({msg: err});
    }
});


app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    if (title && text) {
        const newtodo = {
            title,
            text,
        };
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsednote = JSON.parse(data);

                // Add a new review
                parsednote.push(newtodo);
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsednote, null, 4),
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
    } else {
        res.status(500).json('Error in posting review');
    }
});


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);