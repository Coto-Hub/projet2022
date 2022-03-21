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
                db.createObjectStore("classroom", { autoIncrement: true, keyPath:'id_class' });
                db.createObjectStore("evaluation", { autoIncrement: true, keyPath:'id_eval' });
                db.createObjectStore("student", { autoIncrement: true, keyPath:'id_student' });
                db.createObjectStore("criteria", { autoIncrement: true, keyPath:'id_crit' });
            };
        });
    },
    async addClassToDb(db, classroom) {
        return new Promise((resolve) => {

            let trans = db.transaction(['classroom'],'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            let store = trans.objectStore('classroom');
            store.add(classroom);

        });
    },
    async deleteClassFromDb(db, id) {
        return new Promise((resolve) => {
            let trans = db.transaction(['classroom'],'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            let store = trans.objectStore('classroom');
            store.delete(id);
        });
    },
    async getClassroomFromDb(db) {
        return new Promise((resolve) => {

            let trans = db.transaction(['classroom'],'readonly');
            trans.oncomplete = () => {
                resolve(classrooms);
            };

            let store = trans.objectStore('classroom');
            let classrooms = [];

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    classrooms.push(cursor.value)
                    cursor.continue();
                }
            };
        });
    },
    async getStudentOfClassFromDb(db, id_class) {
        return new Promise((resolve) => {

            let trans = db.transaction(['student'],'readonly');
            trans.oncomplete = () => {
                resolve(students);
            };

            let store = trans.objectStore('student');
            let students = [];

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_class) === parseInt(id_class)) {
                        students.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
        });
    },
    async addStudentToDb(db, student) {
        return new Promise((resolve) => {

            let trans = db.transaction(['student'],'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            let store = trans.objectStore('student');
            store.add(student);

        });
    },
    async addEvalToDb(db, evaluation) {
        return new Promise((resolve) => {

            let trans = db.transaction(['evaluation'],'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            let store = trans.objectStore('evaluation');
            store.add(evaluation);

        });
    },
    async deleteEvalFromDb(db, id) {
        return new Promise((resolve) => {
            let trans = db.transaction(['evaluation'],'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            let store = trans.objectStore('evaluation');
            store.delete(id);
        });
    },
    async getEvaluationFromDb(db) {
        return new Promise((resolve) => {

            let trans = db.transaction(['evaluation'],'readonly');
            trans.oncomplete = () => {
                resolve(evaluations);
            };

            let store = trans.objectStore('evaluation');
            let evaluations = [];

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    evaluations.push(cursor.value)
                    cursor.continue();
                }
            };
        });
    },
    getCriteriasFromDb(db, id_eval) {
        return new Promise((resolve) => {

            let trans = db.transaction(['criteria'],'readonly');
            trans.oncomplete = () => {
                resolve(criterias);
            };

            let store = trans.objectStore('criteria');
            let criterias = [];

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_eval) === parseInt(id_eval)) {
                        criterias.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
        });
    },
    addCriteriaToDb(db, criteria) {
        return new Promise((resolve) => {

            let trans = db.transaction(['criteria'],'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            let store = trans.objectStore('criteria');
            store.add(criteria);

        });
    }
}
