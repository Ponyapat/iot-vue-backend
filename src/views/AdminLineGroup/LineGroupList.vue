<template >
    <div>
      <title-bar :title-stack="titleStack" />
      <card-component
        :icon="mdiMonitorCellphone"
        title="กลุ่มไลน์แอดมิน"
        has-table
      >
        <LineGroupListTable />
      </card-component>
    </div>
  </template>
  
  <script setup>
  
  import { computed, ref, onMounted } from "vue";
  import { mdiMonitorCellphone } from "@mdi/js";
  import TitleBar from "@/components/TitleBar.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import LineGroupListTable from '@/components/LineGroupListTable.vue'
  
  const titleStack = ref(["กลุ่มไลน์แอดมิน"]);
  
  
  
  </script>
  