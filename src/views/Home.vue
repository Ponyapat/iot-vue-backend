<script setup> 
import { computed, ref, onMounted , onBeforeMount } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiFruitCherries,mdiShield,mdiHumanChild
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
import { useRouter } from "vue-router";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const titleStack = ref(["Admin", "Dashboard"]);

const router = useRouter();
let url = new URL(window.location.href);
const code_line = url.searchParams.get("code");

const line_access_token = ref('');

onMounted(()=>{
  console.log('code line == ',code_line);
  if(code_line){
    router.push(`line-group?code=${code_line}`);
  }



  

})

const chartData = ref(null);
const states = reactive({
  geoCountItem: 0,
  weatherCountItem: 0,
  customerCountItem: 0,
  breedCountItem:0,
  user_platform : 0,


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

const token = localStorage.getItem("tkfw");

let warrantyExpired = ref(0) ; // วันหมดอายุประกัน
let warrantyTotal = ref(0) ;



let board_online = ref(0);
let board_offline = ref(0);
let percent_online = ref(0);


// Chart

onMounted(()=>{

  fetchData();

  let obj_plants = [] ;
  let obj_cusotmers = [] ;

  ApiCore.get('/v2/get-dashboard').then((response) => {
    console.log(response.data);

    warrantyTotal.value = response.data.warrantyTotal ;
    board_online.value = response.data.online ;
    board_offline.value = response.data.offline ;

    const data = {'online':response.data.online,'offline':response.data.offline};
    const totalCount = Object.values(data).reduce((sum, count) => sum + count);
    const percentages = {};
    for (const category in data) {
      const count = data[category];
      const percentage = count / totalCount * 100;
      percentages[category] = percentage;
    }
    percent_online.value = percentages.online
    // console.log(percentages.online,percentages.offline);

  }).catch((error)=>{
    console.log(error);
  })
  ApiMain.get('/dashboard').then((response) => {

    // ลูกค้า
    let customers = response.data.data.otherCustomerTotal ;
    for (const [key, value] of Object.entries(customers)) {
      if(key){
        obj_cusotmers.push({[key]:value});
      }
      else{
        obj_cusotmers.push({'Other':value});
      }
    }
    let result_customer = Object.assign({}, ...obj_cusotmers) ;

    console.log(result_customer);

    // พืชพรรณ
    let array_plants = response.data.data.breedTotal ;
    array_plants.forEach(element => {
      obj_plants.push(element.total);
    });

    let ctx1 = document.getElementById('chart1');
    let myChart1 = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['พืชไร่', 'ผลไม้', 'ผัก'],
        datasets: [{
          label: 'พืชพรรณ',
          data: obj_plants,
          backgroundColor: ['#76A9FA', '#F98080', '#3cba9f']
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
      }
    });
  var ctx2 = document.getElementById('chart2')
  var myChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['B2B', 'B2C', 'Dealer', 'Seller','Dropship','Other'],
      datasets: [{
        label: 'ลูกค้า',
        data: [result_customer.B2B,result_customer.B2C , result_customer.Dealer, result_customer.Seller,result_customer.Dropship,result_customer.Other],
        borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgba(201, 203, 207)',
    ],
      backgroundColor: [
      'rgb(255, 99, 132,0.6)',
      'rgba(255, 205, 86,0.6)',
      'rgba(75, 192, 192,0.6)',
      'rgba(54, 162, 235,0.6)',
      'rgba(153, 102, 255,0.6)',
      'rgba(201, 203, 207, 0.6)',
      ],
      borderWidth: 2,
    }]
    },
    options: {

    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        color: '#000',
        anchor:'end',
        align:'top',
      },
      legend: {
        display: false,
      },

    },
    scales: {
            y: {
                beginAtZero: true,
                max: 1000,
                ticks: {
                    stepSize: 50
                }
            }
        },
  },
  plugins: [ChartDataLabels]
  });
  }).catch((error)=>{
    console.log(error);
  })
});



const fetchData =()=>{
  ApiSso.get("/api/mgr/users?page=1", {
    auth: {
      username: 'admin',
      password: import.meta.env.VITE_PASS_CUSTOMER
    },
    headers: {
      Authorization: "Bearer " + token,
    }

  }).then((respones) => {

    states.user_platform = respones.data.total_record;
  });
};
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
    <div class="grid grid-cols-1 gap-2 lg:grid-cols-4 mb-6">
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
      <!-- <card-widget
        v-if="states.weatherCountItem>0"
        trend-type="down"
        color="text-yellow-500"
        :icon="mdiWeatherPartlyRainy"
        :number="states.weatherCountItem"
        label="ภูมิอากาศ"
      /> -->
      <card-widget
        v-if="states.weatherCountItem>0"
        trend-type="down"
        color="text-gray-500"
        :icon="mdiHumanChild"
        :number="states.user_platform"
        label="ผู้ใช้งานแพลตฟอร์ม"
      />
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-lg leading-tight text-gray-500 dark:text-gray-400 mb-2">Board</h3>
       <div class="flex flex-col">
        <span class="text-sm mb-1">ออนไลน์ {{ board_online }}</span>
        <div class="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
          <div class="bg-green-600 h-3 rounded-full" style="width:0%" :style="{'width':percent_online+'%'}"></div>
        </div>
        <div class="self-end">
          <span class="text-sm mt-1">ออฟไลน์ {{board_offline}}</span>
        </div>
       </div>
      </div>
      <card-widget
        v-if="states.breedCountItem>0"
        trend-type="alert"
        color="text-blue-500"
        :icon="mdiShield"
        :number="warrantyTotal"
        label="การรับประกัน"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4 shadow-sm">
      <div class="col-span-1 md:col-span-2 w-full h-[450px] bg-white shadow-lg rounded-lg p-10">
        <h1 class="text-lg leading-tight text-gray-700 font-bold mb-2">พืชพรรณ</h1>
        <div>
          <canvas id="chart1" ></canvas>
        </div>
      </div>
      <div class="col-span-1 md:col-span-4 w-full h-[450px] bg-white shadow-lg rounded-lg p-10">
        <h1 class="text-lg leading-tight text-gray-700 font-bold  mb-2">จำนวนลูกค้า(ฝ่ายขาย)</h1>
        <span class=" ml-4 text-sm">(คน)</span>
        <div>
          <canvas id="chart2" style="height: 350px ;"></canvas>
        </div>
    </div>


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
