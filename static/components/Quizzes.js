export default {
    template: `
    <div class="container mt-5">
    <h1 class="text-center">Quizzes of {{quizData.chapter_name}} :</h1>

        <button v-if="userData?.role === 'admin'" class="btn btn-success btn-sm" @click="addQuiz()">
        <i class="fa fa-plus"></i> Add Quiz
        </button>

        <!-- Create Quiz Modal -->
        <div v-if="creatingQuiz" class="modal d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create Quiz</h5>
                        <button type="button" class="btn-close" @click="cancelEdit"></button>
                    </div>
                    <div class="modal-body">
                        <label>Duration:</label>
                        <input type="text" class="form-control" v-model="quizData.time_duration">
                        <label>Difficulty Level:</label>
                        <select class="form-select" v-model="quizData.difficulty_level">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                        <button class="btn btn-success" @click="createQuiz">Create</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quizzes List -->
        <div v-if="quizzes?.length > 0" class="mb-5">
            <div class="table-responsive mt-5">
                <table class="table table-bordered table-striped">
                    <thead class="table-warning text-center">
                        <tr>
                            <th>#</th>
                            <th>Duration</th>
                            <th>Difficulty Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(quiz, index) in quizzes" :key="quiz.id">
                            <td class="text-center">Quiz {{ index + 1 }}</td>
                            <td class="text-center">{{ quiz.time_duration }}</td>
                            <td class="text-center">
                                <span v-if="quiz.difficulty_level === 'easy'" class="text-success">Easy</span>
                                <span v-else-if="quiz.difficulty_level === 'medium'" class="text-warning">Medium</span>
                                <span v-else class="text-danger">Hard</span>
                            </td>

                            <td>
                            <div class="d-flex justify-content-around align-items-center gap-2">
                                <!-- Admin Buttons -->
                                <button v-if="userData?.role === 'admin'" class="btn btn-warning btn-sm" @click="editQuiz(quiz)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button v-if="userData?.role === 'admin'" class="btn btn-danger btn-sm" @click="confirmDelete(quiz.id)">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <button v-if="userData?.role === 'admin'" class="btn btn-primary btn-sm" @click="viewQuiz(quiz.id)">
                                    <i class="fas fa-eye"></i>
                                </button>

                                <!-- User Button / Message -->
                                <div v-if="userData?.role === 'user'">
                                    <button v-if="quiz.questions > 0" class="btn btn-primary btn-sm" @click="attemptQuiz(quiz.id)">
                                        <i class="fas fa-check"></i> Attempt quiz
                                    </button>
                                    <span v-else class="text-danger">
                                        <i class="fa-regular fa-clock"></i> No questions added yet
                                    </span>
                                </div>
                            </div>
                        </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="alert alert-warning text-center m-5">
            No Quizzes added yet.
        </div>

        <!-- Edit Quiz Modal -->
        <div v-if="editingQuiz !== null" class="modal d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Quiz</h5>
                        <button type="button" class="btn-close" @click="cancelEdit"></button>
                    </div>
                    <div class="modal-body">
                        <label>Duration:</label>
                        <input type="text" class="form-control" v-model="quizData.time_duration">
                        
                        <label>Difficulty Level:</label>
                        <select class="form-select" v-model="quizData.difficulty_level">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                        <button class="btn btn-success" @click="updateQuiz">Update</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="deletingQuiz !== null" class="modal d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Deletion</h5>
                        <button type="button" class="btn-close" @click="cancelDelete"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete this quiz?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
                        <button class="btn btn-danger" @click="deleteQuiz">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    ,

    data() {
        return {
            userData: null,
            quizzes: [],
            quizData: {time_duration: '', difficulty_level: '',chapterId: '', chapter_name: ''},
            editingQuiz: null,
            creatingQuiz: false,
            deletingQuiz: null
        };
    },

    mounted() {
        this.chapterId = this.$route.params.chapterId;
        this.loadUser();
        this.loadQuizzes();
    },

    methods: {
        loadUser() {
            fetch('/api/user', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => { this.userData = data; })
            .catch(error => { console.error("Error fetching user data:", error); });
        },
        loadQuizzes() {
            const chapterId = this.$route.params.chapterId;
            fetch(`/api/quiz/get/${chapterId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => { 
                this.quizzes = data.quizzes;
                this.quizData.chapter_name = data.chapter_name;
                this.$root.message = data.message;
             })
            .catch(error => { console.error("Error loading quizzes:", error); });
        },

        createQuiz() {
            this.quizData.chapterId = this.chapterId
            fetch(`/api/quiz/create/${this.chapterId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(this.quizData),
            })
            .then(response => response.json())
            .then((data) => {
                this.$root.message = data.message;
                this.loadQuizzes();
                this.cancelEdit();
            });
        },

        editQuiz(quiz) {
            this.editingQuiz = quiz.id;
            this.quizData = { ...quiz };
        },

        addQuiz(){
            this.creatingQuiz = true;
            this.quizData = {
                time_duration: '',
                difficulty_level: ''
            };
        },

        updateQuiz() {
            fetch(`/api/quiz/update/${this.editingQuiz}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(this.quizData)
            })
            .then(response => response.json())
            .then((data) => {
                this.$root.message = data.message;

                this.loadQuizzes();
                this.cancelEdit();
            });
        },

        confirmDelete(quizId) {
            this.deletingQuiz = quizId;
        },

        deleteQuiz() {
            fetch(`/api/quiz/delete/${this.deletingQuiz}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authentication-Token': localStorage.getItem('auth_token') }
            })
            .then((data) => {
                this.$root.message = data.message;
                this.loadQuizzes();
                this.cancelDelete();
            });
        },

        viewQuiz(quizId) {
            this.$router.push(`/questions/${quizId}`);
        },

        attemptQuiz(quizId){
            this.$router.push(`/attempt/${quizId}`);
        },
        /** Cancel editing */
        cancelEdit() {
            this.editingQuiz = null;
            this.creatingQuiz = false;
            this.quizData = {
                time_duration: '',
                difficulty_level: ''
            };
            
        },

        /** Cancel delete modal */
        cancelDelete() {
            this.deletingQuiz = null;
        }
    }
};
