export default{
    template:`
    <div class="d-flex justify-content-center align-items-center vh-80 mt-5">
    <div class="text-center border p-4 rounded shadow">
        Are you sure?
        <div class="mt-3">
            <button class="btn btn-danger" @click="logoutUser">Logout</button>
            <button class="btn btn-secondary" @click="cancelLogout">Naaaaaaa</button>
        </div>
    </div>
</div>


    `,
    methods:{
        logoutUser(){
            fetch('/api/logout',{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            }).then(response => response.json())
            .then(data=>{
                localStorage.removeItem("auth_token")
                this.$root.message = data.message;
                this.$router.push('/')
            })
        },
        cancelLogout() {
            this.$router.go(-1); // Go back to the previous page
        }
    }
}