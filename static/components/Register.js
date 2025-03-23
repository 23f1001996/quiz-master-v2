export default {
    template: `
    <div class="border mx-auto mt-4 p-3" style="width: 400px;">
    <h2 class="text-center mb-3">Register</h2>

    <div class="row">
        <div class="col-12 mb-2">
            <label for="name" class="form-label">Name:</label>
            <input type="text" class="form-control" id="name" v-model="formData.name">
        </div>

        <div class="col-12 mb-2">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" id="email" v-model="formData.email">
        </div>

        <div class="col-12 mb-2">
            <label for="password" class="form-label">Password:</label>
            <input type="password" class="form-control" id="password" v-model="formData.password" required>
        </div>

        <div class="col-6 mb-2">
            <label for="qualification" class="form-label">Qualification:</label>
            <input type="text" class="form-control" id="qualification" v-model="formData.qualification" required>
        </div>

        <div class="col-6 mb-2">
            <label for="skills" class="form-label">Skills:</label>
            <input type="text" class="form-control" id="skills" v-model="formData.skills" required>
        </div>

        <div class="col-12 mb-3">
            <label for="dob" class="form-label">DOB:</label>
            <input type="date" class="form-control" id="dob" v-model="formData.dob" required>
        </div>
    </div>

    <div class="text-center mt-2">
        <button class="btn btn-primary" @click="addUser">Register</button>
    </div>
</div>

    `,
    data: function() {
        return {
            formData:{
                email: "",
                password: "",
                name: "",
                qualification: "",
                skills: "",
                dob: ""
            } 
        }
    },
    methods:{
        addUser: function(){
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(this.formData) // the content goes to backend as JSON string
            })
            .then(response => response.json())
            .then(data => {
                this.$root.message = data.message
                if (response.ok) {
                    this.$router.push('/login');  // Redirect only if registration is successful
                }
            })

        }
    }
}