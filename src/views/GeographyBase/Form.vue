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

let titleStack = ref(["Admin", "เพิ่มข้อมูลภูมิศาสตร์(ข้อมูลกลาง)"]);
const router = useRouter();

let url = new URL(window.location.href);
const id = url.searchParams.get("id");
let type_form = ref("เพิ่ม");

const form = reactive({
  province: [],
  province_id: "",
  province_name: "",

  district: [],
  district_id: "",
  district_name: "",

  subdistrict: [],
  subdistrict_id: "",
  subdistrict_name: "",

  provinceId: "",
  districtId: "",
  subdistrictId: "",
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
  nearbyNaturalWater: "",
  nearbyInfarmWater: "",
  nearbySmallWater: "",
  nearbyGroundWater: "",
});

onMounted(() => {
  if (id) {
    type_form.value = "แก้ไขข้อมูล";
    titleStack.value = ["Admin", "แก้ไขข้อมูลภูมิศาสตร์(ข้อมูลกลาง)"];
    ApiMain.get("/geobase/" + id).then((response) => {
      const geobase = response.data.data
      form.spaceNatureAll= [(geobase.spaceNaturePlain=="true"?"spaceNaturePlain":""),(geobase.spaceNaturePlateau=="true"?"spaceNaturePlateau":""),geobase.spaceNatureHill=="true"?"spaceNatureHill":"",geobase.spaceNatureMountain=="true"?"spaceNatureMountain":""]
      form.province_id = geobase.provinceId;
      form.province_name = geobase.provinceName;
      select_province(geobase.provinceId,"edit");

      form.district_id = geobase.districtId;
      form.district_name = geobase.districtName;
      select_district(geobase.districtId,"edit")

      form.subdistrict_id = geobase.subdistrictId;
      form.subdistrict_name = geobase.subdistrictName;
      select_subdistrict(geobase.subdistrictId,"edit");

      form.soilProperties = geobase.soilProperties
      form.topsoilDetail= geobase.topsoilDetail
      form.topsoilValueMin= geobase.topsoilValueMin
      form.topsoilValueMax= geobase.topsoilValueMax
      form.subsoilDetail= geobase.subsoilDetail
      form.subsoilValueMin= geobase.subsoilValueMin
      form.subsoilValueMax= geobase.subsoilValueMax
      form.soilFertility= geobase.soilFertility
      form.soilRestrictions= geobase.soilRestrictions
      form.spaceNatureDetail= geobase.spaceNatureDetail
      form.slope= geobase.slope
      form.drainage= geobase.drainage
      form.nearbyNaturalWater= geobase.nearbyNaturalWater
      form.nearbyInfarmWater= geobase.nearbyInfarmWater
      form.nearbySmallWater= geobase.nearbySmallWater
      form.nearbyGroundWater= geobase.nearbyGroundWater
    });
  }
  ApiSso.get("/api/geo/provinces").then((response) => {
    form.province = response.data.data;
  });
});

const select_province = (event, type = "post") => {
  let id = ""
  if(type == "edit"){
     id = event
  }else{
     id = event.target.value
     form.province_name = event.target.options[event.target.selectedIndex].text
  }
  //console.log(event.target.options[event.target.selectedIndex].text); //name
  ApiSso.get("/api/geo/provinces/" + id + "/districts").then(
    (response) => {
      form.district = response.data.data;
      if (type == "post") {
        form.district_id = "";
        form.subdistrict_id = "";
      }
    }
  );
};

const select_district = (event, type = "post") => {
  let id = ""
  if(type == "edit"){
     id = event
  }else{
     id = event.target.value
     form.district_name = event.target.options[event.target.selectedIndex].text
     console.log(form.district_name)
  }
  ApiSso.get(
    "/api/geo/provinces/" +
      form.province_id +
      "/districts/" +
      id +
      "/sub-districts"
  ).then((response) => {
    form.subdistrict = response.data.data;
    if (type == "post") {
      form.subdistrict_id = "";
    }
  });
};

