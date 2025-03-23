export default {
    template: `
    <div class="container mt-4">
        <!-- Download CSV Button -->
        <div class="row border">
            <div class="text-end my-2">
                <button @click="csvExport" class="btn btn-secondary">Download CSV</button>
            </div>
        </div>

        <!-- Title -->
        <h2 class="text-center mb-4">Quiz Scores</h2>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Quiz Scores Table -->
        <div v-else-if="scores.length > 0">
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>Quiz ID</th>
                        <th>Chapter</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Date & Time (IST)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="score in scores" :key="score.quiz">
                        <td>{{ score.quiz }}</td>
                        <td>{{ score.chapter_name }}</td>
                        <td>{{ score.subject_name }}</td>
                        <td>{{ score.score }}</td>
                        <td>{{ formatTimestamp(score.timestamp) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Scores Message -->
        <div v-else class="alert alert-warning text-center">
            No scores found. Attempt quizzes to view scores.
        </div>
    </div>

    `,

    data() {
        return {
            scores: [],
            loading: true,
        };
    },

    mounted() {
        this.fetchScores();
        this.loadUser();
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
        fetchScores() {
            fetch("http://127.0.0.1:5000/api/scores/get/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.scores) {
                    this.scores = data.scores;
                }
            })
            .catch(error => {
                console.error("Error fetching scores:", error);
            })
            .finally(() => {
                this.loading = false;
            });
        },

        formatTimestamp(timestamp) {
            return new Date(timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        },
        csvExport(){
            fetch('/api/export')
            .then(response => response.json())
            .then(data => {
                window.location.href = `/api/csv_result/${data.id}`
            })
        }
    }
};
