export default {
    template: `
    <div class="container mt-4">
    <h2 class="text-center mb-4">Quiz Questions</h2>

    <!-- Create question modal -->
    <div v-if="creatingQuestion" class="modal d-block">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Create Question</h5>
                    <button type="button" class="btn-close" @click="cancelEdit"></button>
                </div>
                <div class="modal-body">
                    <label>Question Statement:</label>
                    <input type="text" class="form-control" v-model="questionData.question_statement">

                    <label>Option 1:</label>
                    <input type="text" class="form-control" v-model="questionData.option1">

                    <label>Option 2:</label>
                    <input type="text" class="form-control" v-model="questionData.option2">

                    <label>Option 3:</label>
                    <input type="text" class="form-control" v-model="questionData.option3">

                    <label>Option 4:</label>
                    <input type="text" class="form-control" v-model="questionData.option4">

                    <label>Correct Option:</label>
                    <select class="form-select" v-model="questionData.correct_option">
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                        <option value="4">Option 4</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                    <button class="btn btn-success" @click="createQuestion">Create</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Editing quiz -->
    <div v-if="editingQuestion !== null" class="modal d-block">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Question</h5>
                    <button type="button" class="btn-close" @click="cancelEdit"></button>
                </div>
                <div class="modal-body">
                    <label>Question Statement:</label>
                    <input type="text" class="form-control" v-model="questionData.question_statement">

                    <label>Option 1:</label>
                    <input type="text" class="form-control" v-model="questionData.option1">

                    <label>Option 2:</label>
                    <input type="text" class="form-control" v-model="questionData.option2">

                    <label>Option 3:</label>
                    <input type="text" class="form-control" v-model="questionData.option3">

                    <label>Option 4:</label>
                    <input type="text" class="form-control" v-model="questionData.option4">

                    <label>Correct Option:</label>
                    <select class="form-select" v-model="questionData.correct_option">
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                        <option value="4">Option 4</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                    <button class="btn btn-success" @click="updateQuestion">Update</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Deleting modal -->
    <div v-if="deletingQuestion !== null" class="modal d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Deletion</h5>
                        <button type="button" class="btn-close" @click="cancelDelete"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete this question?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
                        <button class="btn btn-danger" @click="deleteQuestion">Delete</button>
                    </div>
                </div>
            </div>
        </div>


    <!-- The cards -->
    <div class="row">
        <div v-if="questions?.length > 0"  v-for="question in questions" :key="question.id" class="col-12 mb-3">
            <div class="card shadow-sm p-3">
                <div class="card-body">
                    <h5 class="card-title">
                    <i class="fas fa-hashtag text-primary"></i> {{ question.id }} -
                        {{ question.question_statement }}
                    </h5>

                    <ul class="list-group mt-3">
                        <li class="list-group-item">
                            <i class="fas fa-circle-check"></i> {{ question.option1 }}
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-circle-check"></i> {{ question.option2 }}
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-circle-check"></i> {{ question.option3 }}
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-circle-check"></i> {{ question.option4 }}
                        </li>
                        <li class="list-group-item">
                            <strong>Correct Option:</strong> 
                            <span class="text-primary fw-bold">{{ question.correct_option }}</span>
                        </li>
                    </ul>

                    <div class="d-flex justify-content-end mt-3">
                        <button class="btn btn-warning btn-sm me-2" @click="editQuestion(question)">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" @click="confirmDelete(question.id)">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <div class="text-center m-4">
        <button class="btn btn-success btn-sm" @click="addQuestion()">
            <i class="fas fa-plus"></i> Add Question
        </button>
    </div>
</div>
        
    `,

    data() {
        return {
            userData: null,
            questions: [],
            questionData: {
                question_statement: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                correct_option: '',
            },
            creatingQuestion: false,
            editingQuestion: null,
            deletingQuestion: null
        };
    },

    mounted() {
        this.quizId = this.$route.params.quizId;
        this.loadUser();
        this.loadQuestions();
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

        loadQuestions() {
            const quizId = this.$route.params.quizId;
            fetch(`/api/questions/get/${quizId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.$root.message = data.message;
                    this.questions = data.questions;
                })
        },

        addQuestion() {
            this.creatingQuestion = true;
            this.questionData = {
                'question_statement': '',
                'option1': '',
                'option2': '',
                'option3': '',
                'option4': '',
                'correct_option': '',
            };
        },

        createQuestion() {
            this.questionData.quizId = this.quizId
            fetch(`/api/questions/create/${this.quizId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.questionData)
            })
                .then(response => response.json())
                .then(data => {
                    this.$root.message = data.message;
                    this.loadQuestions();
                    this.cancelEdit();s
                });
        },

        editQuestion(question) {
            this.editingQuestion = question.id;
            this.questionData = {...question};
        },

        updateQuestion() {
            fetch(`/api/questions/update/${this.editingQuestion}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.questionData)
            })
            .then(response=>response.json())
            .then((data)=> {
                this.$root.message = data.message;
                this.loadQuestions();
                this.cancelEdit()
            });
        },

        cancelEdit() {
            this.editingQuestion = null;
            this.creatingQuestion = false;
            this.questionData = {
                'question_statement': '',
                'option1': '',
                'option2': '',
                'option3': '',
                'option4': '',
                'correct_option': '',
            };
        },
        confirmDelete(questionId){
            this.deletingQuestion = questionId;
        },

        deleteQuestion(){
            fetch(`/api/questions/delete/${this.deletingQuestion}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                    }
                    })
                    .then(response=>response.json())
                    .then((data)=> {
                        this.$root.message = data.message;
                        this.loadQuestions();
                        this.deletingQuestion = null;
                        });
        },

        cancelDelete(){
            this.deletingQuestion = null;
        }
    }
}