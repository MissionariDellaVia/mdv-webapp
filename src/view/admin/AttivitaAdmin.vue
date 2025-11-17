<template>
  <div class="container">
    <base-toast :show="!!toast.val" :type="toast.type">
      {{ toast.message }}
    </base-toast>

    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <div v-else class="admin-content-wrapper">
      <h2 class="admin-page-title">Gestione Attività</h2>
      <div class="row align-items-center mb-4">
        <div class="col-auto">
          <router-link to="/" class="btn btn-outline-secondary">
            <i class="fa fa-home me-2"></i>Torna al Sito
          </router-link>
        </div>
        <div class="col-auto">
          <router-link to="/reserved-area/mdv-admin/dashboard" class="btn btn-outline-primary">
            <i class="fa fa-dashboard me-2"></i>Dashboard
          </router-link>
        </div>
        <div class="col">
          <p class="mb-0 text-muted small">
            <i class="fa fa-info-circle me-1"></i>
            Le modifiche vengono salvate su Firebase in tempo reale
          </p>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <button class="btn-theme btn-theme-primary btn-lg" @click="createNewGroup">
            <i class="fa fa-plus-circle me-2"></i>Aggiungi Nuovo Gruppo Attività
          </button>
        </div>
      </div>

      <div v-if="attivitaData.groups.length === 0" class="alert alert-info text-center">
        <i class="fa fa-info-circle me-2"></i>
        Nessun gruppo presente. Inizia creando il primo gruppo di attività!
      </div>

      <div v-for="(group, groupIndex) in attivitaData.groups" :key="groupIndex" class="card mb-4 shadow-sm group-card">
        <div class="card-header-theme">
          <div class="row align-items-center">
            <div class="col">
              <h5 class="mb-0">
                <i class="fa fa-folder-open me-2"></i>{{ group.title || 'Nuovo Gruppo' }}
              </h5>
              <small class="header-subtitle">Key: {{ group.key }} | Sezioni: {{ group.sections?.length || 0 }}</small>
            </div>
            <div class="col-auto">
              <button class="btn-delete" @click="deleteGroup(groupIndex)" title="Elimina gruppo">
                <i class="fa fa-trash me-1"></i>Elimina
              </button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Titolo</label>
              <input type="text" class="form-control" v-model="group.title">
            </div>
            <div class="col-md-6">
              <label class="form-label">Key (identificatore unico)</label>
              <input type="text" class="form-control" v-model="group.key">
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h6 class="mb-0 section-title">
              <i class="fa fa-list me-2"></i>Sezioni ({{ group.sections?.length || 0 }})
            </h6>
            <button class="btn-theme btn-theme-primary btn-sm" @click="addSection(groupIndex)">
              <i class="fa fa-plus-circle me-1"></i>Aggiungi Sezione
            </button>
          </div>

          <div v-for="(section, sectionIndex) in group.sections" :key="sectionIndex" class="section-card">
            <div class="row align-items-center mb-3 section-header">
              <div class="col">
                <h6 class="mb-0 section-title">
                  <i class="fa fa-file-text me-2"></i>Sezione {{ sectionIndex + 1 }}
                </h6>
              </div>
              <div class="col-auto">
                <button class="btn-delete btn-sm" @click="deleteSection(groupIndex, sectionIndex)" title="Elimina sezione">
                  <i class="fa fa-trash me-1"></i>Elimina
                </button>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Titolo Sezione (opzionale)</label>
              <input type="text" class="form-control" v-model="section.title">
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">
                <i class="fa fa-images me-2"></i>Immagini (Carousel)
              </label>
              <div v-if="getImageArray(section.image).length > 0" class="mb-2">
                <div class="image-carousel-preview">
                  <div v-for="(imgUrl, imgIndex) in getImageArray(section.image)" :key="imgIndex" class="carousel-image-item">
                    <img :src="getImagePreview(imgUrl)" class="img-thumbnail">
                    <button class="btn btn-sm btn-danger remove-image-btn" @click="removeImageFromCarousel(groupIndex, sectionIndex, imgIndex)" title="Rimuovi questa immagine">
                      <i class="fa fa-times"></i>
                    </button>
                    <span class="image-index">{{ imgIndex + 1 }}</span>
                  </div>
                </div>
              </div>
              <button class="btn-theme btn-theme-primary btn-sm" @click="openImageSelector(groupIndex, sectionIndex)">
                <i class="fa fa-plus-circle me-1"></i>{{ getImageArray(section.image).length > 0 ? 'Aggiungi Altra Immagine' : 'Aggiungi Immagine' }}
              </button>
              <small class="d-block text-muted mt-1">
                <i class="fa fa-info-circle me-1"></i>Puoi aggiungere più immagini per creare un carousel
              </small>
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
                <button class="btn-delete" @click="deleteArticle(groupIndex, sectionIndex, articleIndex)" title="Elimina articolo">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
              <button class="btn-theme btn-theme-secondary btn-sm" @click="addArticle(groupIndex, sectionIndex)">
                <i class="fa fa-plus-circle me-1"></i>Aggiungi Articolo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12 text-center">
          <button class="btn-theme btn-theme-primary btn-lg save-button" @click="saveChanges" :disabled="isSaving">
            <span v-if="isSaving">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Salvataggio in corso...
            </span>
            <span v-else>
              <i class="fa fa-save me-2"></i>
              Salva Tutte le Modifiche
            </span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showImageModal" class="modal-overlay" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="mb-0">
            <i class="fa fa-images me-2"></i>Gestione Immagini
          </h5>
          <button class="btn-close" @click="closeImageModal"></button>
        </div>
        <div class="modal-body">
          <div class="upload-section mb-4">
            <label class="form-label fw-bold">
              <i class="fa fa-cloud-upload me-2"></i>Carica Nuova Immagine
            </label>
            <div class="input-group">
              <input type="file" class="form-control" accept="image/*" @change="handleImageUpload" ref="fileInput">
              <span class="input-group-text">
                <i class="fa fa-file-image"></i>
              </span>
            </div>
            <small class="text-muted">Formati supportati: JPG, PNG, GIF, WebP. Max 5MB</small>
          </div>

          <div v-if="uploadingImage" class="text-center py-4">
            <div class="spinner-border text-primary mb-2"></div>
            <p class="text-muted">Caricamento in corso...</p>
          </div>

          <div v-else>
            <hr>
            <h6 class="mb-3">
              <i class="fa fa-folder-open me-2"></i>
              Immagini Disponibili ({{ availableImages.length }})
            </h6>
            <div v-if="availableImages.length === 0" class="alert alert-warning text-center">
              <i class="fa fa-exclamation-triangle me-2"></i>
              Nessuna immagine disponibile. Carica la prima immagine!
            </div>
            <div v-else class="row">
              <div v-for="image in availableImages" :key="image.filename" class="col-md-3 col-sm-4 col-6 mb-3">
                <div class="image-option" @click="selectImage(image.url)" :title="image.filename">
                  <img :src="image.url" class="img-thumbnail" :alt="image.filename" @error="handleImageError">
                  <p class="small text-center mb-0 mt-1 text-truncate">{{ image.filename }}</p>
                  <small class="text-muted d-block text-center">{{ image.size_formatted }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { attivitaImageService, attivitaDataService } from '@/services/attivitaApi';

export default {
  name: 'AttivitaAdmin',
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
      availableImages: [],
      showImageModal: false,
      currentSelection: {
        groupIndex: null,
        sectionIndex: null
      }
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        const lang = localStorage.getItem('lang') || 'it';
        console.log('Caricamento dati attività per lingua:', lang);

        this.attivitaData = await attivitaDataService.getAttivita(lang);
        console.log('Dati caricati:', this.attivitaData);

        if (!this.attivitaData) {
          console.warn('Nessun dato trovato, inizializzo struttura vuota');
          this.attivitaData = {
            header: {
              backgroundImage: 'attivita.jpg',
              title: 'Attività e missioni'
            },
            main: {
              caption: 'Gestisci le attività della comunità'
            },
            groups: []
          };
        }

        if (!this.attivitaData.groups) {
          this.attivitaData.groups = [];
        }
      } catch (error) {
        console.error('Errore caricamento dati:', error);
        this.showToast('Errore caricamento dati: ' + error.message);

        // Inizializza con struttura vuota
        this.attivitaData = {
          header: { backgroundImage: 'attivita.jpg', title: 'Attività' },
          main: { caption: '' },
          groups: []
        };
      }
      this.isLoading = false;
    },

    async loadImages() {
      try {
        console.log('Caricamento immagini dall\'API...');
        const response = await attivitaImageService.listImages();
        console.log('Risposta API:', response);

        if (response.success && response.images) {
          this.availableImages = response.images;
          console.log(`Caricate ${response.images.length} immagini`);
        } else {
          this.availableImages = [];
          console.warn('Nessuna immagine trovata');
        }
      } catch (error) {
        console.error('Errore caricamento immagini:', error);
        this.showToast('Errore caricamento immagini: ' + error.message);
        this.availableImages = [];
      }
    },

    createNewGroup() {
      this.attivitaData.groups.push({
        key: 'new-group-' + Date.now(),
        title: 'Nuovo Gruppo',
        sections: []
      });
    },

    deleteGroup(groupIndex) {
      if (confirm('Sei sicuro di voler eliminare questo gruppo?')) {
        this.attivitaData.groups.splice(groupIndex, 1);
      }
    },

    addSection(groupIndex) {
      if (!this.attivitaData.groups[groupIndex].sections) {
        this.attivitaData.groups[groupIndex].sections = [];
      }
      this.attivitaData.groups[groupIndex].sections.push({
        title: '',
        articles: [''],
        image: { url: null }
      });
    },

    deleteSection(groupIndex, sectionIndex) {
      if (confirm('Sei sicuro di voler eliminare questa sezione?')) {
        this.attivitaData.groups[groupIndex].sections.splice(sectionIndex, 1);
      }
    },

    addArticle(groupIndex, sectionIndex) {
      this.attivitaData.groups[groupIndex].sections[sectionIndex].articles.push('');
    },

    deleteArticle(groupIndex, sectionIndex, articleIndex) {
      this.attivitaData.groups[groupIndex].sections[sectionIndex].articles.splice(articleIndex, 1);
    },

    async openImageSelector(groupIndex, sectionIndex) {
      this.currentSelection = { groupIndex, sectionIndex };
      this.showImageModal = true;
      await this.loadImages();
    },

    closeImageModal() {
      this.showImageModal = false;
      this.currentSelection = { groupIndex: null, sectionIndex: null };
    },

    selectImage(imageUrl) {
      const { groupIndex, sectionIndex } = this.currentSelection;
      if (groupIndex !== null && sectionIndex !== null) {
        const section = this.attivitaData.groups[groupIndex].sections[sectionIndex];

        if (!section.image) {
          section.image = { url: [] };
        }

        if (!section.image.url) {
          section.image.url = [];
        }

        if (typeof section.image.url === 'string') {
          section.image.url = section.image.url ? [section.image.url] : [];
        }

        if (!Array.isArray(section.image.url)) {
          section.image.url = [section.image.url];
        }

        section.image.url.push(imageUrl);
      }
      this.closeImageModal();
    },

    getImageArray(imageObj) {
      if (!imageObj || !imageObj.url) return [];
      if (Array.isArray(imageObj.url)) return imageObj.url;
      if (typeof imageObj.url === 'string' && imageObj.url) return [imageObj.url];
      return [];
    },

    removeImageFromCarousel(groupIndex, sectionIndex, imgIndex) {
      const section = this.attivitaData.groups[groupIndex].sections[sectionIndex];
      if (section.image && Array.isArray(section.image.url)) {
        section.image.url.splice(imgIndex, 1);
      }
    },

    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      console.log('Upload immagine:', file.name, 'Size:', file.size);
      this.uploadingImage = true;

      try {
        const response = await attivitaImageService.uploadImage(file);
        console.log('Upload completato:', response);

        if (response.success && response.url) {
          await this.loadImages();
          this.showToast('Immagine caricata con successo', true);
          this.selectImage(response.url);
        } else if (response.filename) {
          // Fallback se manca 'success' ma c'è filename
          await this.loadImages();
          this.showToast('Immagine caricata', true);
          const fullUrl = `${process.env.VUE_APP_API_BASE_URL}/images.php?filename=${encodeURIComponent(response.filename)}`;
          this.selectImage(fullUrl);
        } else {
          throw new Error('Risposta API non valida');
        }
      } catch (error) {
        console.error('Errore upload:', error);
        this.showToast('Errore upload immagine: ' + error.message);
      } finally {
        this.uploadingImage = false;
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      }
    },

    getImagePreview(url) {
      if (!url || typeof url !== 'string') return '';
      return url;
    },

    async saveChanges() {
      this.isSaving = true;
      try {
        const lang = localStorage.getItem('lang') || 'it';
        await attivitaDataService.saveAttivita(this.attivitaData, lang);
        this.showToast('Modifiche salvate con successo', true);
      } catch (error) {
        this.showToast('Errore salvataggio: ' + error.message);
      }
      this.isSaving = false;
    },

    showToast(message, isSuccess = false) {
      this.toast.val = true;
      this.toast.message = message;
      this.toast.type = isSuccess ? 'success' : 'danger';

      setTimeout(() => {
        this.toast.val = false;
      }, isSuccess ? 1500 : 3000);
    },

    handleImageError(event) {
      console.error('Errore caricamento immagine:', event.target.src);
      event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23ddd" width="150" height="150"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENon disponibile%3C/text%3E%3C/svg%3E';
    }
  }
};
</script>

