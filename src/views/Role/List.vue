<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="สถานะผู้ดูแล (Admin)"
      has-table
      addlink="/role/add"
    >
      <RoleTable/>
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
import RoleTable from '@/components/RoleTable.vue';

const titleStack = ref(["สถานะผู้ดูแล (Admin)"]);
</script>
