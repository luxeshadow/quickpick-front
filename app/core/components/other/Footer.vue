<template>
  <footer class="footer">

    <div class="footer-container">

      <div class="footer-content">

        <div class="footer-section footer-brand">

          <a
            href="/"
            class="footer-logo"
          >
            <AppLogo />
          </a>

          <p class="footer-description">
            Retrouvez facilement les photos de vos événements.
            QuickPick utilise la reconnaissance faciale pour vous
            permettre d'accéder rapidement aux souvenirs sur lesquels
            vous apparaissez.
          </p>

          <div class="footer-socials">

            <a
              href="#"
              class="footer-social-btn"
              aria-label="Instagram"
            >
              <i class="fi fi-rr-camera"></i>
            </a>

            <a
              href="mailto:contact@quickpick.app"
              class="footer-social-btn"
              aria-label="Contact"
            >
              <i class="fi fi-rr-envelope"></i>
            </a>

          </div>

        </div>


        <!-- =========================
             NAVIGATION
        ========================== -->

        <div class="footer-section">

          <h3>
            Navigation
          </h3>

          <ul>

            <li>
              <a href="/">
                Accueil
              </a>
            </li>

            <li>
              <a href="/gallery">
                Galerie publique
              </a>
            </li>

            <li>
              <a href="/find-me">
                Retrouver mes photos
              </a>
            </li>

          </ul>

        </div>


        <!-- =========================
             QUICKPICK
        ========================== -->

        <div class="footer-section">

          <h3>
            QuickPick
          </h3>

          <ul>

            <li>

              <a
                href="#"
                class="footer-link"
              >
                <i class="fi fi-rr-info"></i>

                Comment ça marche
              </a>

            </li>

            <li>

              <a
                href="#"
                class="footer-link"
              >
                <i class="fi fi-rr-shield-check"></i>

                Confidentialité
              </a>

            </li>

            <li>

              <a
                href="#"
                class="footer-link"
              >
                <i class="fi fi-rr-circle-question"></i>

                Aide
              </a>

            </li>

          </ul>

        </div>


        <!-- =========================
             CONTACT
        ========================== -->

        <div class="footer-section">

          <h3>
            Contact
          </h3>

          <ul>

            <li class="footer-contact-item">

              <i class="fi fi-rr-envelope"></i>

              <span>
                contact@quickpick.app
              </span>

            </li>

            <li class="footer-contact-item">

              <i class="fi fi-rr-map-marker"></i>

              <span>
                Montréal, Québec
              </span>

            </li>

          </ul>

        </div>

      </div>


      <!-- =========================
           FOOTER BOTTOM
      ========================== -->

      <div class="footer-bottom">

        <p>
          © {{ currentYear }} QuickPick.
          Tous droits réservés.
        </p>

        <div class="footer-bottom-links">

          <a href="#">
            Conditions d'utilisation
          </a>

          <a href="#">
            Confidentialité
          </a>

          <a href="#">
            Cookies
          </a>

        </div>

      </div>

    </div>

  </footer>
</template>


<script setup lang="ts">
import AppLogo from './AppLogo.vue';

import { AppColors } from '../../constants/app_colors';

// Keep the palette available to server-rendered CSS bindings.
const colors = AppColors;

const currentYear = new Date().getFullYear();

</script>


<style scoped>

.footer {
  position: relative;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 80% 100%,
      v-bind('colors.primary10'),
      var(--app-transparent) 30%
    ),
    v-bind('colors.navyDark');

  color: v-bind('colors.white');

  border-top:
    1px solid v-bind('colors.white05');
}

.footer-container {
  width: min(
    1200px,
    calc(100% - 48px)
  );

  margin: 0 auto;

  padding: 65px 0 25px;
}

.footer-content {
  display: grid;

  grid-template-columns:
    minmax(250px, 1.4fr)
    repeat(3, minmax(150px, 1fr));

  gap: 50px;

  padding-bottom: 45px;
}


.footer-brand {
  max-width: 340px;
}


.footer-logo { display: inline-flex; align-items: center; margin-bottom: 18px; }

.footer-description {
  max-width: 320px;

  margin: 0;

  color:
    v-bind('colors.textOnDarkSecondary');

  font-size: 14px;

  line-height: 1.8;
}


.footer-section h3 {
  margin: 0 0 20px;

  color:
    v-bind('colors.white');

  font-size: 14px;

  font-weight: 700;
}


.footer-section ul {
  margin: 0;

  padding: 0;

  display: flex;

  flex-direction: column;

  gap: 13px;

  list-style: none;
}


.footer-section li,
.footer-section a {
  color:
    v-bind('colors.textMuted');

  font-size: 13px;

  text-decoration: none;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}


.footer-section a:hover {
  color:
    v-bind('colors.white');
}

.footer-link {
  display: inline-flex;

  align-items: center;

  gap: 8px;
}


.footer-link i {
  display: flex;

  color:
    v-bind('colors.primaryLight');

  font-size: 15px;
}


.footer-contact-item {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  color:
    v-bind('colors.textMuted');

  font-size: 13px;

  line-height: 1.6;
}


.footer-contact-item i {
  display: flex;

  margin-top: 2px;

  color:
    v-bind('colors.primaryLight');
}

.footer-socials {
  display: flex;

  align-items: center;

  gap: 9px;

  margin-top: 24px;
}


.footer-social-btn {
  width: 37px;

  height: 37px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background:
    v-bind('colors.white05');

  border:
    1px solid v-bind('colors.white10');

  color:
    v-bind('colors.textOnDarkSecondary');

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}


.footer-social-btn i {
  display: flex;
}


.footer-social-btn:hover {
  color:
    v-bind('colors.white');

  background:
    v-bind('colors.primary20');

  border-color:
    v-bind('colors.primary20');

  transform:
    translateY(-2px);
}

.footer-bottom {
  min-height: 72px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  border-top:
    1px solid v-bind('colors.white05');

  color:
    v-bind('colors.textMuted');

  font-size: 12px;
}


.footer-bottom p {
  margin: 0;
}


.footer-bottom-links {
  display: flex;

  align-items: center;

  gap: 22px;
}


.footer-bottom-links a {
  color:
    v-bind('colors.textMuted');

  text-decoration: none;

  transition:
    color 0.2s ease;
}


.footer-bottom-links a:hover {
  color:
    v-bind('colors.white');
}

@media (max-width: 950px) {

  .footer-content {
    grid-template-columns:
      1fr 1fr;

    gap: 40px;
  }

}


@media (max-width: 640px) {

  .footer-container {
    width:
      calc(100% - 30px);

    padding-top: 48px;
  }


  .footer-content {
    grid-template-columns: 1fr;

    gap: 35px;

    padding-bottom: 35px;
  }


  .footer-brand {
    max-width: 100%;
  }


  .footer-description {
    max-width: 100%;
  }


  .footer-bottom {
    padding: 20px 0;

    flex-direction: column;

    justify-content: center;

    text-align: center;
  }


  .footer-bottom-links {
    justify-content: center;

    flex-wrap: wrap;

    gap: 15px;
  }

}



</style>