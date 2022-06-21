<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="Users"
      has-table
    >
      <clients-table />
    </card-component>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import TitleBar from "@/components/TitleBar.vue";
import HeroBar from "@/components/HeroBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import ClientsTable from '@/components/ClientsTable.vue'

const titleStack = ref(["Admin", "Users"]);



</script>
