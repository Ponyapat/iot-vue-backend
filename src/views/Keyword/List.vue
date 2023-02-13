<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="คำค้นหาสถานที่"
      has-table
      :addlink="Addlink"
    >
      <KeywordTable/>
    </card-component>
  </div>
</template>
<script setup>
import { mdiMonitorCellphone, mdiAccountMultiple, mdiTableBorder, mdiTableOff } from '@mdi/js'
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import TitleBar from "@/components/TitleBar.vue";
import HeroBar from "@/components/HeroBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import KeywordTable from '@/components/KeywordTable.vue';

const titleStack = ref(["คำค้นหาสถานที่"]);
const Addlink = ref(null);
onMounted(() => {
  if(ck_pms("create","keyword")){
    Addlink.value = "/keyword/add"
  }
});
</script>
