const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

let client;

function getCosmosClient() {
  if (!client) {
    if (!endpoint || !key) {
      throw new Error('COSMOS_DB_ENDPOINT or COSMOS_DB_KEY not set');
    }
    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

module.exports = getCosmosClient();
