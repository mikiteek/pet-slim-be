const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const databaseConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, options);
    console.log(`Mongoose has connected to DB`);
  }
  catch (e) {
    console.log(e);
    process.exit(1);
  }
}

module.exports = databaseConnect;