const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db();
};

const getUsers = async (db) => {
  const users = await db.collection("users").find({}).toArray();
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(users),
  };
};

const getUser = async (db, email) => {
  const user = await db.collection("users").findOne({ email: email });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };
};

const createUser = async (db, user) => {
  const newUser = await db.collection("users").insertOne(user);
  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser.ops[0]),
  };
};

const updateUser = async (db, id, user) => {
  const updatedUser = await db
    .collection("users")
    .findOneAndUpdate({ _id: id }, { $set: user }, { returnOriginal: false });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser.value),
  };
};

const deleteUser = async (db, id) => {
  const deletedUser = await db
    .collection("users")
    .findOneAndDelete({ _id: id });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deletedUser.value),
  };
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const db = await connectToDatabase();

  const { id } = event.queryStringParameters || {}; // get id from path parameters

  switch (event.httpMethod) {
    case "GET":
      if (id) {
        return getUser(db, id);
      } else {
        return getUsers(db);
      }
    case "POST":
      return createUser(db, JSON.parse(event.body));
    case "PUT":
      return updateUser(db, id, JSON.parse(event.body));
    case "DELETE":
      return deleteUser(db, id);
    default:
      return {
        statusCode: 405,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Method not allowed",
        }),
      };
  }
};