<style scoped>
.admin-content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
}

.admin-page-title {
  font-family: 'Playfair Display', serif;
  color: #281d02;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #c3ac7d;
}

@media (max-width: 768px) {
  .admin-content-wrapper {
    padding: 1rem;
    max-height: none;
  }

  .admin-page-title {
    font-size: 1.8rem;
  }

  .row.align-items-center.mb-4 {
    flex-direction: column;
    gap: 10px;
  }

  .row.align-items-center.mb-4 .col-auto {
    width: 100%;
  }

  .row.align-items-center.mb-4 .col {
    width: 100%;
    margin-bottom: 10px;
  }

  .btn-custom {
    width: 100%;
  }
}

.image-carousel-preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.carousel-image-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeInScale 0.4s ease-out;
}

.carousel-image-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(140, 104, 28, 0.3);
}

.carousel-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 50%;
  background: rgba(220, 53, 69, 0.9);
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.carousel-image-item:hover .remove-image-btn {
  opacity: 1;
}

.remove-image-btn:hover {
  background: #dc3545;
  transform: scale(1.1);
}

.image-index {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(40, 29, 2, 0.8);
  color: #c3ac7d;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.btn-theme {
  font-family: 'Playfair Display', serif;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-theme-primary {
  background: #8c681c;
  color: white;
  box-shadow: 0 2px 10px rgba(140, 104, 28, 0.25);
}

.btn-theme-primary:hover {
  background: #c3ac7d;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(140, 104, 28, 0.35);
  color: white;
}

.btn-theme-secondary {
  background: #63543f;
  color: white;
}

.btn-theme-secondary:hover {
  background: #8c681c;
  transform: translateY(-2px);
  color: white;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.group-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeInUp 0.4s ease-out;
}

.group-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(140, 104, 28, 0.15) !important;
}

