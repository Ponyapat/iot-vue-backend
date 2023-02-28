<script setup>
import { computed, ref, onMounted , onBeforeMount } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiFruitCherries
} from '@mdi/js'
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiFinance,
  mdiMonitorCellphone,
  mdiReload,
  mdiGithub,
  mdiChartPie,
  mdiWeatherPartlyRainy,
  mdiEarth,
  mdiAccount,
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import LineChart from "@/components/Charts/LineChart.vue";
import MainSection from "@/components/MainSection.vue";
import TitleBar from "@/components/TitleBar.vue";
import HeroBar from "@/components/HeroBar.vue";
import CardWidget from "@/components/CardWidget.vue";
import CardComponent from "@/components/CardComponent.vue";
import ClientsTable from "@/components/ClientsTable.vue";
import Notification from "@/components/Notification.vue";
import JbButton from "@/components/JbButton.vue";
import CardTransactionBar from "@/components/CardTransactionBar.vue";
import CardClientBar from "@/components/CardClientBar.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import { reactive } from "vue";
import axios from "axios";

const titleStack = ref(["Admin", "Dashboard"]);

const chartData = ref(null);
const states = reactive({
  geoCountItem: 0,
  weatherCountItem: 0,
  customerCountItem: 0,
  breedCountItem:0
});

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

const geoData = () => {
  if(ck_pms("read","geography-base")){
    ApiMain.get("/geobase")
    .then((data) => {
      states.geoCountItem = data.data.meta.itemCount;
    })
    .catch((error) => {
      console.log(error);
    });
  }
};

const geoBreedData = () => {
  if(ck_pms("read","breed")){
    ApiMain.get("/breed")
    .then((data) => {
      states.breedCountItem = data.data.meta.itemCount;
    })
    .catch((error) => {
      console.log(error);
    });
  }
};

const weatherData = () => {
  if(ck_pms("read","weather")){
    ApiMain.get("/weather")
    .then((data) => {
      states.weatherCountItem = data.data.meta.itemCount;
    })
    .catch((error) => {
      console.log(error);
    });
  }
};

onBeforeMount(() => {
  fillChartData();
  geoData();
  weatherData();
  geoBreedData();
});

const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.clients.slice(0, 3));

const transactionBarItems = computed(() => mainStore.history.slice(0, 3));

const darkMode = computed(() => mainStore.darkMode);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Dashboard</hero-bar>
  <main-section>
    <!-- <notification
      color="info"
      :icon="mdiGithub"
    >
      <a
        href="https://github.com/justboil/admin-one-vue-tailwind"
        class="underline"
        target="_blank"
      >GitHub</a>
      <template #right>
        <jb-button
          href="https://github.com/justboil/admin-one-vue-tailwind"
          :icon="mdiGithub"
          :outline="darkMode"
          label="GitHub"
          target="_blank"
          small
        />
      </template>
    </notification> -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
      <!-- 
        trend="12%"
        prefix="$" 
      -->
      <card-widget
        v-if="states.geoCountItem>0"
        trend-type="up"
        color="text-emerald-500"
        :icon="mdiEarth"
        :number="states.geoCountItem"
        label="ภูมิศาสตร์(ข้อมูลกลาง)"
      />
      <card-widget
        v-if="states.weatherCountItem>0"
        trend-type="down"
        color="text-yellow-500"
        :icon="mdiWeatherPartlyRainy"
        :number="states.weatherCountItem"
        label="ภูมิอากาศ"
      />
      <card-widget
         v-if="states.breedCountItem>0"
        trend-type="alert"
        color="text-blue-500"
        :icon="mdiFruitCherries"
        :number="states.breedCountItem"
        label="พืชพันธ์ผลไม้"
      />
    </div>

    <!-- <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <div class="flex flex-col justify-between">
        <card-transaction-bar
          v-for="(transaction,index) in transactionBarItems"
          :key="index"
          :amount="transaction.amount"
          :date="transaction.date"
          :business="transaction.business"
          :type="transaction.type"
          :name="transaction.name"
          :account="transaction.account"
        />
      </div>
      <div class="flex flex-col justify-between">
        <card-client-bar
          v-for="client in clientBarItems"
          :key="client.id"
          :name="client.name"
          :login="client.login"
          :date="client.created"
          :progress="client.progress"
        />
      </div>
    </div> -->

    <!-- <title-sub-bar
      :icon="mdiChartPie"
      title="Trends overview"
    /> -->

    <!-- <card-component
      title="Performance"
      :icon="mdiFinance"
      :header-icon="mdiReload"
      class="mb-6"
      @header-icon-click="fillChartData"
    >
      <div v-if="chartData">
        <line-chart
          :data="chartData"
          class="h-96"
        />
      </div>
    </card-component> -->

    <!-- <title-sub-bar
      :icon="mdiAccountMultiple"
      title="Clients"
    /> -->

    <!-- <notification
      color="info"
      :icon="mdiMonitorCellphone"
    >
      <b>Responsive table.</b> Collapses on mobile
    </notification> -->

    <!-- <card-component
      :icon="mdiMonitorCellphone"
      title="Responsive table"
      has-table
    >
      <clients-table />
    </card-component> -->
  </main-section>
</template>
