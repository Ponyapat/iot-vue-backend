<script setup>
import { ref, reactive, onMounted, computed } from "vue";
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
const edit_id = url.searchParams.get("id");
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
  getProvinceAll();
  if (edit_id) {
    type_form.value = "แก้ไขข้อมูล";
    titleStack.value = ["Admin", "แก้ไขข้อมูลภูมิศาสตร์(ข้อมูลกลาง)"];
    ApiMain.get("/geobase/" + edit_id).then((response) => {
      const geobase = response.data.data
      form.spaceNatureAll = [(geobase.spaceNaturePlain == "true" ? "spaceNaturePlain" : ""), (geobase.spaceNaturePlateau == "true" ? "spaceNaturePlateau" : ""), geobase.spaceNatureHill == "true" ? "spaceNatureHill" : "", geobase.spaceNatureMountain == "true" ? "spaceNatureMountain" : ""]
      form.province_id = geobase.provinceId;
      form.province_name = geobase.provinceName;

      searchProvince.value = geobase.provinceName;
      searchDistrict.value = geobase.districtName;
      searchSubDistrict.value = geobase.subdistrictName;

      form.district_id = geobase.districtId;
      form.district_name = geobase.districtName;

      form.subdistrict_id = geobase.subdistrictId;
      form.subdistrict_name = geobase.subdistrictName;

      ApiSso.get("/api/geo/provinces/" + form.province_id + "/districts").then((response) => {
        let obj = response.data.data;
        let arr_th = [];

        obj.forEach((element, index) => {
          arr_th.push(element.name.th);
        });

        let district = [];
        let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

        sort_name.forEach((name) => {
          let obj_district = obj.filter(x => x.name.th == name);
          district.push(obj_district[0]);
        });
        form.district = district;

        console.log('district in province == ', form.district);
      });

      ApiSso.get("/api/geo/provinces/" + form.province_id + "/districts/" + form.district_id + "/sub-districts").then((response) => {
        form.subdistrict = response.data.data;
      });


      form.soilProperties = geobase.soilProperties
      form.topsoilDetail = geobase.topsoilDetail
      form.topsoilValueMin = geobase.topsoilValueMin
      form.topsoilValueMax = geobase.topsoilValueMax
      form.subsoilDetail = geobase.subsoilDetail
      form.subsoilValueMin = geobase.subsoilValueMin
      form.subsoilValueMax = geobase.subsoilValueMax
      form.soilFertility = geobase.soilFertility
      form.soilRestrictions = geobase.soilRestrictions
      form.spaceNatureDetail = geobase.spaceNatureDetail
      form.slope = geobase.slope
      form.drainage = geobase.drainage
      form.nearbyNaturalWater = geobase.nearbyNaturalWater
      form.nearbyInfarmWater = geobase.nearbyInfarmWater
      form.nearbySmallWater = geobase.nearbySmallWater
      form.nearbyGroundWater = geobase.nearbyGroundWater
    });
  }
  else {
    ApiSso.get("/api/geo/provinces").then((response) => {
      let obj = response.data.data;
      let arr_th = [];

      obj.forEach((element, index) => {
        if (element.name.th == 'กรุงเทพมหานคร') {
          let x = 'จ. กรุงเทพมหานคร'
          arr_th.push(x);
        }
        else {
          arr_th.push(element.name.th);
        }
      });

      let province_arr = [];
      let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

      sort_name.forEach((name) => {
        let obj_province = obj.filter(x => x.name.th == name);
        if (obj_province.length == 0) {
          province_arr.push({ id: 10, name: { en: 'Bangkok', th: 'จ. กรุงเทพมหานคร' } });
        }
        else {
          province_arr.push(obj_province[0]);
        }
      });
      form.province = province_arr;
    });
  }

});
const sortThaiDictionary = (list) => {
  const newList = [...list]
  newList.sort((a, b) => a.localeCompare(b, 'th'))
  return newList
}


const getProvinceAll = () => {
  ApiSso.get("/api/geo/provinces").then((response) => {
    let obj = response.data.data;
    let arr_th = [];

    obj.forEach((element, index) => {
      if (element.name.th == 'กรุงเทพมหานคร') {
        let x = 'จ. กรุงเทพมหานคร'
        arr_th.push(x);
      }
      else {
        arr_th.push(element.name.th);
      }
    });

    let province_arr = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_province = obj.filter(x => x.name.th == name);
      if (obj_province.length == 0) {
        province_arr.push({ id: 10, name: { en: 'Bangkok', th: 'จ. กรุงเทพมหานคร' } });
      }
      else {
        province_arr.push(obj_province[0]);
      }
    });
    form.province = province_arr;
  });
}

