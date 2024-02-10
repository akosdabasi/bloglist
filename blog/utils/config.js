require('dotenv').config();

const MONGODB_URI = process.env.NODE_ENV === 'production' ?  process.env.MONGODB_URI : process.env.TEST_MONGODB_URI;
const PORT = process.env.PORT;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = {MONGODB_URI, PORT, ACCESS_TOKEN_SECRET};