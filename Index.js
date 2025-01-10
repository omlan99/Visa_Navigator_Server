const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors())
// app.use(cookieParser())



const uri = `mongodb+srv://${process.env.DB_Admin}:${process.env.DB_Password}@cluster0.e6udf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB !");

    // auth related api 

    const visaData = client.db('VisaData').collection('AllVisa')
    app.get('/', async (req,res)=>{
      const limit = parseInt(req.query.limit) || 100;
        const cursor = visaData.find().limit(limit);
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/addedVisa', async (req,res) =>{
      try{
        const formData = req.body;
        const result = await visaData.insertOne(formData)

        res.status(201).json({
          message: 'visa data added successfully',
          data : result,
        })
      }
      catch(error){
          console.log({error :"Failed to load Data "})
      }
      

    })
    
    app.get('/myVisa' , async (req,res) => {
      const email = req.query.email;
      const query = {email : email};
      const result = await visaData.find(query).toArray()
      res.send(result)
    })

    app.delete('/delete/:id', async(req,res) =>{
        const visaId = req.params.id;
        const result = await visaData.deleteOne({_id : new ObjectId(visaId)})
        console.log(result)
        res.send(result)
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () =>{
    console.log("Server is running at port :", port)
})  