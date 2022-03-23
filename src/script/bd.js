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
            let request = db.transaction(['classroom'],'readwrite')
                .objectStore('classroom')
                .add(classroom);

            request.onsuccess = function() {
                resolve();
            };
        });
    },
    async deleteClassFromDb(db, id) {
        return new Promise((resolve) => {
            let request = db.transaction(['classroom'],'readwrite')
                .objectStore('classroom')
                .delete(id);

            request.onsuccess = function() {
                resolve();
            };
        });
    },
    async getClassroomFromDb(db) {
        return new Promise((resolve) => {
            db.transaction(['classroom'],'readwrite')
                .objectStore('classroom')
                .getAll().onsuccess = function(event) {
                resolve(event.target.result);
            };
        });
    },
    async getClassNameFromDb(db, id_class) {
        return new Promise((resolve) => {
            db.transaction(['classroom'],'readwrite')
                .objectStore('classroom')
                .get(id_class)
                .onsuccess = function(event) {
                resolve(event.target.result.name);
            };
        });
    },
    async updateClassToDb(db, classroom) {
        return new Promise((resolve) => {
            let objectStore = db.transaction(['classroom'],'readwrite')
                .objectStore('classroom');
            let request = objectStore.get(classroom.id_class);

            request.onsuccess = function() {
                objectStore.put(classroom)
                    .onsuccess = function() {
                    resolve();
                };
            };
        });
    },
    async getStudentOfClassFromDb(db, id_class) {
        return new Promise((resolve) => {
            let students = [];
            db.transaction(['student'],'readonly')
                .objectStore('student')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_class) === parseInt(id_class)) {
                        students.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
            resolve(students);
        });
    },
    async addStudentToDb(db, student) {
        return new Promise((resolve) => {
            let request = db.transaction(['student'],'readwrite')
                .objectStore('student')
                .add(student);

            request.onsuccess = function() {
                resolve();
            };
        });
    },
    async updateStudentToDb(db, student) {
        return new Promise((resolve) => {
            let objectStore = db.transaction(['student'],'readwrite')
                .objectStore('student');
            let request = objectStore.get(student.id_student);

            request.onsuccess = function() {
                objectStore.put(student)
                    .onsuccess = function() {
                    resolve();
                };
            };
        });
    },
    async deleteStudentToDb(db, student) {
        return new Promise((resolve) => {
            db.transaction(['student'],'readwrite')
                .objectStore('student')
                .delete(student.id_student);

            resolve();
        });
    },
    async addEvalToDb(db, evaluation) {
        return new Promise((resolve) => {
            let request = db.transaction(['evaluation'],'readwrite')
                .objectStore('evaluation')
                .add(evaluation);

            request.onsuccess = function() {
                resolve();
            };
        });
    },
    async deleteEvalFromDb(db, id) {
        return new Promise((resolve) => {
            let request = db.transaction(['evaluation'],'readwrite')
                .objectStore('evaluation')
                .delete(id);

            request.onsuccess = function() {
                resolve();
            };
        });
    },
    async getEvaluationFromDb(db) {
        return new Promise((resolve) => {
            db.transaction(['evaluation'],'readwrite')
                .objectStore('evaluation')
                .getAll().onsuccess = function(event) {
                resolve(event.target.result);
            };
        });
    },
    getCriteriasFromDb(db, id_eval) {
        return new Promise((resolve) => {
            let criterias = [];
            let request = db.transaction(['student'],'readonly')
                .objectStore('student')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_eval) === parseInt(id_eval)) {
                        criterias.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
            request.onsuccess = function() {
                resolve(criterias);
            };
        });
    },
    addCriteriaToDb(db, criteria) {
        return new Promise((resolve) => {

            let request = db.transaction(['criteria'],'readwrite')
                .objectStore('criteria')
                .add(criteria);

            request.onsuccess = function() {
                resolve();
            };
        });
    }
}
