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
