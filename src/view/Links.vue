<template>
  <section class="links-page">
    <div class="links-background"></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-10">
          <div class="links-container">
            <!-- Logo/Header -->
            <div class="text-center mb-5 fade-in">
              <img src="../assets/standalone.png" alt="MDV Logo" class="logo-img mb-4"/>
              <p class="page-title">Missionari della Via</p>
              <p class="page-subtitle">Tutti i nostri collegamenti</p>
            </div>

            <!-- Links List -->
            <div class="links-list">
              <!-- Main Website -->
              <a href="https://www.missionaridellavia.net/#/" target="_blank" class="link-item slide-in" style="animation-delay: 0.1s">
                <span class="link-icon"><i class="fas fa-home"></i></span>
                <span class="link-text">Sito Ufficiale</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- Blog -->
              <a href="https://blogdeipiccolidellavia.blogspot.com/" target="_blank" class="link-item slide-in" style="animation-delay: 0.15s">
                <span class="link-icon"><i class="fas fa-blog"></i></span>
                <span class="link-text">Blog dei Piccoli della Via</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- Facebook Consacrati -->
              <a href="https://www.facebook.com/profile.php?id=100068706078801" target="_blank" class="link-item slide-in" style="animation-delay: 0.2s">
                <span class="link-icon facebook-icon"><i class="fab fa-facebook-f"></i></span>
                <span class="link-text">Facebook - Consacrati</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- Instagram -->
              <a href="https://www.instagram.com/missionaridellavia/" target="_blank" class="link-item slide-in" style="animation-delay: 0.25s">
                <span class="link-icon instagram-icon"><i class="fab fa-instagram"></i></span>
                <span class="link-text">Instagram</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- Via del Vangelo -->
              <a href="https://missionaridellavia.github.io/mdv-gospel-way-app/#/" target="_blank" class="link-item slide-in" style="animation-delay: 0.3s">
                <span class="link-icon"><i class="fas fa-book-open"></i></span>
                <span class="link-text">Via del Vangelo</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- YouTube -->
              <a href="https://www.youtube.com/@MdV-missionaridellavia" target="_blank" class="link-item slide-in" style="animation-delay: 0.35s">
                <span class="link-icon youtube-icon"><i class="fab fa-youtube"></i></span>
                <span class="link-text">Canale YouTube</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- Sito Vocazionale -->
              <a href="https://www.vocazione.altervista.org/#/" target="_blank" class="link-item slide-in" style="animation-delay: 0.4s">
                <span class="link-icon"><i class="fas fa-church"></i></span>
                <span class="link-text">Sito Vocazionale</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- Sito Laici -->
              <a href="https://www.cristianidistrada.net/" target="_blank" class="link-item slide-in" style="animation-delay: 0.5s">
                <span class="link-icon"><i class="fas fa-praying-hands"></i></span>
                <span class="link-text">Cristiani di Strada</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>

              <!-- Facebook Laici -->
              <a href="https://www.facebook.com/comunitamissionaria.dellavia" target="_blank" class="link-item slide-in" style="animation-delay: 0.55s">
                <span class="link-icon facebook-icon"><i class="fab fa-facebook-f"></i></span>
                <span class="link-text">Facebook - Laici</span>
                <span class="link-arrow"><i class="fas fa-external-link-alt"></i></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "LinksPage",
  mounted() {
    // Add scroll reveal effect
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.link-item, .divider').forEach(el => {
      observer.observe(el);
    });
  }
}
</script>

<style scoped>
.links-page {
  min-height: 100vh;
  min-height: -webkit-fill-available;
  padding: 3rem 1rem;
  font-family: var(--mdv-font-navigazione);
  position: relative;
  overflow-x: hidden;
  background: var(--mdv-bruno-900);
}

.links-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  background: linear-gradient(135deg, var(--mdv-bruno-900) 0%, var(--mdv-bruno-600) 100%);
  z-index: -1;
}

.links-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--mdv-sabbia) 10%, transparent) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--mdv-sabbia-chiara) 10%, transparent) 0%, transparent 50%);
  pointer-events: none;
}

.links-container {
  padding: 2rem;
  position: relative;
  z-index: 1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px color-mix(in srgb, var(--mdv-sabbia) 30%, transparent), 0 0 40px color-mix(in srgb, var(--mdv-sabbia) 10%, transparent);
  }
  50% {
    box-shadow: 0 0 30px color-mix(in srgb, var(--mdv-sabbia) 50%, transparent), 0 0 60px color-mix(in srgb, var(--mdv-sabbia) 20%, transparent);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out;
}

