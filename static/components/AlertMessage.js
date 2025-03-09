export default {
    props: ['message'],
    template: `
    <div v-if="message" class="alert" :class="alertClass">
        {{ message }}
        <button type="button" class="btn-close float-end" @click="clearMessage"></button>
    </div>
    `,
    computed: {
        alertClass() {
            return this.message.toLowerCase().includes("success") ? "alert-success" : "alert-danger";
        }
    },
    methods: {
        clearMessage() {
            this.$root.message = null; // Clear message globally
        }
    }
};
