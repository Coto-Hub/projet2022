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
                db.createObjectStore("rating", { autoIncrement: true, keyPath:'id_rat' });
                db.createObjectStore("currently_rating", { autoIncrement: true, keyPath:'id_curr' });
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
    async deleteClassFromDb(db, id_class) {
        return new Promise((resolve) => {
            let objectStore = db.transaction(['student'],'readwrite')
                .objectStore('student');
            objectStore.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_class) === parseInt(id_class)) {
                        objectStore.delete(cursor.value.id_student);
                    }
                    cursor.continue();
                }
            };
            let request = db.transaction(['classroom'],'readwrite')
                .objectStore('classroom')
                .delete(id_class);

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
    async updateEvalToDb(db, evaluation) {
        return new Promise((resolve) => {
            let objectStore = db.transaction(['evaluation'],'readwrite')
                .objectStore('evaluation');
            let request = objectStore.get(evaluation.id_eval);

            request.onsuccess = function() {
                objectStore.put(evaluation)
                    .onsuccess = function() {
                    resolve();
                };
            };
        });
    },
    async deleteEvalFromDb(db, id_eval) {
        return new Promise((resolve) => {
            let objectStore = db.transaction(['criteria'],'readwrite')
                .objectStore('criteria');
            objectStore.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_eval) === parseInt(id_eval)) {
                        objectStore.delete(cursor.value.id_crit);
                    }
                    cursor.continue();
                }
            };
            let request = db.transaction(['evaluation'],'readwrite')
                .objectStore('evaluation')
                .delete(id_eval);

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
    async getEvaluationNameFromDb(db, id_eval) {
        return new Promise((resolve) => {
            db.transaction(['evaluation'],'readwrite')
                .objectStore('evaluation')
                .get(id_eval)
                .onsuccess = function(event) {
                resolve(event.target.result.name);
            };
        });
    },
    getCriteriasFromDb(db, id_eval) {
        return new Promise((resolve) => {
            let criterias = [];
            db.transaction(['criteria'],'readonly')
                .objectStore('criteria')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_eval) === parseInt(id_eval)) {
                        criterias.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
            resolve(criterias);
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
    },
    async updateCriteriaToDb(db, criteria) {
        return new Promise((resolve) => {
            let objectStore = db.transaction(['criteria'],'readwrite')
                .objectStore('criteria');
            let request = objectStore.get(criteria.id_crit);

            request.onsuccess = function() {
                objectStore.put(criteria)
                    .onsuccess = function() {
                    resolve();
                };
            };
        });
    },
    async deleteCriteriaToDb(db, criteria) {
        return new Promise((resolve) => {
            db.transaction(['criteria'],'readwrite')
                .objectStore('criteria')
                .delete(criteria.id_crit);

            resolve();
        });
    },
    async getCurrentlyRatingFromDb(db) {
        return new Promise((resolve) => {
            db.transaction(['currently_rating'],'readwrite')
                .objectStore('currently_rating')
                .getAll().onsuccess = function(event) {
                resolve(event.target.result);
            };
        });
    },

    async addCurrentlyRatedtToDb(db, currentlyRated) {
        return new Promise((resolve) => {

            let request = db.transaction(['currently_rating'],'readwrite')
                .objectStore('currently_rating')
                .add(currentlyRated);

            request.onsuccess = function() {
                resolve();
            };
        });
    },
    async deleteCurrentlyRatingToDb(db, currently_rating) {
        return new Promise((resolve) => {
            db.transaction(['currently_rating'],'readwrite')
                .objectStore('currently_rating')
                .delete(currently_rating.id_curr);

            resolve();
        });
    },
}
