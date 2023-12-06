import { authenticateDatabase, syncDatabase } from '../../dbmodels';

authenticateDatabase()
  .then(() => syncDatabase())
  .catch((err) => console.error(err))