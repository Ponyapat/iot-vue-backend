<template >
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="สถานะการทำงานของบอร์ด"
      has-table
    >
      <BoardTable />
    </card-component>
  </div>
</template>

<script setup>

import { computed, ref, onMounted } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import BoardTable from '@/components/BoardTable.vue'

const titleStack = ref(["สถานะการทำงานของบอร์ด"]);



</script>
