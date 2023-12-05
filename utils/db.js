import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.port = process.env.DB_PORT || 27017;
    this.host = process.env.DB_HOST || '0.0.0.0';
    this.dbname = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.client.connect();
    this.db = this.client.db(this.dbname);
  }

  isAlive() {
    return (this.client.topology.isConnected());
  }

  async nbUsers() {
    const collectionName = 'users';
    try {
      const users = this.db.collection(collectionName);
      // return users.length;
      return users.countDocuments();
    } catch (err) {
      throw new Error(`${err.message}`);
    }
  }

  async nbFiles() {
    const collectionName = 'files';
    try {
      const files = this.db.collection(collectionName);
      // return files.length;
      return files.countDocuments();
    } catch (err) {
      throw new Error(`${err.message}`);
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

// import { MongoClient } from 'mongodb';

// class DBClient {
//   constructor() {
//     const DB_HOST = process.env.DB_HOST || '0.0.0.0';
//     const DB_PORT = process.env.DB_PORT || '27017';
//     const DB_NAME = process.env.DB_DATABASE || 'files_manager';

//     const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
//     this.client = new MongoClient(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     this.client.connect();
//     this.db = this.client.db(DB_NAME);
//   }

//   isAlive() {
//     return (this.client.topology.isConnected());
//   }

//   async nbUsers() {
//     try {
//       const users = this.db.collection('users');
//       return users.countDocuments();
//     } catch (err) {
//       throw new Error(`${err.message}`);
//     }
//   }

//   async nbFiles() {
//     try {
//       const files = this.db.collection('files');
//       return files.countDocuments();
//     } catch (err) {
//       throw new Error(`${err.message}`);
//     }
//   }
// }

// const dbClient = new DBClient();
// export default dbClient;
