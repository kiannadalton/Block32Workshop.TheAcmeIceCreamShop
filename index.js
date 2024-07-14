// import packages
const pg = require('pg');
const express = require('express');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_ice_cream');

// create Server
const server = express();

// function to connect to database
// asynce because I'll need to query and await my database
const init = async () => {
    await client.connect();
    console.log('connected to database')
    
    let SQL = `
        DROP TABLE IF EXISTS flavor;
        CREATE TABLE flavor(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        );`;
    await client.query(SQL);
    console.log('table created')

    SQL = `
        INSERT INTO flavor(name, is_favorite) VALUES('Chocolate', FALSE);
        INSERT INTO flavor(is_favorite, name) VALUES(TRUE, 'Raspberry Cheesecake');
        INSERT INTO flavor(name) VALUES('Vanilla');
    `;
    await client.query(SQL);
    console.log('seeded data')

    const port = process.env.PORT || 3000
    server.listen(port, () => {
        console.log(`listening on port ${port}`)
    })


};

// invoke init function
init();

// middlewares
// If we sent post or put, this helps convert to JSON
server.use(express.json());
server.use(require('morgan')('dev'));



// CRUD
// Create
server.post('/api/flavors', async (req, res, next) => {
    try {
        const {name, is_favorite} = req.body;

        const SQL = `
            INSERT INTO flavor(name, is_favorite) VALUES($1, $2) RETURNING *;
        `;

        // one way to do this:
        // const response = await client.query(SQL, [req.body.name, req.body.is_favorite]);

        // other way is to establish keys are a variable (const) and include variable like the below:
        const response = await client.query(SQL, [name, is_favorite]);

        // add status for updating (201)
        res.status(201).send(response.rows[0]);
    } catch (error) {
        // send error response
        // can have express handle it by using 'next(error)'
        next(error);
    }
});

// Read array
server.get('/api/flavors', async (req, res, next) => {
    // ORDER BY DESC will order items in descending order
    // ORDER BY ASC for ascending
    try {
        const SQL = `
        SELECT * from flavor ORDER BY created_at DESC;
        `;
        const response = await client.query(SQL);
        res.send(response.rows);

    } catch (error) {
        next(error);
    }

});

// Read Single flavor
server.get('/api/flavors/:id', async (req, res, next) => {
    try {
        // SELECT * brings all info into Postman
        const SQL = `
        SELECT * from flavor WHERE id=$1;
        `;
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }

});

// Update
server.put('/api/flavors/:id', async (req, res, next) => {
    try {
        const {name, is_favorite} = req.body;

        const SQL = `
            UPDATE flavor SET name=$1, is_favorite=$2, updated_at=now() WHERE id=$3 RETURNING *;
            `;
        // id comes from path, so you need to do req.params.id
        const response = await client.query(SQL, [name, is_favorite, req.params.id]);
        res.send(response.rows[0]);

    } catch (error) {
        next(error);
    }
});

// Delete
server.delete('/api/flavors/:id', async (req, res, next) => {
    try {
        // MAKE SURE TO ADD WHERE id=$1 so it doesn't delete more than what you want! <<<<
        const SQL = `
            DELETE FROM flavor WHERE id=$1;
        `;
        await client.query(SQL, [req.params.id]);
        // send status code 204 for delete
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
});





