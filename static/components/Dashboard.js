export default {
    template: `
    <div>
        <h1>Welcome, {{ userData?.name || "Loading..." }}</h1>
        <p>Email: {{ userData?.email }}</p>
        <p>Role: {{ userData?.role || "Loading..." }}</p>
        <p>DOB: {{ userData?.dob || "Loading..." }}</p>
        <p>Qualification: {{ userData?.qualification || "Loading..." }}</p>
        <p>Skills: {{ userData?.skills || "Loading..." }}</p>
        <router-link class="nav-link" to="/subjects">
            <i class="fa-duotone fa-solid fa-chart-bar"></i> Subjects
        </router-link>
    </div>
    `,
    data:function(){
        return {
            userData: null
        }
    },
    mounted() {
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
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load user data");
                }
                return response.json();
            })
            .then(data => {
                this.$root.message = null;
                this.userData = data;
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
        }
    }
};
