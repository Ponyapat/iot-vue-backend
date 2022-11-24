<script setup>
import { ref, reactive, onMounted } from "vue";
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
import Swal from "sweetalert2";

const titleStack = ref(["ADMIN", "แก้ไขข้อมูลภูมิศาสตร์(ข้อมูลลูกค้า)"]);

const router = useRouter();
const url = window.location.href;
const id = url.split("/")[5];

const form = reactive({
  customerId: 0,
  projectId: 0,
  lat: "",
  lon: "",

  soilProperties: "",
  topsoilDetail: "",
  topsoilValueMin: "",
  topsoilValueMax: "",
  subsoilDetail: "",
  subsoilValueMin: "",
  subsoilValueMax: "",
  soilFertility: "high",
  soilRestrictions: "",
  spaceNatureDetail: "",
  spaceNatureAll: [],
  spaceNaturePlain: false,
  spaceNaturePlateau: false,
  spaceNatureHill: false,
  spaceNatureMountain: false,
  slope: "",
  drainage: "high",
  nearbyNaturalWater: 0,
  nearbyInfarmWater: 0,
  nearbySmallWater: 0,
  nearbyGroundWater: 0,
});

onMounted(() => {
  ApiMain.get("/geo/" + id).then((response) => {
    const geobase = response.data.data;
    form.customerId = geobase.customerId;
    form.projectId = geobase.projectId;
    form.lat = geobase.lat;
    form.lon = geobase.lon;
    form.spaceNatureAll = [
      geobase.spaceNaturePlain == "true" ? "spaceNaturePlain" : "",
      geobase.spaceNaturePlateau == "true" ? "spaceNaturePlateau" : "",
      geobase.spaceNatureHill == "true" ? "spaceNatureHill" : "",
      geobase.spaceNatureMountain == "true" ? "spaceNatureMountain" : "",
    ];
    form.soilProperties = geobase.soilProperties;
    form.topsoilDetail = geobase.topsoilDetail;
    form.topsoilValueMin = geobase.topsoilValueMin;
    form.topsoilValueMax = geobase.topsoilValueMax;
    form.subsoilDetail = geobase.subsoilDetail;
    form.subsoilValueMin = geobase.subsoilValueMin;
    form.subsoilValueMax = geobase.subsoilValueMax;
    form.soilFertility = geobase.soilFertility;
    form.soilRestrictions = geobase.soilRestrictions;
    form.spaceNatureDetail = geobase.spaceNatureDetail;
    form.slope = geobase.slope;
    form.drainage = geobase.drainage;
    form.nearbyNaturalWater = geobase.nearbyNaturalWater;
    form.nearbyInfarmWater = geobase.nearbyInfarmWater;
    form.nearbySmallWater = geobase.nearbySmallWater;
    form.nearbyGroundWater = geobase.nearbyGroundWater;
  });
});

