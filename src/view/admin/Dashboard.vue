<template>
  <section class="admin-dashboard">
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <div v-else class="dashboard-container">
      <div class="dashboard-header">
        <div class="container">
          <div class="row align-items-center">
            <div class="col">
              <h1 class="dashboard-title">
                <i class="fa fa-dashboard me-3"></i>Pannello di Amministrazione
              </h1>
              <p class="dashboard-subtitle">Gestione Contenuti - Missionari della Via</p>
            </div>
            <div class="col-auto d-flex gap-2">
              <router-link to="/" class="btn-custom btn-outline">
                <i class="fa fa-home me-2"></i>Torna al Sito
              </router-link>
              <button @click="handleLogout" class="btn-custom btn-logout">
                <i class="fa fa-sign-out me-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="action-bar">
                <button class="btn-custom btn-primary" @click="createNewGroup">
                  <i class="fa fa-plus-circle me-2"></i>Aggiungi Nuovo Gruppo Attività
                </button>
              </div>

              <div v-if="attivitaData.groups.length === 0" class="alert alert-info text-center">
                <i class="fa fa-info-circle me-2"></i>
                Nessun gruppo presente. Inizia creando il primo gruppo di attività!
              </div>

              <div v-for="(group, groupIndex) in attivitaData.groups" :key="groupIndex" class="group-card">
                <div class="group-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h5 class="mb-0">
                        <i class="fa fa-folder-open me-2"></i>{{ group.title || 'Nuovo Gruppo' }}
                      </h5>
                      <small class="text-muted">Key: {{ group.key }} | Sezioni: {{ group.sections?.length || 0 }}</small>
                    </div>
                    <div class="col-auto">
                      <button class="btn-delete" @click="deleteGroup(groupIndex)">
                        <i class="fa fa-trash me-1"></i>Elimina
                      </button>
                    </div>
                  </div>
                </div>

                <div class="group-body">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Titolo</label>
                      <input type="text" class="form-control" v-model="group.title">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Key (identificatore unico)</label>
                      <input type="text" class="form-control" v-model="group.key" readonly>
                      <small class="text-muted">La chiave non può essere modificata dopo la creazione</small>
                    </div>
                  </div>

                  <!-- Gestione Immagini del Gruppo -->
                  <div class="group-images-section mb-4">
                    <div class="section-label-modern">
                      <i class="fa fa-images me-2"></i>
                      <span>Immagini del Gruppo</span>
                      <small class="text-muted ms-2">(condivise da tutte le sezioni)</small>
                    </div>

                    <div v-if="getGroupImageFilenames(group).length > 0" class="images-grid mb-3">
                      <div v-for="(filename, imgIndex) in getGroupImageFilenames(group)" :key="imgIndex" class="image-card-modern">
                        <div class="image-wrapper-modern">
                          <img
                            :src="getImageUrlFromFilename(filename, groupIndex)"
                            :alt="filename"
                            @click="openImagePreview(getImageUrlFromFilename(filename, groupIndex))"
                            class="clickable-image"
                            title="Clicca per ingrandire">
                          <button class="remove-btn-modern" @click.stop="removeImageFromGroup(groupIndex, imgIndex)" title="Rimuovi immagine">
                            <i class="fa fa-times"></i>
                          </button>
                          <div class="image-number-badge">{{ imgIndex + 1 }}</div>
                        </div>
                        <p class="image-filename">{{ filename }}</p>
                      </div>
                    </div>

                    <div v-else class="no-images-placeholder">
                      <i class="fa fa-image placeholder-icon"></i>
                      <p class="placeholder-text">Nessuna immagine caricata</p>
                    </div>

                    <button class="btn-add-image-modern" @click="openImageSelector(groupIndex)">
                      <i class="fa fa-plus-circle me-2"></i>
                      {{ getGroupImageFilenames(group).length > 0 ? 'Aggiungi Altra Immagine' : 'Carica Prima Immagine' }}
                    </button>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h6 class="mb-0">
                      <i class="fa fa-list me-2"></i>Sezioni ({{ group.sections?.length || 0 }})
                    </h6>
                    <button class="btn-custom btn-sm btn-primary" @click="addSection(groupIndex)">
                      <i class="fa fa-plus-circle me-1"></i>Aggiungi Sezione
                    </button>
                  </div>

                  <div v-for="(section, sectionIndex) in group.sections" :key="sectionIndex" class="section-card">
                    <div class="section-header-row">
                      <h6 class="mb-0">
                        <i class="fa fa-file-text me-2"></i>Sezione {{ sectionIndex + 1 }}
                      </h6>
                      <button class="btn-delete btn-sm" @click="deleteSection(groupIndex, sectionIndex)">
                        <i class="fa fa-trash me-1"></i>Elimina
                      </button>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Titolo Sezione (opzionale)</label>
                      <input type="text" class="form-control" v-model="section.title">
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-bold">
                        <i class="fa fa-align-left me-2"></i>Articoli (supporta Markdown)
                      </label>
                      <div v-for="(article, articleIndex) in section.articles" :key="articleIndex" class="input-group mb-2">
                        <textarea
                          class="form-control"
                          rows="3"
                          v-model="section.articles[articleIndex]"
                          placeholder="Scrivi qui... (supporta **grassetto**, *corsivo*, ecc.)"
                        ></textarea>
                        <button class="btn-delete" @click="deleteArticle(groupIndex, sectionIndex, articleIndex)">
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                      <button class="btn-custom btn-secondary btn-sm" @click="addArticle(groupIndex, sectionIndex)">
                        <i class="fa fa-plus-circle me-1"></i>Aggiungi Articolo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pulsante Salva Modifiche in fondo -->
              <div v-if="attivitaData.groups.length > 0" class="save-section">
                <button class="btn-save-changes" @click="saveChanges" :disabled="isSaving">
                  <span v-if="isSaving">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Salvataggio in corso...
                  </span>
                  <span v-else>
                    <i class="fa fa-save me-2"></i>Salva Tutte le Modifiche
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showImageModal" class="modal-overlay" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header-custom">
          <h5 class="mb-0">
            <i class="fa fa-images me-2"></i>Gestione Immagini
          </h5>
          <button class="btn-close-custom" @click="closeImageModal">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="upload-section-modern">
            <div class="upload-icon-container">
              <i class="fa fa-cloud-upload upload-icon"></i>
            </div>
            <h5 class="upload-title">Carica Nuova Immagine</h5>
            <p class="upload-subtitle">L'immagine verrà aggiunta automaticamente al gruppo</p>

            <div class="file-input-wrapper">
              <input type="file" class="form-control file-input-modern" id="fileUpload" accept="image/*" @change="handleImageUpload" ref="fileInput">
              <label for="fileUpload" class="file-input-label">
                <i class="fa fa-plus-circle me-2"></i>Scegli File
              </label>
            </div>

            <div class="upload-info">
              <small class="text-muted">
                <i class="fa fa-info-circle me-1"></i>
                Formati: JPG, PNG, GIF, WebP · Massimo 5MB
              </small>
            </div>

            <div v-if="uploadingImage" class="upload-progress">
              <div class="spinner-border text-primary mb-3"></div>
              <p class="upload-progress-text">Caricamento in corso...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale Preview Immagine -->
    <div v-if="imagePreview.show" class="modal-overlay image-preview-overlay" @click="closeImagePreview">
      <div class="image-preview-content" @click.stop>
        <button class="btn-close-preview" @click="closeImagePreview" title="Chiudi">
          <i class="fa fa-times"></i>
        </button>
        <img :src="imagePreview.url" class="preview-image" alt="Anteprima immagine">
      </div>
    </div>

    <!-- Modale Conferma Custom -->
    <div v-if="confirmModal.show" class="modal-overlay confirm-modal-overlay" @click="closeConfirmModal">
      <div class="confirm-modal-content" @click.stop>
        <div class="confirm-modal-header">
          <i class="fa fa-exclamation-triangle confirm-icon"></i>
          <h4 class="confirm-title">{{ confirmModal.title }}</h4>
        </div>
        <div class="confirm-modal-body">
          <p class="confirm-message" v-html="confirmModal.message"></p>
        </div>
        <div class="confirm-modal-footer">
          <button class="btn-confirm-cancel" @click="closeConfirmModal">
            <i class="fa fa-times me-2"></i>Annulla
          </button>
          <button class="btn-confirm-yes" @click="handleConfirmAction">
            <i class="fa fa-check me-2"></i>Sì, Conferma
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { attivitaImageService, attivitaDataService } from '@/services/attivitaApi';

