
const { Pool } = require('pg');

const myURI = 'postgres://kelgcjub:DZEm6dpgACMOGv5TKyDXeCJzBAkPbtuZ@drona.db.elephantsql.com:5432/kelgcjub';

const URI = myURI;

const pool = new Pool({
  connectionString: URI,
});

const db = module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
