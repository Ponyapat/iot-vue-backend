<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />

    <card-component
      :icon="mdiMonitorCellphone"
      title="ผู้ดูแล (Admin)"
      has-table
      addlink="/user/add"
    >
      <UsersTable />
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
import UsersTable from '@/components/UsersTable.vue';

const titleStack = ref(["ผู้ดูแลระบบ"]);
</script>
