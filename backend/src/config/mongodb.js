import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

// Init a object taskflowDatabaseInstance first is null to store the connection to MongoDB
let taskflowDatabaseInstance = null

// Init a instance of MongoClient to connect to MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  /*
    Instantiate a MongoClient that sets the Stable API version and connects to a server by performing the following operations:
    - Specify a server URI to connect to.
    - Specify a Stable API version in the MongoClientOptions object, using a constant from the ServerApiVersion object.
    - Instantiate a MongoClient, passing the URI and the MongoClientOptions to the constructor.
    Docs: https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
  */
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Connect to MongoDB
export const CONNECT_DB = async (databaseName = env.DATABASE_NAME) => {
    // Call the connect method on the mongoClientInstance object to connect to MongoDB Atlas
    await mongoClientInstance.connect()

    // Connect successfully to MongoDB Atlas and get Database by name and store it in taskflowDatabaseInstance
    taskflowDatabaseInstance = mongoClientInstance.db(databaseName)
}

// This GET_DB (non-async) function is responsible for exporting the taskflowDatabaseInstance after successfully
// connecting to MongoDB so that we can use it in many different places in the code.
// Note that you must always make sure to only call this GET_DB after successfully connecting to MongoDB
export const GET_DB = () => {
    if (!taskflowDatabaseInstance) {
        throw new Error('You must connect to the database first')
    }
    return taskflowDatabaseInstance
}

export const DELETE_DB = async (databaseName) => {
    // Drop the database
    await mongoClientInstance.db(databaseName).dropDatabase()
}

// Close the connection to MongoDB Atlas
export const CLOSE_DB = async () => {
    await mongoClientInstance.close()
}
