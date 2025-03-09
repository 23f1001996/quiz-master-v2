export default {
    template: `
    <h1>Hello user {{ userData.name || 'Loading...' }}</h1>

    
    `,
    data() {
        return {
            userData: {}
        }
    },
    mounted(){
        this.loadUser();
    },
    
    methods: {
        loadUser() {
            fetch('/api/home', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => response.json())
                .then(data => this.userData = data);
        }
    }
}