<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ลูกค้าสำหรับฝ่ายขาย"
      has-table
      addlink="/customers/add"
    >
      <!-- table -->
      <CustomerTable />
    </card-component>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import CustomerTable from "@/components/CustomerTable.vue";
import CardComponent from "@/components/CardComponent.vue";

const titleStack = ref(["Customers", "ข้อมูลลูกค้าสำหรับฝ่ายขาย"]);
</script>
