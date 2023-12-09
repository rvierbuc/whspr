import {dropDatabase, createDatabase, authenticateDatabase, syncDatabase, closeDatabase} from '../../dbmodels';
import { seedDatabase } from './seeder-goofy';
const resetDb = async () =>{
    try {
    await authenticateDatabase();
    await dropDatabase();
    await createDatabase();
    await authenticateDatabase();
    await syncDatabase();
    await seedDatabase();
    await closeDatabase();
}catch(error){
    console.error('error resetting database: ', error)
}
}

resetDb()