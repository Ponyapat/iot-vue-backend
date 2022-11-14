<template>
  <title-bar :title-stack="titleStack" />
  <card-component
      :icon="mdiMonitorCellphone"
      title="พืชพันธุ์ผลไม้"
      has-table
      addlink="/fruits/add"
    >
    <FruitsTable />
    </card-component>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import FruitsTable from '@/components/FruitsTable.vue'

const titleStack = ref(["พืชพันธุ์ผลไม้", "ผู้ดูแลระบบ"]);
</script>

<style>

</style>
