<template >
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ข้อมูลการประกันสินค้า"
      has-table
    >
      <WanrratyTable />
    </card-component>
  </div>
</template>

<script setup>

import { computed, ref, onMounted } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import WanrratyTable from '@/components/WanrratyTable.vue'

const titleStack = ref(["ข้อมูลการประกันสินค้า"]);



</script>
