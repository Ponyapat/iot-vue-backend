<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/main";
import Level from "@/components/Level.vue";
import JbLogo from "@/components/JbLogo.vue";

const mainStore = useMainStore();

const year = computed(() => new Date().getFullYear());

const isFooterBarVisible = computed(() => !mainStore.isFullScreen);
</script>

<template>
  <footer v-show="isFooterBarVisible"
    class="flex  justify-center w-full relative bottom-0 bg-white py-2 px-6 dark:bg-gray-900/70 ">
    <level>
      <div class="text-center text-sm md:text-base ">
        <b><a href="https://justboil.me/" target="_blank">© Copyright</a> {{ year }}, All Rights Reserved. | Powered by
          Axons Tech
        </b>
        <!-- <a
          href="https://justboil.me/tailwind-admin-templates/vue-dashboard/"
          target="_blank"
          class="text-blue-600"
        >Premium version</a> -->
      </div>
    </level>
  </footer>
</template>
