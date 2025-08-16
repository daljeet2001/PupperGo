import mongoose from 'mongoose';

function connectToDb() {
  const uri = process.env.TEST_DB_CONNECT;
  if (!uri) throw new Error("TEST_DB_CONNECT is not defined");

  mongoose.connect(uri)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log('Error connecting to DB:', err));
}

export default connectToDb;
