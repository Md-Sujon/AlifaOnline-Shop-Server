const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
console.log(process.env.DB_USER);
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7zutu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connect err', err);
  const productCollection = client.db("alifaonline").collection("product");
  const orderCollection = client.db("alifaonline").collection("order");

         app.get('/products', (req, res) => {
           productCollection.find()
           .toArray((err, items) => {
           res.send(items)
            
           })

             })


 
  app.post('/product', (req, res)=>{
      const newProduct = req.body;
      console.log('adding newProduct', newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
        console.log('insert count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })



  app.get('/products/:id', (req, res) =>{
    const id = req.params.id;
    productCollection.find({_id:ObjectID(id)})
    .toArray((err, documents)=>{
        res.send(documents[0])
    })
})
  

app.post('/newOrder', (req, res) => {
  const newOrder = req.body;
  orderCollection.insertOne(newOrder)
  .then(result => {
       res.send(result.insertedCount > 0);
  })

  // console.log(newOrder);
})

app.get('/order', (req, res) => {
  // console.log(req.query.email);
  orderCollection.find({email: req.query.email})
  .toArray((err, documents) => {
    res.send(documents);
  })
})

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  console.log("Book deleted", id);
  productCollection.findOneAndDelete({_id: ObjectID(id)})
  .then((document) => res.send(document.deleteCount > 0))
});


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})