.card-header-theme {
  background: #281d02;
  padding: 1.5rem;
  color: white;
  border-bottom: 3px solid #c3ac7d;
}

.card-header-theme h5 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  color: white;
}

.header-subtitle {
  color: #c3ac7d;
  font-family: 'Old Standard TT', serif;
}

.section-card {
  border: 2px solid #e9ecef;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: #ffffff;
  transition: all 0.3s ease;
  animation: fadeInUp 0.3s ease-out;
}

.section-card:hover {
  border-color: #c3ac7d;
  box-shadow: 0 4px 15px rgba(140, 104, 28, 0.1);
  transform: translateX(4px);
}

.section-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.75rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  color: #281d02;
  font-weight: 600;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-delete:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.save-button {
  font-size: 1.2rem;
  padding: 1rem 3rem;
  box-shadow: 0 6px 20px rgba(140, 104, 28, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.save-button:hover {
  animation: none;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 6px 20px rgba(140, 104, 28, 0.3);
  }
  50% {
    box-shadow: 0 8px 30px rgba(140, 104, 28, 0.5);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-control:focus {
  border-color: #c3ac7d;
  box-shadow: 0 0 0 0.2rem rgba(195, 172, 125, 0.25);
}

textarea.form-control {
  font-family: 'Old Standard TT', serif;
  transition: all 0.3s ease;
}

textarea.form-control:focus {
  transform: scale(1.01);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 900px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1rem;
}

.upload-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.image-option {
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px;
  border-radius: 8px;
  background: white;
}

.image-option:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #f8f9fa;
}

.image-option img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
