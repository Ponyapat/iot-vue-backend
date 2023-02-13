<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ภูมิศาสตร์ข้อมูลกลาง"
      has-table
      :addlink="Addlink"
    >
      <GeographyTableBase />
    </card-component>
  </div>
</template>

<script setup>
import { mdiMonitorCellphone, mdiAccountMultiple, mdiTableBorder, mdiTableOff } from '@mdi/js'
import { computed, ref, onMounted , onBeforeMount } from "vue";
import { useMainStore } from "@/stores/main";
import TitleBar from "@/components/TitleBar.vue";
import HeroBar from "@/components/HeroBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import GeographyTableBase from '@/components/ListData/GeographyBase.vue'

const titleStack = ref(["ภูมิศาสตร์(ข้อมูลกลาง)"]);
const Addlink = ref(null);

onBeforeMount(() => {
  if(ck_pms("create","geography-base")){
    Addlink.value = "/geography_base/form"
  }
});

</script>
