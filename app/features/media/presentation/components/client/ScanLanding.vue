<template>
<div class="scan-landing">
<main id="scan-home" class="home-page">

    <div class="background-circle circle-one"></div>

    <div class="background-circle circle-two"></div>

    <div class="blur-dot"></div>

    <!-- =========================================
         HEADER
    ========================================== -->

    <header class="navbar">

      <div class="nav-container">

        <a href="#scan-home" class="brand" aria-label="Accueil QuickPick">

          <div class="brand-logo-box">

            <AppLogo />

          </div>

        </a>

        <details class="client-menu">
  <summary class="nav-action" aria-label="Ouvrir le menu"><i class="fi fi-rr-bars-sort" aria-hidden="true"></i></summary>
  <nav class="menu-panel" aria-label="Navigation">
    <NuxtLink to="/auth/login">Se connecter</NuxtLink>
    <NuxtLink to="/auth/register">Créer un compte</NuxtLink>
    <button type="button" :disabled="disabled" @click="emit('scan')">Retrouver mes photos</button>
  </nav>
</details>

      </div>

    </header>

    <!-- =========================================
         HERO
    ========================================== -->

    <section class="hero">

      <div class="hero-container">

        <!-- LEFT -->

        <div class="hero-content">

          <div class="small-label">

            <span class="small-label-dot"></span>

            Vos souvenirs, instantanément.

          </div>

          <h1 class="hero-title">

            Retrouvez

            <span class="highlight">
              vos photos.
            </span>

          </h1>

          <p class="hero-description">

            Accédez aux photos de l'événement ou laissez QuickPick
            retrouver automatiquement toutes les photos sur lesquelles
            vous apparaissez.

          </p>

          <!-- =========================================
               ACTIONS
          ========================================== -->

          <div class="actions">

            <!-- GALERIE -->

            <button
              :disabled="disabled" @click="emit('gallery')"
              class="action-button btn-primary"
              type="button"
            >

              <i class="fi fi-rr-images"></i>

              <span>
                Accéder à la galerie
              </span>

              <i
                class="fi fi-rr-arrow-small-right action-arrow"
              ></i>

            </button>

            <!-- FIND ME -->

            <button
              :disabled="disabled" @click="emit('scan')"
              class="action-button btn-secondary"
              type="button"
            >

              <i class="fi fi-rr-face-viewfinder"></i>

              <span>
                Retrouver mes photos
              </span>

              <i
                class="fi fi-rr-arrow-small-right action-arrow"
              ></i>

            </button>

          </div>

          <div class="helper-text">

            <i class="fi fi-rr-lock"></i>

            <span>
              Rapide, simple et sécurisé.
            </span>

          </div>

        </div>

        <!-- =========================================
             CAMERA
        ========================================== -->

        <div class="camera-wrapper">

          <div class="camera-glow"></div>

          <div class="camera-circle"></div>

          <img
            :src="AppImages.scanCamera"
            alt="Appareil photo Canon"
            class="camera-image"
          >

          <div class="photo-card">

            <div class="photo-card-row">

              <div class="photo-card-icon">

                <i class="fi fi-rr-camera"></i>

              </div>

              <div>

                <div class="photo-card-title">
                  Photos disponibles
                </div>

                <div class="photo-card-subtitle">
                  Retrouvez vos souvenirs
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

    <div class="bottom-fade"></div>

  </main>
<Footer />
</div>
</template>