.slide-in {
  opacity: 0;
  animation: slideIn 0.6s ease-out forwards;
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

.logo-img {
  width: 120px;
  height: auto;
  transition: all 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.05);
}

.page-title {
  font-family: var(--mdv-font-corpo);
  color: var(--mdv-sabbia-chiara);
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px var(--mdv-ombra-media);
}

.page-subtitle {
  color: var(--mdv-sabbia);
  font-size: 1.1rem;
  margin: 0;
  font-style: italic;
  letter-spacing: 0.5px;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: color-mix(in srgb, var(--mdv-bianco) 8%, transparent);
  border: 2px solid color-mix(in srgb, var(--mdv-sabbia) 25%, transparent);
  border-radius: 50px;
  color: var(--mdv-bianco);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.link-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--mdv-sabbia) 20%, transparent), transparent);
  transition: left 0.5s ease;
}

.link-item:hover::before {
  left: 100%;
}

.link-item:hover {
  background: color-mix(in srgb, var(--mdv-sabbia) 15%, transparent);
  border-color: var(--mdv-sabbia-chiara);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px color-mix(in srgb, var(--mdv-sabbia) 40%, transparent);
}

.link-item:active {
  transform: translateY(-1px) scale(0.98);
}

.link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: color-mix(in srgb, var(--mdv-sabbia) 25%, transparent);
  border-radius: 50%;
  color: var(--mdv-sabbia-chiara);
  font-size: 1.3rem;
  margin-right: 1.2rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.link-item:hover .link-icon {
  transform: rotate(360deg);
  background: color-mix(in srgb, var(--mdv-sabbia-chiara) 40%, transparent);
}

/* Social Media Specific Colors */
.facebook-icon {
  background: color-mix(in srgb, var(--mdv-social-facebook) 20%, transparent);
  color: var(--mdv-social-facebook);
}

.link-item:hover .facebook-icon {
  background: color-mix(in srgb, var(--mdv-social-facebook) 30%, transparent);
  box-shadow: 0 0 15px color-mix(in srgb, var(--mdv-social-facebook) 50%, transparent);
}

.instagram-icon {
  background: linear-gradient(45deg, color-mix(in srgb, var(--mdv-social-instagram-rosa) 20%, transparent), color-mix(in srgb, var(--mdv-social-instagram-viola) 20%, transparent));
  color: var(--mdv-social-instagram);
}

.link-item:hover .instagram-icon {
  background: linear-gradient(45deg, color-mix(in srgb, var(--mdv-social-instagram-rosa) 40%, transparent), color-mix(in srgb, var(--mdv-social-instagram-viola) 40%, transparent));
  box-shadow: 0 0 15px color-mix(in srgb, var(--mdv-social-instagram) 50%, transparent);
}

.youtube-icon {
  background: color-mix(in srgb, var(--mdv-social-youtube) 20%, transparent);
  color: var(--mdv-social-youtube);
}

.link-item:hover .youtube-icon {
  background: color-mix(in srgb, var(--mdv-social-youtube) 30%, transparent);
  box-shadow: 0 0 15px color-mix(in srgb, var(--mdv-social-youtube) 50%, transparent);
}

.link-text {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--mdv-bianco);
  letter-spacing: 0.3px;
}

.link-arrow {
  color: var(--mdv-sabbia);
  font-size: 1rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.link-item:hover .link-arrow {
  opacity: 1;
  transform: translateX(8px);
  color: var(--mdv-sabbia-chiara);
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  opacity: 0;
}

.divider span {
  background: linear-gradient(135deg, var(--mdv-bruno-900) 0%, var(--mdv-bruno-600) 100%);
  color: var(--mdv-sabbia-chiara);
  padding: 0.5rem 2rem;
  font-family: var(--mdv-font-corpo);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 2px;
  border: 2px solid color-mix(in srgb, var(--mdv-sabbia) 50%, transparent);
  border-radius: 50px;
  margin: 0 auto;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--mdv-sabbia) 30%, transparent);
  text-transform: uppercase;
}

@media (max-width: 576px) {
  .links-page {
    padding: 2rem 0.5rem;
  }

  .links-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }

  .link-item {
    padding: 1rem 1.2rem;
    border-radius: 40px;
  }

  .link-icon {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    margin-right: 1rem;
  }

  .link-text {
    font-size: 0.95rem;
  }

  .divider span {
    font-size: 1rem;
    padding: 0.4rem 1.5rem;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* iOS Safari fixes */
@supports (-webkit-touch-callout: none) {
  .links-page {
    min-height: -webkit-fill-available;
  }
}
</style>
