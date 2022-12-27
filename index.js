const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// MongoDB connection

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wlnmxxz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    const userCollection = client.db("we_share_database").collection("users");
    const postCollection = client.db("we_share_database").collection("posts");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = {
        email: user.email,
      };
      const signedIn = userCollection.find(query).toArray();
      if ((await signedIn).length) {
        const message = `You have already added signed in`;
        return res.send({ acknowledged: false, message });
      }
      const users = await userCollection.insertOne(user);
      res.send(users);
    });

    app.post("/posts", async (req, res) => {
      const post = req.body;
      const posts = await postCollection.insertOne(post);
      res.send(posts);
    });

    app.get("/posts", async (req, res) => {
      const result = await postCollection.find({}).sort({ date: -1 }).toArray();
      res.send(result);
    });
  } finally {
  }
};
dbConnect().catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.send("We share server is running");
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
