const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

console.log(CREDENTIALS)

const firestore = new Firestore({
    projectId: CREDENTIALS.project_id,
    credentials: {
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    }
});

const database = require('./daftar_rumah_all_fixnoid.json')
const rumah = firestore.collection('rumah')
const createMenuItem = async (record,index) => {

  try {
        await rumah.doc(index.toString()).set(record)
        console.log('Records created.');
    } catch (error) {
        console.log(`Error at createRecord --> ${error}`);
    }
};


for (let index = 1; index < database.length; index++) {
        let element = database[index];
        element['ID'] = index;
        createMenuItem(element,index);
}