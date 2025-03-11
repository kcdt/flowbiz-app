<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitForm = () => {
  const { name, email, subject, message } = form.value;
  
  const mailtoLink = `mailto:kcondot@gmail.com.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`De: ${name} (${email})\n\n${message}`)}`;
  
  window.location.href = mailtoLink;
  
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
};

const scrollToAnchor = (id: string) => {
  if (id) {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
};
const route = useRoute();

onMounted(() => {
  if (route.query.scrollTo && typeof route.query.scrollTo === 'string') {
    scrollToAnchor(route.query.scrollTo);
  }
});
</script>

<template>
  <div class="public-content">
    <div class="hero-background"></div>
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-title-colored">Sans stress</span>, la comptabilité 
          vous mène <span class="hero-title-colored">vers la réussite</span>
        </h1>
        <p class="hero-subtitle">
          Suivez vos ventes, gérez votre inventaire et 
          générez vos factures <span class="hero-subtitle-highlight">en quelques clics</span>
        </p>
        <div class="hero-buttons">
          <router-link to="/register" class="btn-primary">S'inscrire</router-link>
          <a @click.prevent="scrollToSection('features')" class="btn-outline">Fonctionnalités</a>
        </div>
      </div>
    </section>
    <section class="dashboard-preview">
      <div class="container">
        <div class="dashboard-preview-image">
          <img src="../assets/images/ecran-dashboard-app.webp" loading="lazy" alt="Application dashboard" />
        </div>
      </div>
    </section>
    <section id="features" class="features-section">
      <h2 class="section-title">Fonctionnalités clées</h2>
      <div class="feature-item">
        <div class="first-part">
          <h3>Gestion simplifiée des stocks et produits</h3>
          <p>Gardez une vision claire de votre inventaire en temps réel. Suivez facilement les niveaux de stock, recevez des alertes automatiques lorsqu'il est temps de réapprovisionner, et accédez à l'historique complet de chaque produit. Avec FlowBiz, finies les ruptures de stock imprévues ou les sur-stockages coûteux.</p>
          <ul>
            <li>
              <p>Suivi en temps réel des niveaux de stock</p>
            </li>
            <li>
              <p>Alertes automatiques de réapprovisionnement</p>
            </li>
            <li>
              <p>Historique détaillé des mouvements par produit</p>
            </li>
            <li>
              <p>Interface intuitive pour ajouter et modifier vos produits</p>
            </li>
          </ul>
        </div>
        <div class="second-part">
          <div class="feature-image">
            <img src="../assets/images/ecran-inventaire-feature.webp" loading="lazy" alt="FlowBiz product gestion" />
          </div>
        </div>
      </div>
      <div class="feature-item">
        <div class="first-part">
          <h3>Système de vente et facturation intégré</h3>
          <p>Transformez chaque vente en opportunité de croissance. Créez des commandes en quelques clics, générez instantanément des factures professionnelles, et suivez leur statut de paiement. Notre système intégré élimine les saisies multiples et garantit une cohérence parfaite entre vos ventes et votre comptabilité.</p>
          <ul>
            <li>
              <p>Création rapide de commandes avec calcul automatique des totaux</p>
            </li>
            <li>
              <p>Génération instantanée de factures personnalisées</p>
            </li>
            <li>
              <p>Suivi des paiements et des échéances</p>
            </li>
            <li>
              <p>Historique client pour fidéliser votre clientèle</p>
            </li>
          </ul>
        </div>
        <div class="second-part">
          <div class="feature-image">
            <img src="../assets/images/ecran-ventes-feature.webp" loading="lazy" alt="FlowBiz sales gestion" />
          </div>
        </div>
      </div>
      <div class="feature-item">
        <div class="first-part">
          <h3>Tableau de bord analytique personnalisé</h3>
          <p>Prenez des décisions éclairées grâce à une vision claire de votre activité. Notre tableau de bord vous présente vos indicateurs de performance essentiels : ventes mensuelles, produits les plus populaires, et évolution de votre chiffre d'affaires. Identifiez facilement les tendances et les opportunités pour développer stratégiquement votre entreprise.</p>
          <ul>
            <li>
              <p>Visualisation intuitive de vos données commerciales</p>
            </li>
            <li>
              <p>Suivi de vos KPIs en un coup d'œil</p>
            </li>
            <li>
              <p>Rapports personnalisables selon vos besoins</p>
            </li>
            <li>
              <p>Identification facile des tendances et opportunités de croissance</p>
            </li>
          </ul>
        </div>
        <div class="second-part">
          <div class="feature-image">
            <img src="../assets/images/ecran-dashboard-app.webp" loading="lazy" alt="FlowBiz dashboard" />
          </div>
        </div>
      </div>
    </section>
    <section id="contact" class="contact-section">
      <div class="container">
        <h2 class="section-title">Contactez-nous</h2>
        <p class="section-subtitle">Une question ? N'hésitez pas à nous contacter !</p>
        
        <div class="contact-form-container">
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-group">
              <label for="name">Nom</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                placeholder="Votre nom" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                placeholder="Votre email" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="subject">Sujet</label>
              <input 
                type="text" 
                id="subject" 
                v-model="form.subject" 
                placeholder="Sujet de votre message" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                placeholder="Votre message" 
                rows="5" 
                required
              ></textarea>
            </div>
            
            <button type="submit" class="submit-button">
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>