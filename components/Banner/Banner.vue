<template>
  <div class="root">
    <div class="decoration">
      <svg class="left-deco">
        <use xlink:href="/images/saas/deco-bg-left.svg#main" />
      </svg>
      <svg class="right-deco">
        <use xlink:href="/images/saas/deco-bg-right.svg#main" />
      </svg>
    </div>
    <v-container :class="{ fixed: isDesktop }">
      <div class="slider-wrap">
        <div class="text">
          <div>
            <h3 class="use-text-title">
              {{ $t("saasLanding.banner_title") }}
            </h3>
          </div>
          <div class="subtitle">
            <p class="use-text-subtitle">
              {{ $t("saasLanding.banner_subtitle") }}
            </p>
          </div>
          <div class="btn-area">
            <v-btn
              :to="localePath(link.saas.login)"
              size="large"
              class="demo-button"
            >
              {{ $t("saasLanding.header_bookademo") }}
            </v-btn>
            <v-btn
              :to="localePath(link.saas.login)"
              size="large"
              class="try-button"
            >
              {{ $t("saasLanding.try_ai_interview") }}
            </v-btn>
          </div>
        </div>
        <div class="sub-banner">
          <div class="sub-banner-text">
            <div class="sub-banner-title">Experience the potential today!</div>
            <div class="sub-banner-subtitle">
              Transform your recruitment with AI-powered solutions. Try our free
              demo to experience the difference.
            </div>
            <div>
              <v-btn
                :to="localePath(link.saas.login)"
                size="large"
                class="try-button-reverse"
              >
                {{ $t("saasLanding.try_ai_interview") }}
              </v-btn>
            </div>
          </div>
          <div class="sub-banner-image">
            <img :src="imgAPI.saas[8]" alt="screen" />
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
@import "./banner-style.scss";
</style>

<script>
import youtube from "@/config/youtube";
import imgAPI from "@/assets/images/imgAPI";
import link from "@/assets/text/link";
import { useLocalePath } from "#imports";
import Hidden from "../Hidden";

export default {
  setup() {
    const localePath = useLocalePath();
    return {
      localePath,
    };
  },
  components: {
    Hidden,
  },
  data() {
    return {
      videoId: "KxZAdEGpYAw",
      hide: false,
      link,
      imgAPI,
      dialog: false,
      player: null,
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        showinfo: 1,
        mute: 0,
        origin: "https://localhost:3000",
      },
      yt: youtube,
    };
  },
  computed: {
    isDesktop() {
      const lgUp = this.$vuetify.display.lgAndUp;
      return lgUp;
    },
  },
  methods: {
    handleVideoOpen() {
      if (this.yt.use) {
        this.dialog = true;
      }
    },
    onReady() {
      this.$refs.youtube.playVideo();
    },
    handleVideoClose() {
      this.dialog = false;
      this.$refs.youtube.pauseVideo();
    },
  },
};
</script>