<script setup lang="ts">
import AppLogo from '../../../../../core/components/other/AppLogo.vue';
import { AppImages } from '../../../../../core/constants/app_images';
import { AppColors } from '../../../../../core/constants/app_colors';
import Footer from '../../../../../core/components/other/Footer.vue';
const colors = AppColors;
withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });
const emit = defineEmits<{ gallery: []; scan: [] }>();
</script>
<style scoped>
    * {
      box-sizing: border-box;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    

    .scan-landing {
      --navy: var(--app-navy);
      --navy-2: var(--app-navyLight);
      --navy-3: var(--app-navySoft);

      --blue: var(--app-primary);
      --blue-hover: var(--app-primaryHover);
      --blue-light: var(--app-primaryLight);

      --white: var(--app-surface);

      --text-soft: var(--app-textOnDarkSecondary);
      --text-muted: var(--app-textOnNavyMuted);
    }

    .home-page {
      min-height: 100vh;
      position: relative;
      overflow: hidden;

      background:
        radial-gradient(
          circle at 80% 40%,
          var(--app-scanBlueOpacity28),
          var(--app-transparent) 28%
        ),
        radial-gradient(
          circle at 15% 85%,
          var(--app-scanBlueOpacity16),
          var(--app-transparent) 30%
        ),
        linear-gradient(
          120deg,
          var(--app-navy) 0%,
          var(--app-navyLight) 50%,
          var(--app-navyDeep) 100%
        );
    }

    .background-circle {
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
    }

    .circle-one {
      width: 520px;
      height: 520px;
      top: -260px;
      right: -180px;

      border:
        1px solid var(--app-surfaceOpacity6);
    }

    .circle-two {
      width: 700px;
      height: 700px;
      top: -320px;
      right: -250px;

      border:
        1px solid var(--app-surfaceOpacity4);
    }

    .blur-dot {
      width: 300px;
      height: 300px;

      position: absolute;

      right: 16%;
      top: 30%;

      border-radius: 50%;

      background:
        var(--app-scanBlueOpacity20);

      filter: blur(90px);

      pointer-events: none;
    }

    .navbar {
      height: 96px;
      position: relative;
      z-index: 20;
    }

    .nav-container {
      width: min(1280px, calc(100% - 48px));

      height: 100%;

      margin: 0 auto;

      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
    }

    .brand-logo-box { display: flex; align-items: center; }

    

    .nav-action {
      width: 48px;
      height: 48px;

      border-radius: 15px;

      border:
        1px solid var(--app-surfaceOpacity12);

      background:
        var(--app-surfaceOpacity7);

      color: var(--app-surface);

      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;

      transition: 0.25s ease;

      backdrop-filter: blur(12px);
    }

    .nav-action i {
      display: flex;
      font-size: 20px;
    }

    .nav-action:hover {
      transform: translateY(-2px);

      background:
        var(--app-surfaceOpacity12);

      border-color:
        var(--app-surfaceOpacity22);
    }

    .hero {
      min-height: calc(100vh - 96px);

      position: relative;
      z-index: 5;
    }

    .hero-container {
      width: min(1280px, calc(100% - 48px));

      min-height: calc(100vh - 96px);

      margin: 0 auto;

      display: grid;
      grid-template-columns: 1fr 1fr;

      align-items: center;

      gap: 40px;
    }

    .hero-content {
      position: relative;
      z-index: 10;

      max-width: 680px;

      padding-bottom: 80px;
    }

    .small-label {
      display: inline-flex;
      align-items: center;

      gap: 10px;

      padding: 8px 14px;

      margin-bottom: 26px;

      border-radius: 999px;

      color: var(--app-blueTint);

      background:
        var(--app-scanBlueOpacity13);

      border:
        1px solid var(--app-primaryLightOpacity22);

      font-size: 13px;
      font-weight: 600;

      letter-spacing: 0.02em;
    }

    .small-label-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: var(--blue);

      box-shadow:
        0 0 0 5px var(--app-blueGlowOpacity12);
    }

    .hero-title {
      margin: 0;

      color: var(--app-surface);

      font-size: clamp(48px, 5vw, 76px);

      line-height: 0.98;

      letter-spacing: -0.055em;

      font-weight: 800;
    }

    .hero-title .highlight {
      display: block;

      color: var(--blue-light);
    }

    .hero-description {
      margin-top: 28px;

      max-width: 570px;

      color: var(--text-soft);

      font-size: 17px;

      line-height: 1.75;
    }

    .actions {
      display: flex;
      align-items: stretch;

      gap: 14px;

      margin-top: 38px;

      flex-wrap: wrap;
    }

    .action-button {
      min-height: 62px;

      padding: 0 24px;

      border-radius: 17px;

      border: none;

      display: flex;
      align-items: center;

      gap: 14px;

      font-family: inherit;

      font-size: 14px;
      font-weight: 700;

      cursor: pointer;

      transition: 0.25s ease;

      position: relative;
      overflow: hidden;
    }

    .action-button i {
      display: flex;
      font-size: 20px;
    }

    .btn-primary {
      color: var(--app-surface);

      background:
        var(--app-primary);

      box-shadow:
        0 14px 35px var(--app-scanBlueOpacity25),
        inset 0 1px var(--app-surfaceOpacity15);
    }

    .btn-primary:hover {
      transform: translateY(-3px);

      background:
        var(--app-primaryBright);

      box-shadow:
        0 20px 45px var(--app-scanBlueOpacity33);
    }

    .btn-secondary {
      color: var(--app-surface);

      background:
        var(--app-surfaceOpacity7);

      border:
        1px solid var(--app-surfaceOpacity12);

      backdrop-filter: blur(12px);
    }

    .btn-secondary:hover {
      transform: translateY(-3px);

      background:
        var(--app-surfaceOpacity11);

      border-color:
        var(--app-white20);
    }

    .helper-text {
      margin-top: 24px;

      display: flex;
      align-items: center;

      gap: 10px;

      color: var(--text-muted);

      font-size: 13px;
    }

    .helper-text i {
      color: var(--blue-light);
    }

    .camera-wrapper {
      min-height: 620px;

      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .camera-glow {
      position: absolute;

      width: 500px;
      height: 500px;

      border-radius: 50%;

      background:
        radial-gradient(
          circle,
          var(--app-scanBlueOpacity28) 0%,
          var(--app-scanBlueOpacity8) 45%,
          var(--app-transparent) 72%
        );

      filter: blur(8px);
    }

    .camera-circle {
      position: absolute;

      width: 490px;
      height: 490px;

      border-radius: 50%;

      background:
        var(--app-surfaceOpacity2_5);

      border:
        1px solid var(--app-surfaceOpacity7);
    }

    .camera-circle::after {
      content: "";

      position: absolute;

      inset: 30px;

      border-radius: 50%;

      border:
        1px dashed var(--app-primaryLightOpacity15);
    }

    .camera-image {
      width: min(650px, 55vw);

      max-width: 650px;

      position: relative;
      z-index: 4;

      object-fit: contain;

      filter:
        drop-shadow(
          0 40px 50px var(--app-blackOpacity38)
        );

      transform:
        translateX(15px)
        rotate(-2deg);

      transition:
        transform 0.5s ease;
    }

    .camera-wrapper:hover .camera-image {
      transform:
        translateX(15px)
        rotate(0deg)
        scale(1.025);
    }

    .photo-card {
      position: absolute;
      z-index: 8;

      left: 6%;
      bottom: 17%;

      min-width: 190px;

      padding: 15px 17px;

      border-radius: 18px;

      background:
        var(--app-overlayNavySoftOpacity74);

      border:
        1px solid var(--app-white10);

      backdrop-filter: blur(18px);

      box-shadow:
        0 20px 40px var(--app-blackOpacity25);
    }

    .photo-card-row {
      display: flex;
      align-items: center;

      gap: 12px;
    }

    .photo-card-icon {
      width: 42px;
      height: 42px;

      flex-shrink: 0;

      border-radius: 13px;

      display: flex;
      align-items: center;
      justify-content: center;

      background:
        var(--blue);

      color: var(--app-surface);
    }

    .photo-card-icon i {
      display: flex;
      font-size: 19px;
    }

    .photo-card-title {
      color: var(--app-surface);

      font-size: 13px;
      font-weight: 700;
    }

    .photo-card-subtitle {
      margin-top: 3px;

      color: var(--app-textOnNavySoft);

      font-size: 11px;
    }

    .bottom-fade {
      pointer-events: none;

      position: absolute;

      left: 0;
      right: 0;
      bottom: 0;

      height: 160px;

      background:
        linear-gradient(
          to top,
          var(--app-overlayNavyOpacity55),
          var(--app-transparent)
        );
    }

    @media (max-width: 950px) {

      .navbar {
        height: 84px;
      }

      .hero {
        min-height: auto;
      }

      .hero-container {
        grid-template-columns: 1fr;

        min-height: auto;

        padding-top: 60px;
        padding-bottom: 70px;
      }

      .hero-content {
        max-width: 740px;

        margin: auto;

        padding-bottom: 0;

        text-align: center;
      }

      .hero-description {
        margin-left: auto;
        margin-right: auto;
      }

      .actions {
        justify-content: center;
      }

      .helper-text {
        justify-content: center;
      }

      .camera-wrapper {
        min-height: 460px;
      }

      .camera-image {
        width: min(600px, 90vw);
      }

      .camera-circle {
        width: 410px;
        height: 410px;
      }

      .photo-card {
        left: 12%;
        bottom: 10%;
      }
    }

    @media (max-width: 640px) {

      .nav-container,
      .hero-container {
        width: calc(100% - 30px);
      }

      .navbar {
        height: 76px;
      }

      .brand-logo-box { display: flex; align-items: center; }

      

      .nav-action {
        width: 42px;
        height: 42px;

        border-radius: 13px;
      }

      .hero-container {
        padding-top: 42px;

        gap: 10px;
      }

      .small-label {
        margin-bottom: 20px;

        font-size: 11px;
      }

      .hero-title {
        font-size:
          clamp(42px, 13vw, 62px);
      }

      .hero-description {
        margin-top: 23px;

        font-size: 15px;

        line-height: 1.7;
      }

      .actions {
        width: 100%;

        display: grid;

        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 12px;

        margin-top: 30px;
      }

      .action-button {
        width: 100%;

        min-height: 145px;

        padding: 18px 15px;

        border-radius: 21px;

        flex-direction: column;

        justify-content: flex-start;
        align-items: flex-start;

        gap: 12px;

        text-align: left;

        overflow: hidden;
      }

      .action-button::before {
        content: "";

        position: absolute;

        width: 100px;
        height: 100px;

        right: -45px;
        top: -45px;

        border-radius: 50%;

        background:
          var(--app-surfaceOpacity7);

        pointer-events: none;
      }

      .action-button > i:first-child {
        width: 44px;
        height: 44px;

        border-radius: 14px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 21px;
      }

      .action-button span {
        max-width: 105px;

        margin-top: 3px;

        font-size: 13px;

        line-height: 1.35;

        position: relative;
        z-index: 2;
      }

      .btn-primary {
        background:
          linear-gradient(
            145deg,
            var(--app-primary) 0%,
            var(--app-primaryDark) 100%
          );

        box-shadow:
          0 14px 30px
          var(--app-primaryOpacity25);
      }

      .btn-primary > i:first-child {
        color: var(--app-surface);

        background:
          var(--app-surfaceOpacity15);

        border:
          1px solid
          var(--app-surfaceOpacity12);
      }

      .btn-secondary {
        background:
          linear-gradient(
            145deg,
            var(--app-surfaceOpacity11),
            var(--app-white05)
          );

        border:
          1px solid
          var(--app-surfaceOpacity14);

        backdrop-filter:
          blur(16px);
      }

      .btn-secondary > i:first-child {
        color: var(--app-bluePastel);

        background:
          var(--app-primaryOpacity13);

        border:
          1px solid
          var(--app-primaryLightOpacity14);
      }

      .action-button .action-arrow {
        position: absolute;

        right: 13px;
        bottom: 13px;

        width: 31px;
        height: 31px;

        border-radius: 10px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 17px;

        background:
          var(--app-surfaceOpacity12);

        border:
          1px solid
          var(--app-surfaceOpacity8);
      }

      .btn-secondary .action-arrow {
        background:
          var(--app-primaryOpacity12);

        color: var(--app-blueSoft);
      }

      .camera-wrapper {
        min-height: 360px;

        margin-top: 25px;
      }

      .camera-circle {
        width: 320px;
        height: 320px;
      }

      .camera-glow {
        width: 350px;
        height: 350px;
      }

      .camera-image {
        width: 105%;

        max-width: 500px;
      }

      .photo-card {
        left: 4%;
        bottom: 5%;

        transform: scale(0.87);

        transform-origin: left bottom;
      }
    }
    @media (max-width: 360px) {

      .actions {
        gap: 8px;
      }

      .action-button {
        min-height: 138px;

        padding: 15px 12px;

        border-radius: 18px;
      }

      .action-button span {
        font-size: 12px;
      }
    }
  
.scan-landing { --navy: v-bind('colors.navy'); --navy-2: v-bind('colors.navyLight'); --navy-3: v-bind('colors.navySoft'); --blue: v-bind('colors.primary'); --blue-hover: v-bind('colors.primaryHover'); --blue-light: v-bind('colors.primaryLight'); --white: v-bind('colors.white'); --text-soft: v-bind('colors.textOnDarkSecondary'); --text-muted: v-bind('colors.textMuted'); font-family: inherit; }
button { font-family: inherit; }
.hero-container > * { min-width: 0; }
.client-menu { position: relative; }
.client-menu summary { list-style: none; }
.client-menu summary::-webkit-details-marker { display: none; }
.menu-panel { position: absolute; top: 58px; right: 0; width: 225px; display: flex; flex-direction: column; gap: 5px; padding: 10px; background: var(--navy); border: 1px solid var(--app-surfaceOpacity15); border-radius: 16px; box-shadow: 0 16px 40px var(--app-blackOpacity25); }
.menu-panel a, .menu-panel button { display: block; padding: 12px; color: var(--app-surface); background: var(--app-transparent); border: 0; border-radius: 10px; font: inherit; font-size: 13px; text-align: left; cursor: pointer; }
.menu-panel a:hover, .menu-panel button:hover { background: var(--app-surfaceOpacity8); }
button:focus-visible, a:focus-visible, summary:focus-visible { outline: 2px solid var(--blue-light); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }

@media (max-width: 640px) {
  .brand-logo-box { display: flex; align-items: center; }
}
@media (min-width: 641px) {
  .brand-logo-box { display: flex; align-items: center; }
}
</style>
