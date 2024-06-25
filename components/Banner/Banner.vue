<template>
  <div class="root">
    <!-- <v-dialog v-model="dialog" max-width="690">
      <v-card class="video-popup">
        <v-card-title class="headline">
          <h2 class="text-h6">
            {{ $t("saasLanding.banner_title") }}
            <v-btn variant="flat" icon @click="handleVideoClose()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </h2>
        </v-card-title>
        <div v-if="yt.use" class="text-center mx-auto py-4">
          <YouTube
            ref="youtube"
            :src="videoId"
            :vars="playerVars"
            :width="640"
            :height="360"
            class="youtube"
            @ready="onReady"
          />
        </div>
      </v-card>
    </v-dialog> -->
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
              <!-- <strong>
              {{ $t("saasLanding.banner_titlestrong") }}
            </strong> -->
            </h3>
          </div>

          <div style="max-width: 740px; margin: 0 auto">
            <p class="use-text-subtitle">
              {{ $t("saasLanding.banner_subtitle") }}
            </p>
          </div>

          <div class="btn-area">
            <!-- <v-btn
              variant="text"
              class="play-btn"
              size="large"
              @click="handleVideoOpen()"
            >
              <span class="icon">
                <i class="ion-ios-play-outline" />
              </span>
              {{ $t("saasLanding.banner_watchvideo") }}
            </v-btn> -->
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
        <!-- <div class="illustration">
          <img
            style="
              border-radius: 15px;
              border: 1px solid white;
              box-shadow: 1px 1px 3px 3px black;
            "
            :src="imgAPI.saas[7]"
            alt="illustration"
          />
        </div> -->
        <div
          style="
            width: 1000px;
            height: 400px;
            background-color: white;
            align-self: center;
            margin-top: 80px;
            border-radius: 10px;
            display: flex;
            justify-content: flex-end;
            flex-direction: row;
            padding: 30px 0px 40px 50px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Hafif gölge */
          "
        >
          <div
            style="
              display: flex;
              justify-content: flex-start;
              flex-direction: column;
              text-align: left;
              margin-right: 20px;
            "
          >
            <div
              style="
                font-size: 40px;
                font-weight: 700;
                margin-bottom: 20px;
                line-height: 50px;
                margin-top: 15px;
              "
            >
              Experience the potential today!
            </div>
            <div style="margin-bottom: 30px; font-size: 18px">
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
          <div style="display: flex; justify-content: center">
            <img style="width: 500px" :src="imgAPI.saas[8]" alt="screen" />
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
