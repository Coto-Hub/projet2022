import bd from '../script/bd'
export default {
    async getDb() {
        return new Promise((resolve, reject) => {

            let request = window.indexedDB.open('evaluationDB', 1);

            request.onerror = () => {
                reject('Error');
            };

            request.onsuccess = e => {
                resolve(e.target.result);
            };

            request.onupgradeneeded = e => {
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
            db.transaction(['student'],'readwrite')
                .objectStore('student')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_class) === parseInt(id_class)) {
                        bd.deleteStudentToDb(db, cursor.value);
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
                else {
                    resolve(students);
                }
            };
        });
    },
    async getStudentFromDb(db, id_student) {
        return new Promise((resolve) => {
            db.transaction(['student'],'readwrite')
                .objectStore('student')
                .get(id_student)
                .onsuccess = function(event) {
                resolve(event.target.result);
            };
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
        await this.deleteRatingOfStudent(db, student.id_student);
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
            db.transaction(['criteria'],'readwrite')
                .objectStore('criteria')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_eval) === parseInt(id_eval)) {
                        bd.deleteCriteriaToDb(db, cursor.value);
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
            let objectStore = db.transaction(['rating'],'readwrite')
                .objectStore('rating');
            objectStore.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_crit) === parseInt(criteria.id_crit)) {
                        objectStore.delete(cursor.value.id_rat);
                    }
                    cursor.continue();
                }
            };
            let request = db.transaction(['criteria'],'readwrite')
                .objectStore('criteria')
                .delete(criteria.id_crit);

            request.onsuccess = function() {
                resolve();
            };
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
    async getRatingOfStudentFromDb(db, id_student, id_crit) {
        return new Promise((resolve) => {
            let ratings = [];
            db.transaction(['rating'],'readonly')
                .objectStore('rating')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_student) === parseInt(id_student) && parseInt(cursor.value.id_crit) === parseInt(id_crit)) {
                        ratings.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    resolve(ratings);
                }
            };
        });
    },
    async getRatingFromDb(db, id_class, id_crit, id_student) {
        return new Promise((resolve) => {
            let ratings = [];
            let classroom = [];
            db.transaction(['student'],'readonly')
                .objectStore('student')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_class) === parseInt(id_class)) {
                        classroom.push(parseInt(cursor.value.id_student));
                    }
                    cursor.continue();
                }
                else {
                    classroom = classroom.filter(item => (item !== parseInt(id_student)));
                    db.transaction(['rating'],'readonly')
                        .objectStore('rating')
                        .openCursor().onsuccess = function (event) {
                        let cursor = event.target.result;
                        if (cursor) {
                            if (classroom.includes(parseInt(cursor.value.id_student)) === true && parseInt(cursor.value.id_crit) === parseInt(id_crit)) {
                                ratings.push(parseInt(cursor.value.score));
                            }
                            cursor.continue();
                        }
                        else {
                            resolve(ratings);
                        }
                    };
                }
            };
        });
    },
    async updateRatingToDb(db, rating) {
        return new Promise((resolve) => {
            db.transaction(['rating'],'readonly')
                .objectStore('rating')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_student) === rating.id_student && parseInt(cursor.value.id_crit) === parseInt(rating.id_crit)) {
                        rating.id_rat = cursor.value.id_rat;
                    }
                    cursor.continue();
                }
                else {
                    let request = null;
                    if (!rating.id_rat) {
                        request = db.transaction(['rating'],'readwrite')
                            .objectStore('rating')
                            .add(rating);
                    }
                    else {
                        request = db.transaction(['rating'],'readwrite')
                            .objectStore('rating')
                            .put(rating);
                    }
                    request.onsuccess = function() {
                        resolve();
                    };
                }
            };
        });
    },
    async getAvgStudent(db, id_student) {
        return new Promise((resolve) => {
            let sum = 0;
            let nb = 0;
            db.transaction(['rating'],'readonly')
                .objectStore('rating')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_student) === id_student) {
                        sum += cursor.value.score;
                        nb++;
                    }
                    cursor.continue();
                }
                else {
                    if (!isNaN(sum/nb)) {
                        resolve(Math.round(sum/nb*100)/100);
                    }
                    resolve("--");
                }
            };
        });
    },
    async isCompletRatingStudent(db, id_student, id_eval) {
        return new Promise((resolve) => {
            let nbRate = 0;
            let nbCrit = 0;
            db.transaction(['rating'],'readonly')
                .objectStore('rating')
                .openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_student) === parseInt(id_student)) {
                        nbRate++;
                    }
                    cursor.continue();
                }
                else {
                    db.transaction(['criteria'],'readonly')
                        .objectStore('criteria')
                        .openCursor().onsuccess = function (event) {
                        let cursor = event.target.result;
                        if (cursor) {
                            if (parseInt(cursor.value.id_eval) === parseInt(id_eval)) {
                                nbCrit++;
                            }
                            cursor.continue();
                        }
                        else {
                            resolve(nbRate === nbCrit);
                        }
                    };
                }
            };
        });
    },
    async deleteRatingOfStudent(db, id_student) {
        return new Promise((resolve) => {
            let objectStore = db.transaction(['rating'],'readwrite')
                .objectStore('rating');
            objectStore.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (parseInt(cursor.value.id_student) === parseInt(id_student)) {
                        objectStore.delete(cursor.value.id_rat);
                    }
                    cursor.continue();
                }
                else {
                    resolve();
                }
            };
        });
    },

}
