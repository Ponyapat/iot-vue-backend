<script setup>
import { ref, reactive , onMounted } from "vue";
import { useRouter } from "vue-router";
import { mdiBallot, mdiBallotOutline, mdiAccount, mdiMail } from "@mdi/js";
import MainSection from "@/components/MainSection.vue";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import FilePicker from "@/components/FilePicker.vue";
import HeroBar from "@/components/HeroBar.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import Divider from "@/components/Divider.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import BottomOtherPagesSection from "@/components/BottomOtherPagesSection.vue";
import TitledSection from "@/components/TitledSection.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import axios from "axios"; 
import Swal from "sweetalert2";

const titleStack = ref(["Admin", "แก้ไขข้อมูลภูมิอากาศ"]);

const router = useRouter();
const url = window.location.href;
const id = url.split("/")[5];

const form = reactive({
  title: "",
  detail: "",
  lat: "",
  long: "",
  date: "2022-07-02",
  rain_volume: "",
  weather_condition: "",
  wind_speed: "",
  wind_direction: "",
  max_temperature: "",
  min_temperature: "",
  surface_pressure: "",
});

onMounted(async () => {
  const token = localStorage.getItem("tkfw");
  await axios
      .get(import.meta.env.VITE_API_ENDPOINT + "/api/weather/"+id,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(response => {
        console.log(response.data)

        form.title=response.data.data.title
        form.detail=response.data.data.detail
        form.lat=response.data.data.lat
        form.long=response.data.data.lon

        form.date=response.data.data.date
        form.rain_volume=response.data.data.rainVolume
        form.weather_condition=response.data.data.weatherCondition
        form.wind_speed=response.data.data.windSpeed
        form.wind_direction=response.data.data.windDirection
        
        form.max_temperature=response.data.data.maxTemperature
        form.min_temperature=response.data.data.minTemperature
        form.surface_pressure=response.data.data.surfacePressure
      })
})

const submit = () => {
  const token = localStorage.getItem("tkfw");
  console.log(token);
  console.log(form);
  axios
    .put(
      import.meta.env.VITE_API_ENDPOINT + "/api/weather/"+id,
      {
        title: form.title,
        detail: form.detail,
        lat: form.lat,
        lon: form.long,
        date: form.date,
        rainVolume: form.rain_volume,
        weatherCondition: form.weather_condition,
        windSpeed: form.wind_speed,
        windDirection: form.wind_direction,
        maxTemperature: form.max_temperature,
        minTemperature: form.min_temperature,
        surfacePressure: form.surface_pressure,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((data) => {
      console.log(data.data);
      if (data.data.status == 204) {
        console.log(data.data.status);
        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลภูมิอากาศ สำเร็จ",
          timer: 2500,
          showConfirmButton: 1,
        });
        router.push("/weather");
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถแก้ไขข้อมูลภูมิอากาศได้",
          timer: 3000,
          showConfirmButton: 1,
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  //
};
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <!-- <hero-bar>Forms</hero-bar> -->

  <main-section>
    <!-- <title-sub-bar
      :icon="mdiBallotOutline"
      title="Forms example"
    /> -->
    <card-component
      title="กรอกข้อมูลอากาศ"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <field label="หัวข้อ" placeholder="กรอกชื่อหัวข้อ">
        <control
          v-model="form.title"
          type="text"
          placeholder="กรอกชื่อหัวข้อ"
        />
      </field>

      <field label="รายละเอียด">
        <control
          v-model="form.detail"
          type="text"
          placeholder="กรอกรายละเอียด"
        />
      </field>

      <field label="พิกัดที่ดิน" help="Latitude , Longitude">
        <control v-model="form.lat" type="text" placeholder="พิกัดละติจูด" />
        <control v-model="form.long" type="text" placeholder="พิกัดลองจิจูด" />
      </field>

      <divider />

      <field label="วันที่วัดค่า">
        <control
          v-model="form.date"
          type="text"
          placeholder="วันที่วัดค่า"
        />
      </field>

      <field label="ปริมาณฝนรวม 24 ชม.">
        <control
          v-model="form.rain_volume"
          type="text"
          placeholder="ปริมาณฝนรวม 24 ชม."
        />
      </field>

      <field label="สภาพอากาศโดยทั่วไป">
        <control
          v-model="form.weather_condition"
          type="text"
          placeholder="สภาพอากาศโดยทั่วไป"
        />
      </field>

      <field label="ความเร็วลม">
        <control
          v-model="form.wind_speed"
          type="text"
          placeholder="ความเร็วลม"
        />
      </field>

      <field label="ทิศทางลม">
        <control
          v-model="form.wind_direction"
          type="text"
          placeholder="ทิศทางลม"
        />
      </field>

      <field label="อุณหภูมิสูงสุด ที่ระดับพื้นผิว">
        <control
          v-model="form.max_temperature"
          type="text"
          placeholder="อุณหภูมิสูงสุด ที่ระดับพื้นผิว"
        />
      </field>
      <field label="อุณหภูมิต่ำสุด ที่ระดับพื้นผิว">
        <control
          v-model="form.min_temperature"
          type="text"
          placeholder="อุณหภูมิต่ำสุด ที่ระดับพื้นผิว"
        />
      </field>
      <field label="ความกดอากาศที่ระดับพื้นผิว">
        <control
          v-model="form.surface_pressure"
          type="text"
          placeholder="ความกดอากาศที่ระดับพื้นผิว"
        />
      </field>
      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="อัพเดท" />
      </jb-buttons>
    </card-component>
  </main-section>

  <bottom-other-pages-section />
</template>
