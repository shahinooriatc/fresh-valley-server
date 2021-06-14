const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5055
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wklhy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("shop").collection("products");
    const orderCollection = client.db("shop").collection("order");

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log("add new product", newProduct);

        productCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
            })
    })

    app.post('/product/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, items) => {
                res.send(items);
                console.log(items);
            })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log('samsul',newOrder);
        orderCollection.insertOne(newOrder)
        .then(result => {
            console.log(result);
        })


    })

    app.get('/orders', (req, res) => {
        console.log(req.query.email);
        orderCollection.find({email: req.query.email})
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})