<script setup lang="ts">

</script>

<template>
  <div class="home-content">
    <div class="hero-background">

    </div>
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
          <router-link to="/register" class="btn cta-primary">S'inscrire</router-link>
          <a href="#features" class="btn cta-outline">Fonctionnalités</a>
        </div>
      </div>
    </section>
    <section class="dashboard-preview">
      <div class="container">
        <div class="dashboard-preview-image">
          <img src="../assets/images/ecran-dashboard-app.webp" alt="Dashboard FlowBiz" />
        </div>
      </div>
    </section>
    <section id="features" class="features-section">
      <h2>Fonctionnalités clées</h2>
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
            <img src="../assets/images/ecran-inventaire-feature.webp" alt="FlowBiz product gestion" />
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
            <img src="../assets/images/ecran-ventes-feature.webp" alt="FlowBiz product gestion" />
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
            <img src="../assets/images/ecran-dashboard-app.webp" alt="FlowBiz product gestion" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>