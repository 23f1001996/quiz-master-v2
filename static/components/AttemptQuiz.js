export default {
    template: `
    <div v-if="questions.length > 0" class="container mt-4">
        <h2 class="text-center mb-4">Quiz Questions</h2>

        <!-- Timer -->
        <div class="alert alert-warning text-center">
            Time Left: {{ formattedTime }}
        </div>

        <!-- Quiz Form -->
        <form @submit.prevent="submitQuiz">
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
                                    class="list-group-item">
                                    <input type="radio" 
                                        :name="'question_' + question.id" 
                                        :value="index + 1" 
                                        v-model="selectedAnswers[question.id]">
                                    {{ option }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-success mt-3" :disabled="isSubmitted || Object.keys(selectedAnswers).length === 0">
                <div v-if="isSubmitted" class="spinner-border  text-center" role="status">
                <span class="visually-hidden">Submitting...</span>
                </div>
                <span v-else>Submit Quiz</span>
            </button>
        
        </form>
    </div>`,

    data() {
        return {
            quizId: null,
            userData: null,
            questions: [],
            selectedAnswers: {},
            isSubmitted: false,
            timeLeft: 0, // Time in seconds
            timerInterval: null, // Store the timer interval
        };
    },

    computed: {
        formattedTime() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
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
            .then(data => { 
                this.userData = data;
            })
            .catch(error => { 
                console.error("Error fetching user data:", error);
                this.$root.message = "Failed to load user data.";
            });
        },

        loadQuestions() {
            fetch(`/api/questions/get/${this.quizId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch questions.");
                }
                return response.json();
            })
            .then(data => {
                this.questions = data.questions;
                this.startTimer(data.quiz.time_duration);
            })
            .catch(error => { 
                console.error("Error fetching questions:", error);
                this.$root.message = "Could not load quiz questions.";
            });
        },

        startTimer(timeString) {
            if (!timeString) return;
            const [hh, mm] = timeString.split(":").map(Number);
            this.timeLeft = (hh * 3600) + (mm * 60);

            this.timerInterval = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                } else {
                    clearInterval(this.timerInterval);
                    this.submitQuiz(); // Auto-submit when time runs out
                }
            }, 1000);
        },

        submitQuiz() {
            if (Object.keys(this.selectedAnswers).length === 0) {
                this.$root.message = "Please answer at least one question before submitting.";
                return;
            }

            this.isSubmitted = true;
            clearInterval(this.timerInterval); // Stop the timer

            const submissionData = {
                quiz_id: this.quizId,
                answers: this.selectedAnswers
            };

            fetch(`/api/submit_quiz/${this.quizId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(submissionData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.score !== undefined) {
                    this.$root.message = data.message;
                    setTimeout(() => this.$router.push(`/result/${this.quizId}`), 1000);
                } else {
                    throw new Error("Invalid response from server.");
                }
            })
            .catch(error => {
                console.error("Error submitting quiz:", error);
                this.$root.message = "An error occurred while submitting the quiz.";
                this.isSubmitted = false;
            });
        }
    },

    beforeDestroy() {
        clearInterval(this.timerInterval); // Clean up timer on component destruction
    }
};
