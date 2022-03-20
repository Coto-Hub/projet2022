export default {
    async getDb() {
        return new Promise((resolve, reject) => {

            let request = window.indexedDB.open('evaluationDB', 1);

            request.onerror = e => {
                console.log('Error opening db', e);
                reject('Error');
            };

            request.onsuccess = e => {
                resolve(e.target.result);
            };

            request.onupgradeneeded = e => {
                console.log('onupgradeneeded');
                let db = e.target.result;
                db.createObjectStore("classroom", { autoIncrement: true, keyPath:'id' });
                db.createObjectStore("evaluation", { autoIncrement: true, keyPath:'id' });
            };
        });
    },
}