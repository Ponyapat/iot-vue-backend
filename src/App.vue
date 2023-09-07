<script setup>
import { computed , onBeforeMount } from 'vue'
import { useMainStore } from '@/stores/main'
import { useRouter } from "vue-router";
import menu from '@/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import Overlay from '@/components/Overlay.vue'

const mainStore = useMainStore()
const router = useRouter();

mainStore.setStyle("basic")
// mainStore.setDarkMode(false)

onBeforeMount(()=>{
  //console.log(imyVar)
  if (localStorage.getItem("tkfw") !== null) {
    const userid = localStorage.getItem("userid")
    ApiMain.get('/users/'+userid+'/profile').then((data) => {
        mainStore.setUser({
          name: data.data.user.name,
          email: data.data.user.email,
          avatar: '/images/avataaars.svg'
        });
    }).catch((error) => {
        router.push("/login");
    });
  }else{
    router.push("/login");
  }
})

const isAsideLgActive = computed(() => mainStore.isAsideLgActive);

const overlayClick = () => {
  mainStore.asideLgToggle(false)
};
</script>

<template>
  <nav-bar />
  <aside-menu :menu="menu" />
  <router-view />
  
  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
  <footer-bar />
</template>
 

<style>
body {
  @apply pt-14 xl:pl-60;
}

#app {
  @apply w-screen transition-position lg:w-auto;
}

.dropdown {
  @apply cursor-pointer;
}

.m-clipped, .m-clipped body {
  @apply overflow-hidden lg:overflow-visible;
}

.full-screen body {
  @apply p-0;
}

</style>