export default {
  name: "DashboardPage",
  data() {
    return {
      isLoading: false,
      isSaving: false,
      uploadingImage: false,
      toast: {
        val: false,
        message: '',
        type: 'danger'
      },
      attivitaData: {
        header: {
          backgroundImage: 'attivita.jpg',
          title: 'Activities and missions'
        },
        main: {
          caption: ''
        },
        groups: []
      },
      // IMPORTANTE: groupImages NON viene salvato in Firebase
      // Contiene solo immagini caricate dall'API: { 'key': ['img1.jpg', 'img2.jpg'], ... }
      groupImages: {},
      showImageModal: false,
      imagePreview: {
        show: false,
        url: ''
      },
      confirmModal: {
        show: false,
        title: '',
        message: '',
        onConfirm: null
      },
      currentSelection: {
        groupIndex: null,
        key: null
      }
    }
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        const lang = localStorage.getItem('lang') || 'it';
        this.attivitaData = await attivitaDataService.getAttivita(lang);

        if (!this.attivitaData) {
          this.attivitaData = {
            header: { backgroundImage: 'attivita.jpg', title: 'Attività e missioni' },
            main: { caption: 'Gestisci le attività della comunità' },
            groups: []
          };
        }

        if (!this.attivitaData.groups) {
          this.attivitaData.groups = [];
        }

        // Carica le immagini dall'API per ogni gruppo
        // IMPORTANTE: Le immagini vengono salvate in groupImages (NON in Firebase)
        this.groupImages = {};
        for (let group of this.attivitaData.groups) {
          if (group.key) {
            try {
              const response = await attivitaImageService.listImages(group.key);
              if (response.success && response.images) {
                // Salva in groupImages (separato da Firebase)
                this.groupImages[group.key] = response.images.map(img => img.filename);
              } else {
                this.groupImages[group.key] = [];
              }
            } catch (error) {
              console.error(`Errore caricamento immagini per key ${group.key}:`, error);
              this.groupImages[group.key] = [];
            }
          }
        }

      } catch (error) {
        console.error('Errore caricamento dati:', error);
        this.showToast('Errore caricamento dati');
        this.attivitaData = {
          header: { backgroundImage: 'attivita.jpg', title: 'Attività' },
          main: { caption: '' },
          groups: []
        };
      }
      this.isLoading = false;
    },

    createNewGroup() {
      const newKey = 'new-group-' + Date.now();
      this.attivitaData.groups.push({
        key: newKey,
        title: 'Nuovo Gruppo',
        sections: []
      });
      // Inizializza groupImages per questo nuovo gruppo
      this.groupImages[newKey] = [];
    },

    async deleteGroup(groupIndex) {
      const group = this.attivitaData.groups[groupIndex];
      const groupName = group.title || 'questo gruppo';
      // Leggi da groupImages (API) invece che da Firebase
      const groupImageList = this.groupImages[group.key] || [];
      const imageCount = groupImageList.length;

      this.showConfirmModal(
        'Elimina Gruppo',
        `Sei sicuro di voler eliminare <strong>"${groupName}"</strong>?<br><br>
        <strong>ATTENZIONE:</strong> Verranno eliminate anche tutte le immagini associate a questo gruppo
        (<strong>${imageCount} ${imageCount === 1 ? 'immagine' : 'immagini'}</strong>).<br><br>
        Questa azione è irreversibile e sarà eseguita immediatamente.`,
        async () => {
          // Elimina tutte le immagini associate dal server
          if (group.key && groupImageList.length > 0) {
            this.isLoading = true;
            try {
              console.log(`Eliminazione di ${groupImageList.length} immagini per il gruppo ${group.key}...`);

              for (const filename of groupImageList) {
                try {
                  await attivitaImageService.deleteImage(filename, group.key);
                  console.log(`Immagine ${filename} eliminata`);
                } catch (error) {
                  console.error(`Errore eliminazione immagine ${filename}:`, error);
                }
              }
            } catch (error) {
              console.error('Errore durante l\'eliminazione delle immagini:', error);
            } finally {
              this.isLoading = false;
            }
          }

          // Rimuovi da groupImages
          delete this.groupImages[group.key];

          // Elimina il gruppo dall'array
          this.attivitaData.groups.splice(groupIndex, 1);

          // Salva immediatamente su Firebase (senza imageFilenames)
          const lang = localStorage.getItem('lang') || 'it';
          await attivitaDataService.saveAttivita(this.attivitaData, lang);

          this.showToast('Gruppo e immagini eliminati con successo!', true);
        }
      );
    },

    addSection(groupIndex) {
      if (!this.attivitaData.groups[groupIndex].sections) {
        this.attivitaData.groups[groupIndex].sections = [];
      }
      this.attivitaData.groups[groupIndex].sections.push({
        title: '',
        articles: ['']
      });
    },

    deleteSection(groupIndex, sectionIndex) {
      const section = this.attivitaData.groups[groupIndex].sections[sectionIndex];
      const articleCount = section.articles?.length || 0;

      this.showConfirmModal(
        'Elimina Sezione',
        `Sei sicuro di voler eliminare questa sezione?<br><br>Tutti gli articoli contenuti (<strong>${articleCount} ${articleCount === 1 ? 'articolo' : 'articoli'}</strong>) saranno eliminati.<br><br>Ricorda di salvare le modifiche.`,
        () => {
          this.attivitaData.groups[groupIndex].sections.splice(sectionIndex, 1);
          this.showToast('Sezione eliminata. Ricorda di salvare le modifiche!', true);
        }
      );
    },

    addArticle(groupIndex, sectionIndex) {
      this.attivitaData.groups[groupIndex].sections[sectionIndex].articles.push('');
    },

    deleteArticle(groupIndex, sectionIndex, articleIndex) {
      this.showConfirmModal(
        'Elimina Articolo',
        'Sei sicuro di voler eliminare questo articolo?<br><br>Ricorda di salvare le modifiche.',
        () => {
          this.attivitaData.groups[groupIndex].sections[sectionIndex].articles.splice(articleIndex, 1);
          this.showToast('Articolo eliminato. Ricorda di salvare le modifiche!', true);
        }
      );
    },

    async openImageSelector(groupIndex) {
      const group = this.attivitaData.groups[groupIndex];
      if (!group || !group.key) {
        this.showToast('Errore: gruppo senza chiave valida');
        return;
      }
      this.currentSelection = { groupIndex, key: group.key };
      this.showImageModal = true;
    },

    closeImageModal() {
      this.showImageModal = false;
      this.currentSelection = { groupIndex: null, key: null };
    },

    getGroupImageFilenames(group) {
      // Leggi da groupImages (API) invece che da Firebase
      if (!group.key) return [];
      const images = this.groupImages[group.key];
      if (!images) return [];
      if (Array.isArray(images)) return images;
      if (typeof images === 'string') return [images];
      return [];
    },

    getImageUrlFromFilename(filename, groupIndex) {
      const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://www.missionaridellavia.net/api/v1';
      const group = this.attivitaData.groups[groupIndex];
      const key = group ? group.key : '';
      return `${API_BASE_URL}/images.php?key=${encodeURIComponent(key)}&filename=${encodeURIComponent(filename)}`;
    },

    removeImageFromGroup(groupIndex, imgIndex) {
      const group = this.attivitaData.groups[groupIndex];
      const groupImageList = this.groupImages[group.key] || [];
      const filename = groupImageList[imgIndex];

      this.showConfirmModal(
        'Elimina Immagine',
        `Sei sicuro di voler eliminare questa immagine?<br><br><strong>${filename}</strong><br><br>L'immagine verrà eliminata immediatamente e permanentemente dal server.`,
        async () => {
          this.isLoading = true;
          try {
            // Elimina l'immagine dal server (API)
            await attivitaImageService.deleteImage(filename, group.key);
            console.log(`Immagine ${filename} eliminata dal server`);

            // Ricarica le immagini dall'API per aggiornare la lista
            const response = await attivitaImageService.listImages(group.key);
            if (response.success && response.images) {
              this.groupImages[group.key] = response.images.map(img => img.filename);
            } else {
              this.groupImages[group.key] = [];
            }

            // IMPORTANTE: NON salviamo su Firebase - le immagini sono gestite solo dall'API
            this.showToast('Immagine eliminata con successo dal server!', true);
          } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
            this.showToast('Errore durante l\'eliminazione dell\'immagine');
          } finally {
            this.isLoading = false;
          }
        }
      );
    },

    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const { groupIndex, key } = this.currentSelection;
      if (!key || groupIndex === null) {
        this.showToast('Errore: gruppo non specificato');
        return;
      }

      this.uploadingImage = true;

      try {
        // Upload dell'immagine all'API
        const response = await attivitaImageService.uploadImage(file, key);

        if (response.success && response.filename) {
          // Ricarica le immagini dall'API per aggiornare la lista
          const listResponse = await attivitaImageService.listImages(key);
          if (listResponse.success && listResponse.images) {
            this.groupImages[key] = listResponse.images.map(img => img.filename);
          } else {
            this.groupImages[key] = [];
          }

          // IMPORTANTE: NON salviamo su Firebase - le immagini sono gestite solo dall'API
          this.showToast('Immagine caricata con successo!', true);
          this.closeImageModal();
        } else {
          throw new Error('Risposta API non valida');
        }
      } catch (error) {
        console.error('Errore upload:', error);
        this.showToast('Errore upload immagine');
      } finally {
        this.uploadingImage = false;
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      }
    },

    async saveChanges() {
      this.isSaving = true;
      try {
        const lang = localStorage.getItem('lang') || 'it';
        await attivitaDataService.saveAttivita(this.attivitaData, lang);
        this.showToast('Modifiche salvate con successo', true);
      } catch (error) {
        console.error('Errore salvataggio:', error);
        this.showToast('Errore salvataggio: ' + error.message);
      }
      this.isSaving = false;
    },

    showConfirmModal(title, message, onConfirm) {
      this.confirmModal = {
        show: true,
        title,
        message,
        onConfirm
      };
    },

    closeConfirmModal() {
      this.confirmModal = {
        show: false,
        title: '',
        message: '',
        onConfirm: null
      };
    },

    async handleConfirmAction() {
      if (this.confirmModal.onConfirm) {
        await this.confirmModal.onConfirm();
      }
      this.closeConfirmModal();
    },

    openImagePreview(url) {
      this.imagePreview.url = url;
      this.imagePreview.show = true;
    },

    closeImagePreview() {
      this.imagePreview.show = false;
      this.imagePreview.url = '';
    },

    async handleLogout() {
      try {
        await this.$store.dispatch('logout');
        this.$router.push('/');
      } catch (error) {
        console.error('Errore logout:', error);
      }
    },

    showToast(message, isSuccess = false) {
      this.toast.val = true;
      this.toast.message = message;
      this.toast.type = isSuccess ? 'success' : 'danger';

      setTimeout(() => {
        this.toast.val = false;
      }, isSuccess ? 1500 : 3000);
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-header {
  background: #3d331b;
  padding: 2rem 0;
  box-shadow: 0 4px 20px rgba(40, 29, 2, 0.2);
}

.text-muted {
  color: #af9f7c !important;
}

.dashboard-title {
  font-family: 'Bubbler One', sans-serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: white;
  margin: 0;
}

.dashboard-subtitle {
  font-family: 'Old Standard TT', serif;
  color: #c3ac7d;
  margin: 0;
  font-size: 1.1rem;
  font-style: italic;
}

.dashboard-body {
  padding: 2rem 0;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #281d02;
  margin-bottom: 0.5rem;
}

.section-description {
  font-family: 'Old Standard TT', serif;
  color: #63543f;
  font-size: 1rem;
  margin: 0;
}

.action-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* Sezione Salva Modifiche in fondo */
.save-section {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 12px;
  border: 2px solid #c3ac7d;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-save-changes {
  font-family: 'Playfair Display', serif;
  padding: 1.25rem 3rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  min-width: 300px;
}

.btn-save-changes:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
  background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
}