const select_subdistrict = (event, type = "post") => {
  let id = ""
  if(type == "edit"){
     id = event
  }else{
     form.subdistrict_name = event.target.options[event.target.selectedIndex].text
  }
  ApiSso.get(
    "/api/geo/provinces/" +
      form.province_id +
      "/districts/" +
      form.district_id +
      "/sub-districts"
  ).then((response) => {
    form.subdistrict = response.data.data;
  });
};

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

  if (id) {
    //console.log(form.soilFertility + " " +form.drainage)
    ApiMain.put("/geobase/"+id, {
      provinceId: form.province_id,
      districtId: form.district_id,
      subdistrictId: form.subdistrict_id,
      provinceName: form.province_name,
      districtName: form.district_name,
      subdistrictName: form.subdistrict_name,

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
    })
      .then((data) => {
        console.log(data.data);
        if (data.data.status == 204) {
          console.log(data.data.status);
          Swal.fire({
            icon: "success",
            html: "แก้ไขข้อมูลภูมิศาสตร์(ข้อมูลกลาง) สำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
          router.push("/geography_base");
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
  } else {
    console.log({
      provinceId: form.province_id,
      districtId: form.district_id,
      subdistrictId: form.subdistrict_id,

      provinceName: form.province_name,
      districtName: form.district_name,
      subdistrictName: form.subdistrict_name,

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
    })
    ApiMain.post("/geobase", {
      provinceId: form.province_id,
      districtId: form.district_id,
      subdistrictId: form.subdistrict_id,

      provinceName: form.province_name,
      districtName: form.district_name,
      subdistrictName: form.subdistrict_name,

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
    })
      .then((data) => {
        console.log(data.data);
        if (data.data.status == 201) {
          console.log(data.data.status);
          Swal.fire({
            icon: "success",
            html: "เพิ่มข้อมูลภูมิศาสตร์(ข้อมูลกลาง) สำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
          router.push("/geography_base");
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถเพิ่มข้อมูลภูมิศาสตร์ได้",
            timer: 3000,
            showConfirmButton: 1,
          });
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
      title="กรอกข้อมูลภูมิศาสตร์(ข้อมูลกลาง)"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <field label="จังหวัด">
          <select
            required
            @change="select_province($event)"
            id="province"
            v-model="form.province_id"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option v-for="i in form.province" :value="i.id" :key="i.id">
              {{ i.name.th }}
            </option>
          </select>
        </field>

        <field label="อำเภอ">
          <select
            required
            @change="select_district($event)"
            id="district"
            v-model="form.district_id"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option v-for="i in form.district" :value="i.id" :key="i.id">
              {{ i.name.th }}
            </option>
          </select>
        </field>

        <field label="ตำบล">
          <select
            required
            @change="select_subdistrict($event)"
            id="subdistrict"
            v-model="form.subdistrict_id"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option v-for="i in form.subdistrict" :value="i.id" :key="i.id">
              {{ i.name.th }}
            </option>
          </select>
        </field>
      </div>

      <field label="คุณสมบัติของดิน">
        <control
          v-model="form.soilProperties"
          type="textarea"
          col="10"
          placeholder="คุณสมบัติของดิน"
        />
      </field>

      <field label="ดินชั้นบน">
        <control
          v-model="form.topsoilDetail"
          type="text"
          placeholder="รายละเอียดดินชั้นบน"
        />
      </field>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <field label="ค่าPH ดิดชั้นบน ต่ำสุด">
          <control
            v-model="form.topsoilValueMin"
            type="text"
            placeholder="ค่าPH ดิดชั้นบน ต่ำสุด"
          />
        </field>

        <field label="ค่าPH ดิดชั้นบน สูงสุด">
          <control
            v-model="form.topsoilValueMax"
            type="text"
            placeholder="ค่าPH ดิดชั้นบน สูงสุด"
          />
        </field>
      </div>

      <field label="ดินชั้นล่าง">
        <control
          v-model="form.subsoilDetail"
          type="text"
          placeholder="รายละเอียดดินชั้นล่าง"
        />
      </field>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <field label="ค่าPH ดินชั้นล่าง ต่ำสุด">
          <control
            v-model="form.subsoilValueMin"
            type="text"
            placeholder="ค่าPH ดินชั้นล่าง ต่ำสุด"
          />
        </field>

        <field label="ค่าPH ดินชั้นล่าง สูงสุด">
          <control
            v-model="form.subsoilValueMax"
            type="text"
            placeholder="ค่าPH ดินชั้นล่าง สูงสุด"
          />
        </field>
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
          v-model="form.soilRestrictions"
          type="text"
          placeholder="ข้อจํากัดของดิน"
        />
      </field>
      <!--<divider /> -->
      <field label="ความชัน">
        <control v-model="form.slope" type="number" placeholder="ความชัน" />
      </field>

      <field label="รายละเอียดลักษณะของพื้นที่">
        <control
          v-model="form.spaceNatureDetail"
          type="text"
          placeholder="รายละเอียดลักษณะของพื้นที่"
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
            <control v-model="form.nearbyNaturalWater" type="number" />
          </field>
          <field label="แหล่งน้ำในไร่นานอกเขตชลประทาน">
            <control v-model="form.nearbyInfarmWater" type="number" />
          </field>
          <field label="แหล่งน้ำขนาดเล็ก">
            <control v-model="form.nearbySmallWater" type="number" />
          </field>
          <field label="บ่อน้ำบาดาล">
            <control v-model="form.nearbyGroundWater" type="number" />
          </field>
        </div>
      </field>
      <divider />
      <jb-buttons>
        <jb-button type="submit" color="info" :label="type_form" />
        <jb-button type="reset" color="info" outline label="รีเซต" />
      </jb-buttons>
    </card-component>
  </main-section>
  <bottom-other-pages-section />
</template>
