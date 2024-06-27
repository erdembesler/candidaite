<template>
  <div class="root">
    <div class="decoration">
      <svg class="wave">
        <use xlink:href="/images/saas/deco-bg.svg#main" />
      </svg>
    </div>
    <div :class="{ fixed: isDesktop }">
      <div class="item">
        <v-row>
          <v-col
            md="4"
            cols="12"
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
            "
          >
            <div
              data-aos="fade-right"
              data-aos-offset="-100"
              data-aos-delay="500"
              data-aos-duration="500"
            >
              <div class="desc">
                <title-main :align="isMobile ? 'center' : 'left'">
                  <span>
                    {{ $t("saasLanding.feature_title1") }}
                  </span>
                </title-main>
                <h6
                  class="use-text-subtitle2"
                  :class="[isMobile ? 'text-center' : 'text-start']"
                >
                  {{ $t("saasLanding.feature_desc2") }}
                </h6>
                <div :class="[isMobile ? 'text-center' : 'text-start']">
                  <v-btn color="primary" size="large" class="btn">
                    {{ $t("saasLanding.see_detail") }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
          <v-col md="8" cols="12">
            <div class="youtube-container">
              <YouTube
                ref="youtube"
                :src="videoId"
                :vars="playerVars"
                :width="youtubeWidth"
                :height="youtubeHeight"
                class="youtube"
                @ready="onReady"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="item">
        <v-row>
          <v-col
            :order="isMobile ? 'first' : 'last'"
            cols="12"
            md="4"
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
            "
          >
            <div
              data-aos="fade-left"
              data-aos-offset="-100"
              data-aos-delay="500"
              data-aos-duration="500"
            >
              <div class="desc">
                <title-main :align="isMobile ? 'center' : 'left'">
                  <span>
                    {{ $t("saasLanding.feature_title1") }}
                    <strong>
                      {{ $t("saasLanding.feature_titlestrong1") }}
                    </strong>
                  </span>
                </title-main>
                <h6
                  class="use-text-subtitle2"
                  :class="[isMobile ? 'text-center' : 'text-left']"
                >
                  {{ $t("saasLanding.feature_desc1") }}
                </h6>
                <v-btn color="primary" size="large" class="btn" style="">
                  {{ $t("saasLanding.see_detail") }}
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col :order="isMobile ? 'last' : 'first'" cols="12" md="8">
            <img style="max-width: 800px" :src="imgAPI.saas[9]" alt="screen" />
          </v-col>
        </v-row>
      </div>
      <div class="item">
        <v-row>
          <v-col
            md="4"
            cols="12"
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
            "
          >
            <div
              data-aos="fade-right"
              data-aos-offset="-100"
              data-aos-delay="500"
              data-aos-duration="500"
            >
              <div class="desc">
                <title-main :align="isMobile ? 'center' : 'left'">
                  <span>
                    {{ $t("saasLanding.feature_title1") }}
                  </span>
                </title-main>
                <h6
                  class="use-text-subtitle2"
                  :class="[isMobile ? 'text-center' : 'text-start']"
                >
                  {{ $t("saasLanding.feature_desc2") }}
                </h6>
                <div :class="[isMobile ? 'text-center' : 'text-start']">
                  <v-btn color="primary" size="large" class="btn">
                    {{ $t("saasLanding.see_detail") }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
          <v-col md="8" cols="12">
            <div
              style="display: flex; flex-direction: row; justify-content: end"
            >
              <img
                style="max-width: 800px"
                :src="imgAPI.saas[9]"
                alt="screen"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="item">
        <v-row>
          <v-col
            :order="isMobile ? 'first' : 'last'"
            cols="12"
            md="4"
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
            "
          >
            <div
              data-aos="fade-left"
              data-aos-offset="-100"
              data-aos-delay="500"
              data-aos-duration="500"
            >
              <div class="desc">
                <title-main :align="isMobile ? 'center' : 'left'">
                  <span>
                    {{ $t("saasLanding.feature_title1") }}
                    <strong>
                      {{ $t("saasLanding.feature_titlestrong1") }}
                    </strong>
                  </span>
                </title-main>
                <h6
                  class="use-text-subtitle2"
                  :class="[isMobile ? 'text-center' : 'text-left']"
                >
                  {{ $t("saasLanding.feature_desc1") }}
                </h6>
                <v-btn color="primary" size="large" class="btn" style="">
                  {{ $t("saasLanding.see_detail") }}
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col
            :order="isMobile ? 'last' : 'first'"
            cols="12"
            md="8"
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
            "
          >
            <div>
              <img
                :src="imgAPI.saas[9]"
                alt="screen"
                style="max-width: 800px"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <!-- <div class="item last">
        <title-main align="center">
          <span>
            {{ $t("saasLanding.feature_title3") }}
            <strong>
              {{ $t("saasLanding.feature_titlestrong3") }}
            </strong>
          </span>
        </title-main>
        <div class="tab">
          <v-row class="spacing6">
            <v-col v-if="!isMobile" class="pa-6" md="1" cols="12" />
            <v-col lg="10" cols="12" class="pa-6">
              <v-tabs
                v-model="tab"
                class="tabs"
                color="primary"
                align-tabs="center"
              >
                <v-tab value="tab-1" class="tab-label"> Pellentesque </v-tab>
                <v-tab value="tab-2" class="tab-label"> Donec </v-tab>
                <v-tab value="tab-3" class="tab-label"> Vestibulum </v-tab>
              </v-tabs>
              <v-window v-model="tab">
                <v-window-item value="tab-1">
                  <div class="tab-content">
                    <section>
                      <h6 class="text-center use-text-subtitle2">
                        {{ $t("saasLanding.feature_desc3") }}
                      </h6>
                      <div class="illustration-center">
                        <figure class="figure screen">
                          <img :src="imgAPI.saas[4]" alt="screen" />
                        </figure>
                      </div>
                    </section>
                  </div>
                </v-window-item>
                <v-window-item value="tab-2">
                  <div class="tab-content">
                    <section>
                      <h6 class="text-center use-text-subtitle2">
                        {{ $t("saasLanding.feature_desc3") }}
                      </h6>
                      <div class="illustration-center">
                        <figure class="figure screen">
                          <img :src="imgAPI.saas[5]" alt="screen" />
                        </figure>
                      </div>
                    </section>
                  </div>
                </v-window-item>
                <v-window-item value="tab-3">
                  <div class="tab-content">
                    <section>
                      <h6 class="text-center use-text-subtitle2">
                        {{ $t("saasLanding.feature_desc3") }}
                      </h6>
                      <div class="illustration-center">
                        <figure class="figure screen">
                          <img :src="imgAPI.saas[6]" alt="screen" />
                        </figure>
                      </div>
                    </section>
                  </div>
                </v-window-item>
              </v-window>
              <parallax-large />
            </v-col>
          </v-row>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./feature-style.scss";
</style>

<script>
import AOS from "aos";
import imgAPI from "@/assets/images/imgAPI";
import ParallaxMedium from "../Parallax/Medium";
import ParallaxLarge from "../Parallax/Large";
import Title from "../Title";
import youtube from "~/plugins/youtube";

export default {
  components: {
    ParallaxMedium,
    ParallaxLarge,
    "title-main": Title,
  },
  data() {
    return {
      tab: null,
      imgAPI,
      loaded: false,
      videoId: "KxZAdEGpYAw",
      youtubeWidth: 800,
      youtubeHeight: 520,
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        showinfo: 0,
        mute: 0,
        origin: "https://localhost:3000",
      },
    };
  },
  computed: {
    isDesktop() {
      const lgUp = this.$vuetify.display.lgAndUp;
      console.log(lgUp);
      return lgUp;
    },
    isMobile() {
      const smDown = this.$vuetify.display.smAndDown;
      return smDown;
    },
    isTablet() {
      const mdDown = this.$vuetify.display.mdAndDown;
      return mdDown;
    },
  },
  mounted() {
    this.loaded = true;
    AOS.init({
      once: true,
    });
  },
};
</script>