const select_province = (data) => {
  searchProvince.value = data.provinceName || data.name.th;
  form.province_name = data.provinceName || data.name.th;
  form.province_id = data.id;
  ApiSso.get("/api/geo/provinces/" + form.province_id + "/districts").then((response) => {
    let obj = response.data.data;
    let arr_th = [];

    obj.forEach((element, index) => {
      arr_th.push(element.name.th);
    });

    let district = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_district = obj.filter(x => x.name.th == name);
      district.push(obj_district[0]);
    });
    form.district = district;

    console.log('district in province == ', form.district);
  });

};

const select_district = (data) => {
  searchDistrict.value = data.districtName || data.name.th;
  form.district_name = data.districtName || data.name.th;
  form.district_id = data.id;
  ApiSso.get("/api/geo/provinces/" + form.province_id + "/districts/" + form.district_id + "/sub-districts").then((response) => {
    let obj = response.data.data;
    let arr_th = [];

    obj.forEach((element, index) => {
      arr_th.push(element.name.th);
    });

    let subdistrict = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_subdistrict = obj.filter(x => x.name.th == name);
      subdistrict.push(obj_subdistrict[0]);
    });
    form.subdistrict = subdistrict;
    console.log('sub district in function select district ==', form.subdistrict);
  });

};

const select_subdistrict = (data) => {

  searchSubDistrict.value = data.subdistrictName || data.name.th;
  form.subdistrict_name = data.subdistrictName || data.name.th;
  form.subdistrict_id = data.id;

  ApiSso.get("/api/geo/provinces/" + form.province_id + "/districts/" + form.district_id + "/sub-districts").then((response) => {
    form.subdistrict = response.data.data;
  });
};
// --------- New ----------------
let searchProvince = ref('');
let searchDistrict = ref('');
let searchSubDistrict = ref('');
let show1 = ref(false);
let show2 = ref(false);
let show3 = ref(false);


const filter_province = computed(() => {
  let province_list = form.province;
  return province_list.filter(data => {
    const province = data.name.th.toLowerCase() || data.provinceName.toLowerCase();
    return province.includes(searchProvince.value)
  });
});

const filter_district = computed(() => {
  let district_list = form.district;
  return district_list.filter(data => {
    const district_ = data.name.th.toLowerCase() || data.districtName.toLowerCase();
    return district_.includes(searchDistrict.value)
  });
});
const filter_subdistrict = computed(() => {
  let sub_list = form.subdistrict;
  return sub_list.filter(data => {
    const subdistrict_ = data.name.th.toLowerCase() || data.subdistrictName.toLowerCase();
    return subdistrict_.includes(searchSubDistrict.value)
  });
});

const input_province = computed(() => {
  if (searchProvince.value == "") {
    searchDistrict.value = "";
    searchSubDistrict.value = "";
    form.district_name = '';
    form.district_id = '';
    form.subdistrict_name = '';
    form.subdistrict_id = '';
  }
})
const input_district = computed(() => {
  if (searchDistrict.value == "") {
    searchSubDistrict.value = "";
    form.subdistrict_name = '';
    form.subdistrict_id = '';
  }
});

const closeForm = () =>{
  router.push('/geography_base');
}