const submit = () => {
  form.spaceNatureAll.forEach((element) => {
    console.log(element);
    if (element == "spaceNaturePlain") {
      form.spaceNaturePlain = true;
    }
    if (element == "spaceNaturePlateau") {
      form.spaceNaturePlateau = true;
    }
    if (element == "spaceNatureHill") {
      form.spaceNatureHill = true;
    }
    if (element == "spaceNatureMountain") {
      form.spaceNatureMountain = true;
    }
  });

  ApiMain.put("/geo/" + id, {
    customerId: form.customerId,
    projectId: form.projectId,
    lat: form.lat,
    lon: form.lon,
    soilProperties: form.soilProperties,
    topsoilDetail: form.topsoilDetail,
    topsoilValueMin: form.topsoilValueMin,
    topsoilValueMax: form.topsoilValueMax,
    subsoilDetail: form.subsoilDetail,
    subsoilValueMin: form.subsoilValueMin,
    subsoilValueMax: form.subsoilValueMax,
    soilFertility: form.soilFertility,
    soilRestrictions: form.soilRestrictions,
    spaceNatureDetail: form.spaceNatureDetail,
    spaceNaturePlain: form.spaceNaturePlain,
    spaceNaturePlateau: form.spaceNaturePlateau,
    spaceNatureHill: form.spaceNatureHill,
    spaceNatureMountain: form.spaceNatureMountain,
    slope: form.slope,
    drainage: form.drainage,
    nearbyNaturalWater: form.nearbyNaturalWater,
    nearbyInfarmWater: form.nearbyInfarmWater,
    nearbySmallWater: form.nearbySmallWater,
    nearbyGroundWater: form.nearbyGroundWater,
    status: "active",
  })
    .then((data) => {
      //onsole.log(data.data);
      if (data.data.status == 204) {
        console.log(data.data.status);
        Swal.fire({
          icon: "success",
          html: "แก้ไขข้อมูลภูมิศาสตร์(ข้อมูลลูกค้า) สำเร็จ",
          timer: 2500,
          showConfirmButton: 1,
        });
        router.push("/geography");
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถแก้ไขข้อมูลภูมิศาสตร์ได้",
          timer: 3000,
          showConfirmButton: 1,
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      title="กรอกข้อมูลภูมิศาสตร์(ข้อมูลกลาง)"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <div>
          <label>FarmID : {{form.projectId}}</label>
        </div>
        <div>
          <label>ละติจูด : {{form.lat}}</label>
        </div>
        <div>
          <label>ลองติจูด : {{form.lon}}</label>
        </div>
      </div>

      <field label="คุณสมบัติของดิน">
        <control
          v-model="form.soilProperties"
          type="textarea"
          required
          col="10"
          placeholder="กรอกคุณสมบัติของดิน"
        />
      </field>

      <field label="ดินชั้นบน">
        <control
          v-model="form.topsoilDetail"
          type="text"
          required
          placeholder="กรอกรายละเอียดดินชั้นบน"
        />
      </field>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div>
          <label>ค่าPH ดิดชั้นบน ต่ำสุด</label>
          <input
            type="number"
            required
            step="any"
            v-model="form.topsoilValueMin"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800"
          />
        </div>
        <div>
          <label>ค่าPH ดิดชั้นบน สูงสุด</label>
          <input
            type="number"
            required
            step="any"
            v-model="form.topsoilValueMax"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800"
          />
        </div>
      </div>

      <field label="ดินชั้นล่าง">
        <control
          required
          v-model="form.subsoilDetail"
          type="text"
          placeholder="กรอกรายละเอียดดินชั้นล่าง"
        />
      </field>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div>
          <label>ค่าPH ดินชั้นล่าง ต่ำสุด</label>
          <input
            required
            type="number"
            step="any"
            v-model="form.subsoilValueMin"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800"
          />
        </div>
        <div>
          <label>ค่าPH ดินชั้นล่าง สูงสุด</label>
          <input
            required
            type="number"
            step="any"
            v-model="form.subsoilValueMax"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800"
          />
        </div>
      </div>

      <field label="ความอุดมสมบูรณ์">
        <check-radio-picker
          name="soilFertility"
          v-model="form.soilFertility"
          type="radio"
          :options="{ low: 'ต่ำ', medium: 'กลาง', high: 'สูง' }"
        />
      </field>

      <field label="การระบายน้ำ">
        <check-radio-picker
          name="drainage"
          v-model="form.drainage"
          type="radio"
          :options="{ low: 'ต่ำ', medium: 'กลาง', high: 'สูง' }"
        />
      </field>
      <field label="ข้อจํากัดของดิน">
        <control
          required
          v-model="form.soilRestrictions"
          type="text"
          placeholder="กรอกข้อจํากัดของดิน"
        />
      </field>
      <!--<divider /> -->
      <field label="ความชัน(หน่วยเมตร)">
        <control
          required
          v-model="form.slope"
          type="number"
          placeholder="กรอกความชัน(หน่วยเมตร)"
        />
      </field>

      <field label="รายละเอียดลักษณะของพื้นที่">
        <control
          required
          v-model="form.spaceNatureDetail"
          type="text"
          placeholder="กรอกรายละเอียดลักษณะของพื้นที่"
        />
      </field>
      <field label="ลักษณะของพื้นที่">
        <check-radio-picker
          v-model="form.spaceNatureAll"
          name="spaceNature"
          :options="{
            spaceNaturePlain: 'ที่ราบเรียบ',
            spaceNaturePlateau: 'ที่ราบสูง',
            spaceNatureHill: 'เนินเขา',
            spaceNatureMountain: 'ภูเขา',
          }"
        />
      </field>

      <divider />
      <field label="แหล่งน้ำใกล้เคียง">
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-3">
          <field label="แหล่งน้ำธรรมชาติ">
            <control v-model="form.nearbyNaturalWater" type="number" required/>
          </field>
          <field label="แหล่งน้ำในไร่นานอกเขตชลประทาน">
            <control v-model="form.nearbyInfarmWater" type="number" required/>
          </field>
          <field label="แหล่งน้ำขนาดเล็ก">
            <control v-model="form.nearbySmallWater" type="number" required/>
          </field>
          <field label="บ่อน้ำบาดาล">
            <control v-model="form.nearbyGroundWater" type="number" required/>
          </field>
        </div>
      </field>
      <divider />
      <jb-buttons>
        <jb-button type="submit" color="info" label="อัพเดท" />
        <jb-button type="reset" color="info" outline label="รีเซต" />
      </jb-buttons>
    </card-component>
  </main-section>
  <bottom-other-pages-section />
</template>