.btn-save-changes:disabled {
  background: #6c757d;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-custom {
  font-family: 'Playfair Display', serif;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #8c681c;
  color: white;
}

.btn-primary:hover {
  background: #a07b22;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
  color: white;
}

.btn-success:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #63543f;
  color: white;
}

.btn-secondary:hover {
  background: #7a6a53;
  color: white;
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid #c3ac7d;
}

.btn-outline:hover {
  background: rgba(195, 172, 125, 0.2);
  border-color: white;
  color: white;
  text-decoration: none;
}

.btn-logout {
  background: transparent;
  color: white;
  border: 2px solid #dc3545;
}

.btn-logout:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
  text-decoration: none;
}

.btn-delete {
  background: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

.group-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.group-header {
  background: #8c681c;
  padding: 1.5rem;
  color: white;
}

.group-header h5 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: white;
}

.group-body {
  padding: 2rem;
}

.section-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #dee2e6;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;
}

.section-header-row h6 {
  font-family: 'Playfair Display', serif;
  color: #281d02;
  font-size: 1.2rem;
}

.form-label {
  font-family: 'Old Standard TT', serif;
  color: #281d02;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-control {
  border: 1px solid #c3ac7d;
  border-radius: 6px;
  padding: 0.75rem;
  font-family: 'Old Standard TT', serif;
}

