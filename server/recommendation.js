/**
 * Generate assignment recommendations based on student ability and academic week.
 * @param {number} ability - Numeric representation of student ability.
 * @param {number} week - Current academic week.
 * @param {import('@azure/cosmos').CosmosClient} cosmosClient - Cosmos DB client.
 * @returns {Promise<Array>} Assignment recommendations.
 */
async function generateRecommendations(ability, week, cosmosClient) {
  if (!cosmosClient) {
    return [{ title: `Week ${week} assignment`, difficulty: ability }];
  }

  const databaseId = process.env.COSMOS_DB_DATABASE;
  const containerId = 'assignments';
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.minAbility <= @ability AND c.week = @week',
    parameters: [
      { name: '@ability', value: ability },
      { name: '@week', value: week }
    ]
  };

  const database = cosmosClient.database(databaseId);
  const container = database.container(containerId);
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
}

module.exports = { generateRecommendations };
