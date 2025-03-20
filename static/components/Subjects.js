export default {
    template: `
    <div class="container mt-5">

        <button v-if="userData?.role === 'admin'" class="btn btn-success btn-sm" @click="addSubject()">
            <i class="fas fa-plus"></i> Add Subject
        </button>

        <!-- Create Subject Modal -->
        <div v-if="creatingSubject" class="modal d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create Subject</h5>
                        <button type="button" class="btn-close" @click="cancelEdit"></button>
                    </div>
                    <div class="modal-body">
                        <label>Name:</label>
                        <input type="text" class="form-control" v-model="subjectData.name">
                        <label>Description:</label>
                        <input type="text" class="form-control" v-model="subjectData.description">
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                        <button class="btn btn-success" @click="createSubject">Create</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Subjects List -->
        <div v-if="subjects.length > 0" class="mb-5">
    <h2 class="text-center mb-4">Subjects:</h2>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" v-for="subject in subjects" :key="subject.id">
            <div class="card shadow-lg border rounded-4 h-100" 
                 style="min-height: 380px;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-dark fw-bold">
                        <i class="fas fa-book text-primary"></i> {{ subject.name }}
                    </h5>
                    <p class="card-text text-muted flex-grow-1">{{ subject.description }}</p>

                    <div class="mt-auto d-flex justify-content-between">
                        <button v-if="userData?.role === 'admin'" class="btn btn-warning btn-sm shadow-sm px-3" @click="editSubject(subject)">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button v-if="userData?.role === 'admin'" class="btn btn-danger btn-sm shadow-sm px-3" @click="confirmDelete(subject.id)">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button class="btn btn-primary btn-sm shadow-sm px-3" @click="viewSubject(subject.id)">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


        <!-- Edit Subject Modal -->
        <div v-if="editingSubject !== null" class="modal d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Subject</h5>
                        <button type="button" class="btn-close" @click="cancelEdit"></button>
                    </div>
                    <div class="modal-body">
                        <label>Name:</label>
                        <input type="text" class="form-control" v-model="subjectData.name">
                        <label>Description:</label>
                        <input type="text" class="form-control" v-model="subjectData.description">
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                        <button class="btn btn-success" @click="updateSubject">Update</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="deletingSubject !== null" class="modal d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Deletion</h5>
                        <button type="button" class="btn-close" @click="cancelDelete"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete this subject?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
                        <button class="btn btn-danger" @click="deleteSubject">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            userData: null,
            subjects: [],
            subjectData: { name: '', description: '' },
            editingSubject: null,
            creatingSubject: false,
            deletingSubject: null
        };
    },

    mounted() {
        this.loadUser();
        this.loadSubjects();
    },

    methods: {
        /** Fetch user data */
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

        /** Fetch subjects */
        loadSubjects() {
            fetch('/api/subjects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => { 
                this.subjects = data;
                this.$root.message = data.message;
             })
            .catch(error => { console.error("Error loading subjects:", error); });
        },

        /** Create a subject */
        createSubject() {
            fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(this.subjectData),
            })
            .then(response => response.json())
            .then(data => {
                this.$root.message = data.message;
                this.loadSubjects();
                this.cancelEdit();  // Properly close modal
            });
        },

        /** Prepare subject for editing */
        editSubject(subject) {
            this.editingSubject = subject.id;
            this.subjectData = { ...subject };
        },

        /** Open the create subject modal */
        addSubject() {
            this.creatingSubject = true;
            this.subjectData = { name: '', description: '' };
        },

        /** Update a subject */
        updateSubject() {
            if (!this.editingSubject) return;
            
            fetch(`/api/subjects/${this.editingSubject}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(this.subjectData)
            })
            .then(response => response.json())
            .then(data => {
                this.$root.message = data.message;
                this.loadSubjects();
                this.cancelEdit();  // Close modal
            })
            .catch(error => { console.error("Error updating subject:", error); });
        },

        /** Open delete confirmation modal */
        confirmDelete(subjectId) {
            this.deletingSubject = subjectId;
        },

        /** Delete a subject */
        deleteSubject() {
            if (!this.deletingSubject) return;

            fetch(`/api/subjects/${this.deletingSubject}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                }
            })
            .then(response => response.json())
            .then(data => {
                this.$root.message = data.message;
                this.loadSubjects();
                this.cancelDelete();  // Close modal
            })
            .catch(error => { console.error("Error deleting subject:", error); });
        },

        /** View subject details (Placeholder) */
        viewSubject(subjectId) {
            this.$router.push(`/chapters/${subjectId}`);
        },

        /** Cancel editing */
        cancelEdit() {
            this.editingSubject = null;
            this.creatingSubject = false;
            this.subjectData = { name: '', description: '' };
        },

        /** Cancel delete modal */
        cancelDelete() {
            this.deletingSubject = null;
        }
    }
};
