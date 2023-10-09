// const fs = require('fs');
// fs.writeFileSync('test1.txt', 'this is text file!');

// const http = require('http');
// http.createServer((req, resp) => {
//     resp.write('<h1>Hello</h1>');
//     resp.end();
// }).listen(4500);

// const mydata = [
//     { "name": "anil", "address": "surat" }
// ];
// const http = require('http');
// http.createServer((req, resp) => {
//     resp.writeHead(200, { 'Content-Type': 'application/json' });
//     resp.write(JSON.stringify(mydata));
//     resp.end();
// }).listen(5000);

// const mydata = [
//     { "name": "anil", "address": "surat" }
// ];

// const http = require('http');
// const port = 5000;

// http.createServer((req, resp) => {
//     if (req.method === 'GET') {
//         // Handle GET requests
//         resp.writeHead(200, { 'Content-Type': 'application/json' });
//         resp.write(JSON.stringify(mydata));
//         resp.end();
//     } else if (req.method === 'POST') {
//         // Handle POST requests
//         let body = '';

//         req.on('data', (chunk) => {
//             body += chunk;
//         });

//         req.on('end', () => {
//             try {
//                 const newRecord = JSON.parse(body);
//                 mydata.push(newRecord);
//                 resp.writeHead(201, { 'Content-Type': 'application/json' });
//                 resp.write(JSON.stringify({ message: 'Record added successfully' }));
//                 resp.end();
//             } catch (error) {
//                 resp.writeHead(400, { 'Content-Type': 'application/json' });
//                 resp.write(JSON.stringify({ error: 'Invalid JSON data' }));
//                 resp.end();
//             }
//         });
//     } else {
//         resp.writeHead(404, { 'Content-Type': 'application/json' });
//         resp.write(JSON.stringify({ error: 'Not Found' }));
//         resp.end();
//     }
// }).listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// app.use(bodyParser.json());
// const myData = [{ "name": "akash", "address": "puri" }];
// app.get('/', (req, resp) => {
//     resp.write(JSON.stringify(myData));
//     resp.end();
// })

// app.post('/', (req, resp) => {
//     const newData = req.body;
//     myData.push(newData);
//     resp.write(JSON.stringify(newData));
//     resp.end();
// })

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });

const express = require('express');
const app = express();
app.use(express.json());
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://truei773:9kjHzH09CtyntdWB@cluster0.z9masui.mongodb.net/e-comm?retryWrites=true&w=majority'; // Specify the database name in the URL
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dbConnection = async () => {
    try {
        await client.connect();
        const db = client.db(); // Remove 'e-comm' from here
        return db.collection('products');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

app.get('/', async (req, resp) => {
    try {
        const db = await dbConnection();
        const data = await db.find({}).toArray();
        resp.send(data);
    } catch (error) {
        console.error('Error retrieving data:', error);
        resp.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/', async (req, resp) => {
    try {
        const db = await dbConnection();
        const result = await db.insertMany(req.body);
        console.log('Inserted document with ID:', result.insertedId);
        resp.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        resp.status(500).json({ message: 'Internal Server Error' });
    }
});
app.put('/', async (req, resp) => {
    try {
        const body = req.body;
        const db = await dbConnection();
        const result = await db.updateOne({ name: req.body.name }, { $set: req.body });
        // console.log(result);
        if (result.modifiedCount > 0) {
            console.log("records was successfully updatesd")
        } else {
            console.log("records not found")
        }
        resp.status(201).json({ message: 'records was successfully updatesd' });
    } catch (error) {
        console.error('Error updating data:', error);
        resp.status(500).json({ message: 'Internal Server Error' });
    }
})
app.delete('/', async (req, resp) => {
    try {
        const db = await dbConnection();
        const result = await db.deleteOne(req.body);
        console.log(result);
        if (result.deletedCount > 0) {
            console.log("record was successfully deleted!")
        } else {
            console.log("No record found to delete");
            resp.status(404).json({ message: 'No record found to delete' });
        }
        resp.status(201).json({ message: 'records was successfully deleted' });
        // resp.status(201).json({ message: 'records was successfully deleted' });
    } catch (error) {
        console.error('Error deleteing process:', error);
        resp.status(500).json({ message: 'Internal Server Error' });
        // throw error;
    }

})
app.listen(5400, () => {
    console.log('Server is running on port 5400');
});
