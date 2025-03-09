export default {
    template: `
   
    <div class="border mx-auto mt-5 p-3" style="width: 300px;">
        <div>
            <h2 class="text-center m-3">Login</h2>

            <div class="m-3">
                <label for="email" class="form-label">Email :</label>
                <input type="email" class="form-control" id="email" v-model="formData.email">
            </div>
            <div class="m-3">
                <label for="password" class="form-label">Password :</label>
                <input type="password" class="form-control" id="password" v-model="formData.password">
            </div>
            <div class="m-5 text-center">
                <button class="btn btn-primary" @click="loginUser">Login</button>
            </div>
        </div>
    </div>`,

    data() {
        return {
            formData: {
                email: "",
                password: ""
            }
        };
    },

    methods: {
        loginUser() {
            fetch('/api/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.formData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Response from backend:", data);

                    // Just set the message text, let AlertMessage.vue decide the color
                    this.$root.message = data.message || "Invalid login credentials";

                    // If login is successful, redirect
                    if (data.message.toLowerCase().includes("success")) {
                        if (data.role === "admin") {
                            this.$router.push('/Admin');
                        } else {
                            this.$router.push('/Dashboard');
                        }
                    }
                })
                .catch(() => {
                    this.$root.message = "An error occurred. Please try again.";
                });
        }
    }
};
