<template>
    <div>
    <title-bar class="p-4" :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="Device"
      has-table
      :addlink="Addlink"

    >
      <!-- table -->
      <DeviceTable />
    </card-component>
  </div>
</template>

<script setup>
import { ref , onBeforeMount } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import DeviceTable from "@/components/DeviceTable.vue";
import CardComponent from "@/components/CardComponent.vue";

const titleStack = ref(["Master Devices"]);
const Addlink = ref(null);

onBeforeMount(() => {
  if(ck_pms("create","device-mgr")){
    Addlink.value = "/device-list/add"
  }
});

</script>
