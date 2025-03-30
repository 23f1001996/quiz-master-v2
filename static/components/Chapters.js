export default {
    template: `
    <div class="container mt-5">
    <h1 class="text-center">Chapters of {{chapterData?.subject_name}} :</h1>

    <!-- Create Chapter Button -->
    <button v-if="userData?.role === 'admin'" class="btn btn-success btn-sm mb-3" @click="addChapter()">
    <i class="fa fa-plus"></i> Add Chapter
    </button>

    <!-- Chapters Table -->
    <div v-if="chapters?.length > 0" class="d-flex justify-content-center">
        <div class="table-responsive w-75 mx-auto">
            <table class="table table-bordered table-striped shadow-sm rounded">
                <thead class="table-info text-center">
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 35%;">Name</th>
                        <th style="width: 45%;">Description</th>
                        <th style="width: 15%;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(chapter, index) in chapters" :key="chapter.id">
                        <td class="text-center fw-bold">{{ index + 1 }}</td>
                        <td>{{ chapter.name }}</td>
                        <td>{{ chapter.description }}</td>
                        <td class="d-flex justify-content-center gap-1">
                            <button v-if="userData?.role === 'admin'" class="btn btn-warning btn-sm px-2 shadow-sm" @click="editChapter(chapter)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button v-if="userData?.role === 'admin'" class="btn btn-danger btn-sm px-2 shadow-sm" @click="confirmDelete(chapter.id)">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-primary btn-sm px-2 shadow-sm" @click="viewChapter(chapter.id)">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else class="alert alert-warning text-center m-5">
            No Chapters added yet.
        </div>

    <!-- Create Chapter Modal -->
    <div v-if="creatingChapter" class="modal d-block">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Create Chapter</h5>
                    <button type="button" class="btn-close" @click="cancelEdit"></button>
                </div>
                <div class="modal-body">
                    <label>Name:</label>
                    <input type="text" class="form-control" v-model="chapterData.name">
                    <label>Description:</label>
                    <textarea class="form-control" v-model="chapterData.description"></textarea>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                    <button class="btn btn-success" @click="createChapter">Create</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Chapter Modal -->
    <div v-if="editingChapter !== null" class="modal d-block">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Chapter</h5>
                    <button type="button" class="btn-close" @click="cancelEdit"></button>
                </div>
                <div class="modal-body">
                    <label>Name:</label>
                    <input type="text" class="form-control" v-model="chapterData.name">
                    <label>Description:</label>
                    <textarea class="form-control" v-model="chapterData.description"></textarea>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                    <button class="btn btn-success" @click="updateChapter">Update</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingChapter !== null" class="modal d-block">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Deletion</h5>
                    <button type="button" class="btn-close" @click="cancelDelete"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this chapter?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
                    <button class="btn btn-danger" @click="deleteChapter">Delete</button>
                </div>
            </div>
        </div>
    </div>
</div>

    `,

    data() {
        return {
            userData: null,
            chapters: [],
            chapterData: { name: '', description: '', subjectId: '', subject_name: ''},
            editingChapter: null,
            creatingChapter: false,
            deletingChapter: null
        };
    },

    mounted() {
        this.subjectId = this.$route.params.subjectId;
        this.loadUser();
        this.loadChapters();
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
        /** Fetch chapters */
        loadChapters() {
            const subjectId = this.$route.params.subjectId;
            fetch(`/api/chapters/get/${subjectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => { 
                this.chapters = data.chapters;
                this.chapterData.subject_name = data.subject_name;
                this.$root.message = data.message;
             })
            .catch(error => { console.error("Error loading chapters:", error); });
        },

        /** Create a chapter */
        createChapter() {
            this.chapterData.subjectId = this.subjectId,
            fetch(`/api/chapters/create/${this.subjectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(this.chapterData),
            })
            .then(response => response.json())
            .then((data) => {
                this.$root.message = data.message;
                this.loadChapters();
                this.cancelEdit();
            });
        },

        /** Prepare chapter for editing */
        editChapter(chapter) {
            this.editingChapter = chapter.id;
            this.chapterData = { ...chapter };
        },

        /** Open the create chapter modal */
        addChapter() {
            this.creatingChapter = true;
            this.chapterData = { name: '', description: '' };
        },

        /** Update a chapter */
        updateChapter() {
            fetch(`/api/chapters/update/${this.editingChapter}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(this.chapterData)
            })
            .then(response => response.json())
            .then((data) => {
                this.$root.message = data.message;
                this.loadChapters();
                this.cancelEdit();
            });
        },

        /** Open delete confirmation modal */
        confirmDelete(chapterId) {
            this.deletingChapter = chapterId;
        },

        /** Delete a chapter */
        deleteChapter() {
            fetch(`/api/chapters/delete/${this.deletingChapter}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token')
                }
            })
            .then(response => response.json())
            .then((data) => {
                this.$root.message = data.message;
                this.loadChapters();
                this.cancelDelete();
            });
        },

        /** View chapter details (Placeholder) */
        viewChapter(chapterId) {
            this.$router.push(`/quizzes/${chapterId}`);
        },

        /** Cancel editing */
        cancelEdit() {
            this.editingChapter = null;
            this.creatingChapter = false;
            this.chapterData = { name: '', decription: '' };
        },

        /** Cancel delete modal */
        cancelDelete() {
            this.deletingChapter = null;
        }
    }
};
