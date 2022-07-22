<script setup>
import { computed , onBeforeMount } from 'vue'
import { useMainStore } from '@/stores/main'
import { useRouter } from "vue-router";
import menu from '@/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import Overlay from '@/components/Overlay.vue'
import axios from "axios";

const mainStore = useMainStore()
const router = useRouter();

mainStore.setStyle("basic")
// mainStore.setDarkMode(false)

// if (localStorage.getItem("nong") === null) {
//   localStorage.setItem("nong", 
//  JSON.stringify({name: 'Demo',
//   email: 'Demo@test.com'
//   }))
// }

onBeforeMount(()=>{
  //console.log(imyVar)
  if (localStorage.getItem("tkfw") !== null) {
    const token = localStorage.getItem("tkfw")
    const userid = localStorage.getItem("userid")
    //console.log("onBeforeMount")
    //console.log(token)
    axios.get(import.meta.env.VITE_API_ENDPOINT+'/api/users/'+userid+'/profile', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then((data) => {
        mainStore.setUser({
          name: data.data.user.name,
          email: data.data.user.email,
          avatar: 'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93'
        });
    }).catch((error) => {
        router.push("/login");
    });
  }else{
    router.push("/login");
  }
})

const isAsideLgActive = computed(() => mainStore.isAsideLgActive)

const overlayClick = () => {
  mainStore.asideLgToggle(false)
}
</script>

<template>
  <nav-bar />
  <aside-menu :menu="menu" />
  <router-view />
  <footer-bar />
  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
</template>
