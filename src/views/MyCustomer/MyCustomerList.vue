<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component class="m-4"
      :icon="mdiMonitorCellphone"
      title="ผู้ใช้งานแพลตฟอร์ม"
      has-table>
      <!-- table -->
      <MyCustomerTable />
    </card-component>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import MyCustomerTable from "@/components/MyCustomerTable.vue";
import CardComponent from "@/components/CardComponent.vue";

const titleStack = ref(["My Customers", "ผู้ใช้งานแพลตฟอร์ม"]);
</script>
