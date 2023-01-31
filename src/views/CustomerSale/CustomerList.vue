<template>
  <div>
    <title-bar class="p-4" :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ลูกค้าสำหรับฝ่ายขาย"
      has-table
      :addlink="Addlink"
    >
      <!-- table -->
      <CustomerTable />
    </card-component>
  </div>
</template>
<script setup>
import { ref , onBeforeMount } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import CustomerTable from "@/components/CustomerTable.vue";
import CardComponent from "@/components/CardComponent.vue";

const titleStack = ref(["Customers", "ข้อมูลลูกค้าสำหรับฝ่ายขาย"]);
const Addlink = ref(null);

onBeforeMount(() => {
  if(ck_pms("create","other-customer")){
    Addlink.value = "/customers/add"
  }
});
</script>
