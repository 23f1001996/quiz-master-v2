export default {
    template: `
    <div class="container mt-4">
        <h2 class="text-center mb-4">Quiz Results</h2>

        <div v-if="score !== null" class="alert alert-info text-center">
            <h4>Your Score: {{ score }} / {{ questions.length }}</h4>
        </div>

        <div class="row">
            <div v-for="question in questions" :key="question.id" class="col-12 mb-3">
                <div class="card shadow-sm p-3">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-hashtag text-primary"></i> {{ question.id }} - 
                            {{ question.question_statement }}
                        </h5>

                        <ul class="list-group mt-3">
                            <li v-for="(option, index) in [question.option1, question.option2, question.option3, question.option4]" 
                                :key="index"
                                class="list-group-item"
                                :class="getOptionClass(question.id, index + 1)">
                                <strong v-if="correctAnswers[question.id] === index + 1" class="text-success">✔</strong>
                                {{ option }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        

            <router-link class="btn btn-success btn-sm" to="/scores">
                        <i class="fa-regular fa-star"></i> View all scores
            </router-link>
        </div>
    </div>`,

    data() {
        return {
            quizId: null,
            questions: [],
            correctAnswers: {},
            score: null
        };
    },

    mounted() {
        this.quizId = this.$route.params.quizId;
        this.loadQuizResults();
    },

    methods: {
        loadQuizResults() {
            fetch(`/api/quiz_result/${this.quizId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.questions = data.questions;
                this.correctAnswers = data.correct_answers;
                this.score = data.score;
            })
            .catch(error => { console.error("Error fetching quiz results:", error); });
        },

        getOptionClass(questionId, optionIndex) {
            return this.correctAnswers[questionId] === optionIndex ? "list-group-item-success" : "";
        }
    }
}
