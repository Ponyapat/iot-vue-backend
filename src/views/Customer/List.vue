<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ลูกค้า (Customer)"
      has-table
      addlink="/customer/add"
    >
      <!-- teble -->
    </card-component>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";

const titleStack = ref(["Customers", "ลูกค้า"]);
</script>
