import { userIndex, searchIndex, categoryIndex  } from '../algolia/algolia';

console.log('executing algolia delete script');
// delete all indices function
const deleteAllIndices = async () => {
    try {
        await searchIndex.delete();
        await userIndex.delete();
        await categoryIndex.delete();
        console.log('indices deleted');
    } catch (error) {
        console.log('error', error);
    }
}
// invoke it
deleteAllIndices();