.form-control:focus {
  border-color: #8c681c;
  box-shadow: 0 0 0 0.2rem rgba(140, 104, 28, 0.25);
}

.image-carousel-preview {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.carousel-image-item {
  position: relative;
  width: 120px;
}

.carousel-image-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-index {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header-custom {
  background: #281d02;
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header-custom h5 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin: 0;
}

.btn-close-custom {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-custom:hover {
  color: #c3ac7d;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
}

/* Upload Section Moderna */
.upload-section-modern {
  text-align: center;
  padding: 3rem 2rem;
}

.upload-icon-container {
  margin-bottom: 1.5rem;
}

.upload-icon {
  font-size: 4rem;
  color: #8c681c;
  opacity: 0.7;
}

.upload-title {
  font-family: 'Playfair Display', serif;
  color: #281d02;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.upload-subtitle {
  font-family: 'Old Standard TT', serif;
  color: #63543f;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.file-input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.file-input-modern {
  opacity: 0;
  position: absolute;
  z-index: -1;
}

.file-input-label {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #8c681c 0%, #a07b22 100%);
  color: white;
  border-radius: 50px;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(140, 104, 28, 0.3);
}

.file-input-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(140, 104, 28, 0.4);
  background: linear-gradient(135deg, #a07b22 0%, #8c681c 100%);
}

.file-input-label:active {
  transform: translateY(0);
}

.upload-info {
  margin-top: 1rem;
}

.upload-progress {
  margin-top: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.upload-progress-text {
  font-family: 'Old Standard TT', serif;
  color: #63543f;
  font-size: 1rem;
  margin: 0;
}

/* Sezione Immagini del Gruppo - Moderna */
.group-images-section {
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-label-modern {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #281d02;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #c3ac7d;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.image-card-modern {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(140, 104, 28, 0.2);
}

.image-wrapper-modern {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f8f9fa;
}

.image-wrapper-modern img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-card-modern:hover .image-wrapper-modern img {
  transform: scale(1.05);
}

.remove-btn-modern {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(220, 53, 69, 0.95);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.image-card-modern:hover .remove-btn-modern {
  opacity: 1;
}

.remove-btn-modern:hover {
  background: #dc3545;
  transform: scale(1.1);
}

.image-number-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(40, 29, 2, 0.85);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Playfair Display', serif;
}

.image-filename {
  padding: 0.75rem;
  font-family: 'Old Standard TT', serif;
  font-size: 0.875rem;
  color: #63543f;
  margin: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-images-placeholder {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  border: 2px dashed #c3ac7d;
  margin-bottom: 1.5rem;
}

.placeholder-icon {
  font-size: 3rem;
  color: #c3ac7d;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.placeholder-text {
  font-family: 'Old Standard TT', serif;
  color: #63543f;
  font-size: 1rem;
  margin: 0;
}

.btn-add-image-modern {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #8c681c 0%, #a07b22 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(140, 104, 28, 0.3);
}

.btn-add-image-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(140, 104, 28, 0.4);
  background: linear-gradient(135deg, #a07b22 0%, #8c681c 100%);
}

/* Immagine Cliccabile */
.clickable-image {
  cursor: pointer;
}

/* Modale Preview Immagine */
.image-preview-overlay {
  background: rgba(0, 0, 0, 0.9);
  z-index: 99999;
}

.image-preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.btn-close-preview {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  color: #281d02;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-close-preview:hover {
  background: white;
  transform: scale(1.1);
}

/* Modale Conferma Custom */
.confirm-modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  z-index: 99998;
}

.confirm-modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.confirm-modal-header {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  padding: 2rem;
  text-align: center;
}

.confirm-icon {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.confirm-title {
  font-family: 'Playfair Display', serif;
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.confirm-modal-body {
  padding: 2rem;
  text-align: center;
}

.confirm-message {
  font-family: 'Old Standard TT', serif;
  color: #281d02;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

.confirm-modal-footer {
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-confirm-cancel,
.btn-confirm-yes {
  font-family: 'Playfair Display', serif;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 180px;
}

.btn-confirm-cancel {
  background: #6c757d;
  color: white;
}

.btn-confirm-cancel:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

.btn-confirm-yes {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-confirm-yes:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.8rem;
  }

  .dashboard-subtitle {
    font-size: 1rem;
  }

  .action-bar {
    flex-direction: column;
  }

  .btn-custom {
    width: 100%;
    justify-content: center;
  }

  .group-body {
    padding: 1rem;
  }

  .section-card {
    padding: 1rem;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }

  .btn-close-preview {
    top: 10px;
    right: 10px;
  }

  .btn-save-changes {
    min-width: 100%;
    font-size: 1.1rem;
    padding: 1rem 2rem;
  }

  .save-section {
    padding: 1.5rem;
  }

  .confirm-modal-content {
    width: 95%;
  }

  .confirm-modal-footer {
    flex-direction: column;
  }

  .btn-confirm-cancel,
  .btn-confirm-yes {
    max-width: 100%;
    width: 100%;
  }
}
</style>