const submit = () => {
  form.spaceNatureAll.forEach((element) => {
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

  if (edit_id) {
    ApiMain.put("/geobase/" + edit_id, {
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
  <title-bar :title-stack="titleStack" class="m-2 ml-0 mb-0 pb-2" />
  <div class="m-4 mt-0 shadow-custom rounded-2xl">
    <div class="hidden">{{ input_province }} {{ input_district }}</div>
    <div class="bg-white rounded-lg w-full">
      <div class="py-2 ">
        <h1 class="text-sm font-medium"><i class="fa-solid fa-book mx-2"></i> กรอกข้อมูลภูมิศาสตร์(ข้อมูลกลาง)</h1>
      </div>
      <hr class="opacity-50">
      <div class="grid grid-cols-1">
        <div class="flex justify-center">
          <form @submit.prevent="submit" class="w-[900px] my-6">
            <div class="flex flex-row mb-4 gap-2">
              <div @click="show1 = !show1" class="w-full relative">
                <div>
                  <label for="province"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกจังหวัด <span
                      class="text-red-500">*</span></label>
                  <div class="relative">
                    <input type="text" v-model="searchProvince" id="province"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="เลือกจังหวัด">
                    <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                      <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt=""
                        :class="show1 ? 'rotate-180' : ''" class="w-[10px]">
                    </div>
                  </div>
                </div>
                <div v-if="show1 == true" class="z-10 absolute w-full">
                  <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
                    :class="filter_province.length >= 1 && filter_province.length >= 5 ? 'h-[200px]' : 'h-auto'">
                    <li v-for="item of filter_province" :key="item.id"
                      class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                      @click="select_province(item)">
                      <span>{{ item.name.th }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div @click="show2 = !show2" class="w-full relative">
                <div>
                  <label for="province"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกอำเภอ <span
                      class="text-red-500">*</span></label>
                  <div class="relative">
                    <input type="text" v-model="searchDistrict" id="district"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="เลือกอำเภอ">
                    <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                      <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt=""
                        :class="show2 ? 'rotate-180' : ''" class="w-[10px]">
                    </div>
                  </div>
                </div>
                <div v-if="show2 == true" class="z-10 absolute w-full">
                  <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
                    :class="filter_district.length >= 1 && filter_district.length >= 5 ? 'h-[200px]' : 'h-auto'">
                    <li v-for="item of filter_district" :key="item.id"
                      class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                      @click="select_district(item)">
                      <span>{{ item.name.th }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div @click="show3 = !show3" class="w-full relative ">
                <div>
                  <label for="province" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกตำบล
                    <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input type="text" v-model="searchSubDistrict" id="sub-district"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="เลือกตำบล">
                    <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                      <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt=""
                        :class="show3 ? 'rotate-180' : ''" class="w-[10px]">
                    </div>
                  </div>
                </div>
                <div v-if="show3 == true" class="z-10 absolute w-full">
                  <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
                    :class="filter_subdistrict.length >= 1 && filter_subdistrict.length >= 5 ? 'h-[200px]' : 'h-auto'">
                    <li v-for="item of filter_subdistrict" :key="item.id"
                      class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                      @click="select_subdistrict(item)">
                      <span>{{ item.name.th }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <label for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คุณสมบัติของดิน <span
                  class="text-red-500">*</span></label>
              <textarea id="message" rows="1" v-model="form.soilProperties"
                class="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="กรอกคุณสมบัติของดิน"></textarea>
            </div>
            <div class="mb-4">
              <label for="topsoil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ดินชั้นบน
                <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.topsoilDetail" id="topsoil" placeholder="กรอกดินชั้นบน"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <div class="flex flex-row w-full gap-2">
              <div class="mb-4 w-full ">
                <label for="ph_topsoil_min" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่า
                  pH ดิดชั้นบน ต่ำสุด <span class="text-red-500">*</span></label>
                <input type="number" step="any" v-model="form.topsoilValueMin" id="ph_topsoil_min" placeholder="0"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </div>
              <div class="mb-4 w-full">
                <label for="ph_topsoil_max" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่า
                  pH ดิดชั้นบน สูงสุด <span class="text-red-500">*</span></label>
                <input type="number" step="any" v-model="form.topsoilValueMax" id="ph_topsoil_max" placeholder="0"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </div>
            </div>
            <div class="mb-4">
              <label for="bottomsoil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ดินชั้นล่าง
                <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.subsoilDetail" id="bottomsoil"  placeholder="กรอกดินชั้นล่าง"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>

            <div class="flex flex-row mb-6 gap-2">
              <div class="w-full">
                <label for="subsoilValueMin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่า
                  pH ดินชั้นล่าง ต่ำสุด <span class="text-red-500">*</span></label>
                <input type="number" step="any" v-model="form.subsoilValueMin" id="subsoilValueMin" placeholder="0"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </div>
              <div class="w-full">
                <label for="subsoilValueMax" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่า
                  pH ดินชั้นล่าง สูงสุด <span class="text-red-500">*</span></label>
                <input type="number" step="any" v-model="form.subsoilValueMax" id="subsoilValueMax" placeholder="0"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </div>
            </div>

            <div class="mb-6">
              <label for="soilRestrictions"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ข้อจํากัดของดิน <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="form.soilRestrictions" id="soilRestrictions"  placeholder="กรอกข้อจํากัดของดิน"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <div class="mb-6">
              <label for="spaceNature"
                class="block mb-2 text-base font-medium text-gray-900 dark:text-white">ลักษณะของพื้นที่ <span
                  class="text-red-500">*</span></label>
              <check-radio-picker class="text-sm" v-model="form.spaceNatureAll" name="spaceNature" :options="{
                  spaceNaturePlain: 'ที่ราบเรียบ',
                  spaceNaturePlateau: 'ที่ราบสูง',
                  spaceNatureHill: 'เนินเขา',
                  spaceNatureMountain: 'ภูเขา',
                }" />
            </div>
            <div class="mb-6">
              <label for="slope" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">ความชัน (
                หน่วยเมตร ) <span class="text-red-500">*</span></label>
              <input v-model="form.slope" type="number" placeholder="0" id="slope"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <div class="flex flex-row">
              <div class="mb-6 w-full">
                <label for="drainage" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">การระบายน้ำ
                  <span class="text-red-500">*</span></label>
                <div class="flex">
                  <div class="flex items-center mr-4">
                    <input checked id="low_drainage" type="radio" v-model="form.drainage" name="drainage-radio"
                      class="w-6 h-6 text-sky-600 bg-gray-100 border-gray-300 focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="low_drainage"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เลว</label>
                  </div>
                  <div class="flex items-center mr-4">
                    <input id="medium_drainage" type="radio" v-model="form.drainage" name="drainage-radio"
                      class="w-6 h-6 text-sky-600 bg-gray-100 border-gray-300 focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="medium_drainage"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ปานกลาง</label>
                  </div>
                  <div class="flex items-center mr-4">
                    <input id="max_drainage" type="radio" v-model="form.drainage" name="drainage-radio"
                      class="w-6 h-6 text-sky-600 bg-gray-100 border-gray-300 focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="max_drainage"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ดี</label>
                  </div>
                </div>
              </div>
              <div class="mb-6 w-full">
                <label for="soilFertility"
                  class="block mb-2 text-base font-medium text-gray-900 dark:text-white">ความอุดมสมบูรณ์ <span
                    class="text-red-500">*</span></label>
                <div class="flex">
                  <div class="flex items-center mr-4">
                    <input checked id="low_soilFertility" type="radio" v-model="form.soilFertility"
                      name="soilFertility-radio"
                      class="w-6 h-6 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="low_soilFertility"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ต่ำ</label>
                  </div>
                  <div class="flex items-center mr-4">
                    <input id="medium_soilFertility" type="radio" v-model="form.soilFertility"
                      name="soilFertility-radio"
                      class="w-6 h-6 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="medium_soilFertility"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ปานกลาง</label>
                  </div>
                  <div class="flex items-center mr-4">
                    <input id="max_soilFertility" type="radio" v-model="form.soilFertility" name="soilFertility-radio"
                      class="w-6 h-6 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="max_soilFertility"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">สูง</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <label for="nearbyNaturalWater" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">แหล่งน้ำใกล้เคียง <span class="text-red-500">*</span></label>
              <div class="flex flex-row w-full gap-2">
                <div class="mb-4 w-full">
                  <label for="topsoil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">แหล่งน้ำธรรมชาติ</label>
                  <input type="number" v-model="form.nearbyNaturalWater" placeholder="0"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="mb-4 w-full">
                  <label for="topsoil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">แหล่งน้ำในไร่นานอกเขตชลประทาน</label>
                  <input type="number" v-model="form.nearbyInfarmWater" placeholder="0"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="mb-4 w-full">
                  <label for="topsoil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">แหล่งน้ำขนาดเล็ก</label>
                  <input type="number" v-model="form.nearbySmallWater" placeholder="0"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="mb-4 w-full">
                  <label for="topsoil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">บ่อน้ำบาดาล</label>
                  <input type="number" v-model="form.nearbyGroundWater" placeholder="0"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
              </div>
            </div>
            <div class="flex flex-row items-center justify-center">
          <button type="submit"
            class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-2"><i
              class="fa-solid fa-check mr-3"></i>บันทึกข้อมูล</button>
          <button type="button" @click="closeForm()"
            class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-2"><i
              class="fa-solid fa-xmark mr-3"></i>ยกเลิก</button>
        </div>
          </form>
        </div>
      </div>
    </div>
    <!-- <card-component title="กรอกข้อมูลภูมิศาสตร์(ข้อมูลกลาง)" :icon="mdiBallot" form @submit.prevent="submit">
      <div class="flex flex-row mb-4">
        <div @click="show1 = !show1" class="w-full relative">
          <div>
            <label for="province"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกจังหวัด</label>
            <div class="relative">
              <input type="text" v-model="searchProvince" id="province"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="เลือกจังหวัด">
              <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt="" :class="show1 ? 'rotate-180' : ''"
                  class="w-[10px]">
              </div>
            </div>
          </div>
          <div v-if="show1 == true" class="z-10 absolute w-full">
            <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
              :class="filter_province.length >= 1 && filter_province.length >= 5 ? 'h-[200px]' : 'h-auto'">
              <li v-for="item of filter_province" :key="item.id"
                class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                @click="select_province(item)">
                <span>{{ item.name.th }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div @click="show2 = !show2" class="w-full relative mx-2">
          <div>
            <label for="province"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกอำเภอ</label>
            <div class="relative">
              <input type="text" v-model="searchDistrict" id="district"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="เลือกอำเภอ">
              <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt="" :class="show2 ? 'rotate-180' : ''"
                  class="w-[10px]">
              </div>
            </div>
          </div>
          <div v-if="show2 == true" class="z-10 absolute w-full">
            <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
              :class="filter_district.length >= 1 && filter_district.length >= 5 ? 'h-[200px]' : 'h-auto'">
              <li v-for="item of filter_district" :key="item.id"
                class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                @click="select_district(item)">
                <span>{{ item.name.th }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div @click="show3 = !show3" class="w-full relative mx-2">
          <div>
            <label for="province"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลือกตำบล</label>
            <div class="relative">
              <input type="text" v-model="searchSubDistrict" id="sub-district"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="เลือกตำบล">
              <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt="" :class="show3 ? 'rotate-180' : ''"
                  class="w-[10px]">
              </div>
            </div>
          </div>
          <div v-if="show3 == true" class="z-10 absolute w-full">
            <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
              :class="filter_subdistrict.length >= 1 && filter_subdistrict.length >= 5 ? 'h-[200px]' : 'h-auto'">
              <li v-for="item of filter_subdistrict" :key="item.id"
                class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                @click="select_subdistrict(item)">
                <span>{{ item.name.th }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label for="message"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คุณสมบัติของดิน</label>
        <textarea id="message" rows="1" v-model="form.soilProperties"
          class="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="กรอกคุณสมบัติของดิน"></textarea>
      </div>
      <field label="ดินชั้นบน">
        <control v-model="form.topsoilDetail" type="text" placeholder="กรอกรายละเอียดดินชั้นบน" />
      </field>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div>
          <label>ค่าPH ดิดชั้นบน ต่ำสุด</label>
          <input type="number" step="any" v-model="form.topsoilValueMin"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800">
        </div>
        <div>
          <label>ค่าPH ดิดชั้นบน สูงสุด</label>
          <input type="number" step="any" v-model="form.topsoilValueMax"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800">
        </div>

      </div>

      <field label="ดินชั้นล่าง">
        <control v-model="form.subsoilDetail" type="text" placeholder="กรอกรายละเอียดดินชั้นล่าง" />
      </field>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div>
          <label>ค่าPH ดินชั้นล่าง ต่ำสุด</label>
          <input type="number" step="any" v-model="form.subsoilValueMin"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800">
        </div>
        <div>
          <label>ค่าPH ดินชั้นล่าง สูงสุด</label>
          <input type="number" step="any" v-model="form.subsoilValueMax"
            class="rounded-lg border-1 border-gray-500 w-full dark:bg-gray-800">
        </div>
      </div>

      <field label="ความอุดมสมบูรณ์">
        <check-radio-picker name="soilFertility" v-model="form.soilFertility" type="radio"
          :options="{ low: 'ต่ำ', medium: 'กลาง', high: 'สูง' }" />
      </field>

      <field label="การระบายน้ำ">
        <check-radio-picker name="drainage" v-model="form.drainage" type="radio"
          :options="{ low: 'ต่ำ', medium: 'กลาง', high: 'สูง' }" />
      </field>
      <field label="ข้อจํากัดของดิน">
        <control v-model="form.soilRestrictions" type="text" placeholder="กรอกข้อจํากัดของดิน" />
      </field>
      <field label="ความชัน(หน่วยเมตร)">
        <control v-model="form.slope" type="number" placeholder="กรอกความชัน(หน่วยเมตร)" />
      </field>

      <field label="รายละเอียดลักษณะของพื้นที่">
        <control v-model="form.spaceNatureDetail" type="text" placeholder="กรอกรายละเอียดลักษณะของพื้นที่" />
      </field>
      <field label="ลักษณะของพื้นที่">
        <check-radio-picker v-model="form.spaceNatureAll" name="spaceNature" :options="{
          spaceNaturePlain: 'ที่ราบเรียบ',
          spaceNaturePlateau: 'ที่ราบสูง',
          spaceNatureHill: 'เนินเขา',
          spaceNatureMountain: 'ภูเขา',
        }" />
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
    </card-component> -->
  </div>

</template>
<style>
.shadow-custom {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
</style>
