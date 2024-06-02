<template>
  <header class="header">
    <div class="logo">
      <span class="logo-text-candid">candid</span>
      <span class="logo-text-ai">AI</span>
      <span class="logo-text-te">te</span>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header-comp",
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 3px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Hafif gölge */
}

.logo {
  display: flex;
  margin-left: 30px;
  align-items: center;
}

.logo img {
  height: 40px; /* Logonun yüksekliğini ayarlayın */
  margin-right: 10px;
}
.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0.12) !important;
}
.black-divider {
  background-color: black;
}
.logo-text-candid {
  color: #575757;
  font-size: 24px;
  font-weight: 300;
  line-break: auto;
}
.logo-text-ai {
  color: #5162ec;
  font-size: 24px;
  font-weight: 600;
}
.logo-text-te {
  color: #575757;
  font-size: 24px;
  font-weight: 300;
}
</style>
