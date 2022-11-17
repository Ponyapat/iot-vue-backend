
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email ,minLength,maxLength ,helpers} from '@vuelidate/validators'
import vagetable from "@/assets/images/cabbage.png";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();
const token = localStorage.getItem("tkfw");

const code_rule = helpers.regex(/[0-9]/);

const categories = ref([]) ;
let image_upload = ref('');
let img_file = ref('');
let image_name = ref('');
let documents = ref('');
let document_name = ref('');
let file_pdf = ref('');
let formData_img = ref('');
let type_form = ref('');
let url = new URL(window.location.href);
const id = url.searchParams.get("data_id");
const dataform = reactive({
  code:'',
  name: '',// ชื่อ
  species: '', // สายพันธุ์
  breedCategoryId:'',//ประเภท
  scientificName: '',  // ชื่อวิทยาศาสตร์
  commonName: '', // ชื่อสามัญ
  detail: '',// รายละเอียด
  harvestPeriod: '', // อายุการเก็บเกี่ยว
  airTemperatureMax: 0,// อุณหภูมิในอากาศ Max
  airTemperatureMin: 0,// อุณหภูมิในอากาศ Min
  soilTemperatureMax: 0,// อุณหภูมิในดิน Max
  soilTemperatureMin: 0,// อุณหภูมิในดิน Min
  soilMoistureMax: 0,// ความชื้นในดิน Max
  soilMoistureMin: 0,// ความชื้นในดิน Min
  soilPhMax: 0,// pH ในดิน Max
  soilPhMin: 0,// pH ในดิน Min
  soilEcMax: 0,// EC ในดิน Max
  soilEcMin: 0,// EC ในดิน Min
  nitrogenMax: 0,// N Max
  nitrogenMin:0 ,// N Min
  phosphorusMax: 0,// P Max
  phosphorusMin: 0,// P Min
  potassiumMax: 0,// K Max
  potassiumMin: 0,// K Min
  amountOfWaterMax: 0,// ปริมาณน้ำ Max
  amountOfWaterMin: 0,// ปริมาณน้ำ Min
  lightIntensityMax: 0,// ความเข้มแสง Max
  lightIntensityMin: 0,// ความเข้มแสง Min
  document_file: 'string',// เอกสาร
  link: '',// ลิ้ง
  image: '',// รูป
  status: 'active',// สถานะ

});
const rules = {
  code: { required:helpers.withMessage('กรุณาระบุรหัสของพืช',required),
    code_rules:helpers.withMessage('รหัสต้องเป็นตัวเลขตั้งแต่ 0-9 เท่านั้น',code_rule),
    maxLength:helpers.withMessage('รหัสต้องมีไม่เกิน 6 ตัวอักษร', maxLength(6)),
  },// รหัส
  name: { required :helpers.withMessage('กรุณาระบุชื่อของพืช',required)},// ชื่อ
  species: { required :helpers.withMessage('กรุณาระบุสายพันธุ์พืช',required)}, // สายพันธุ์
  breedCategoryId:{required:helpers.withMessage('กรุณาระบุประเภท',required)},
  scientificName: {  required:helpers.withMessage('กรุณาระบุชื่อวิทยาศาสตร์',required) },  // ชื่อวิทยาศาสตร์
  commonName: {  required:helpers.withMessage('กรุณาระบุชื่อสามัญ',required) }, // ชื่อสามัญ
  detail: {  },// รายละเอียด
  harvestPeriod: { required:helpers.withMessage('กรุณาระบุอายุการเก็บเกี่ยว',required)}, // อายุการเก็บเกี่ยว
  airTemperatureMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของอุณหภูมิในอากาศ',required) },// อุณหภูมิในอากาศ Max
  airTemperatureMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของอุณหภูมิในอากาศ',required) },// อุณหภูมิในอากาศ Min
  soilTemperatureMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของอุณหภูมิในดิน',required) },// อุณหภูมิในดิน Max
  soilTemperatureMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของอุณหภูมิในดิน',required) },// อุณหภูมิในดิน Min
  soilMoistureMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของความชื้นในดิน',required) },// ความชื้นในดิน Max
  soilMoistureMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของความชื้นในดิน',required) },// ความชื้นในดิน Min
  soilPhMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของpH ในดิน',required) },// pH ในดิน Max
  soilPhMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของpH ในดิน',required) },// pH ในดิน Min
  soilEcMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของEC ในดิน',required) },// EC ในดิน Max
  soilEcMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของEC ในดิน',required) },// EC ในดิน Min
  nitrogenMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของไนโตรเจน ( N )',required) },// N Max
  nitrogenMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของไนโตรเจน ( N )',required) },// N Min
  phosphorusMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของฟอสฟอรัส ( P )',required) },// P Max
  phosphorusMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของฟอสฟอรัส ( P )',required) },// P Min
  potassiumMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของโพแทสเซียม ( K )',required) },// K Max
  potassiumMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของโพแทสเซียม ( K )',required) },// K Min
  amountOfWaterMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของปริมาณน้ำ',required) },// ปริมาณน้ำ Max
  amountOfWaterMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของปริมาณน้ำ',required) },// ปริมาณน้ำ Min
  lightIntensityMax: { required:helpers.withMessage('กรุณาระบุค่าสูงสุดของความเข้มแสง',required) },// ความเข้มแสง Max
  lightIntensityMin: { required:helpers.withMessage('กรุณาระบุค่าต่ำสุดของความเข้มแสง',required) },// ความเข้มแสง Min
  document_file: {  },// เอกสาร
  link: {},// ลิ้ง
  image: {  },// รูป
  status: { required},// สถานะ
}
const v$ = useVuelidate(rules, dataform) ;

onMounted(()=>{

  if(id){
    type_form.value = 'แก้ไขข้อมูล';

    ApiMain.get("/breed/" + id).then((response) => {
        if(response.data.data.image!==''){
          ApiMain.get('/image/'+response.data.data.image+'?imageableType=breed').then((res)=>{
            image_upload.value =res.request.responseURL ;
          })
        image_name.value = response.data.data.image ;
        }
        if(response.data.data.document !=='' || response.data.data.document !=='string' ){
          showlink_PDF(response.data.data.document);
        }
        dataform.code  = response.data.data.code ;
        dataform.breedCategoryId = response.data.data.breedCategoryId ;
        dataform.name = response.data.data.name ;
        dataform.species = response.data.data.species ; // สายพันธุ์
        dataform.scientificName = response.data.data.scientificName ;  // ชื่อวิทยาศาสตร์
        dataform.commonName = response.data.data.commonName ; // ชื่อสามัญ
        dataform.detail = response.data.data.detail ;// รายละเอียด
        dataform.harvestPeriod = response.data.data.harvestPeriod ; // อายุการเก็บเกี่ยว
        dataform.airTemperatureMax = response.data.data.airTemperatureMax ;// อุณหภูมิในอากาศ Max
        dataform.airTemperatureMin = response.data.data.airTemperatureMin ;// อุณหภูมิในอากาศ Min
        dataform.soilTemperatureMax = response.data.data.soilTemperatureMax ;// อุณหภูมิในดิน Max
        dataform.soilTemperatureMin = response.data.data.soilTemperatureMin ;// อุณหภูมิในดิน Min
        dataform.soilMoistureMax = response.data.data.soilMoistureMax ;// ความชื้นในดิน Max
        dataform.soilMoistureMin = response.data.data.soilMoistureMin ;// ความชื้นในดิน Min
        dataform.soilPhMax = response.data.data.soilPhMax ;// pH ในดิน Max
        dataform.soilPhMin = response.data.data.soilPhMin ;// pH ในดิน Min
        dataform.soilEcMax = response.data.data.soilEcMax ;// EC ในดิน Max
        dataform.soilEcMin = response.data.data.soilEcMin ;// EC ในดิน Min
        dataform.nitrogenMax = response.data.data.nitrogenMax ;// N Max
        dataform.nitrogenMin = response.data.data.nitrogenMin ;// N Min
        dataform.phosphorusMax = response.data.data.phosphorusMax ;// P Max
        dataform.phosphorusMin = response.data.data.phosphorusMin ;// P Min
        dataform.potassiumMax = response.data.data.potassiumMax ;// K Max
        dataform.potassiumMin = response.data.data.potassiumMin ;// K Min
        dataform.amountOfWaterMax = response.data.data.amountOfWaterMax ;// ปริมาณน้ำ Max
        dataform.amountOfWaterMin = response.data.data.amountOfWaterMin ;// ปริมาณน้ำ Min
        dataform.lightIntensityMax = response.data.data.lightIntensityMax ;// ความเข้มแสง Max
        dataform.lightIntensityMin = response.data.data.lightIntensityMin ;// ความเข้มแสง Min
        dataform.document_file = response.data.data.document ;// เอกสาร
        dataform.link = response.data.data.link// ลิ้ง
        dataform.image = response.data.data.image;// รูป
        dataform.status = response.data.data.status;// สถานะ
    })
  }
  else {
    type_form.value = 'เพิ่มข้อมูล';
  }
  //ดึงเอาประเภทพืช breed-categorise
  ApiMain.get("/breed-categorise?order=ASC&page=1&take=10").then((response) => {
      categories.value = response.data.data;
    })

});

const upload_image = (event) => {
  let name = event.target.files[0].name ;
  image_name.value = event.target.files[0].name ;
  let image = event.target.files[0];
  const formdata = new FormData();
  formdata.append('file', image );
  image_upload.value =  URL.createObjectURL(image) ;
  formData_img.value = formdata ;
  ApiMain.post("/image/upload?imageableType=breed",formdata).then((data) => {
      if (data.status == 201) {
        dataform.image = data.data;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'อัพโหลดรูปสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          position: 'top-end',
          icon: "warning",
          title: "ไม่สามารถอัพโหลดรูปได้",
          timer: 1500,
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });

};

const upload_document = (event) => {

  document_name.value = event.target.files[0].name;
  let file_upload = event.target.files[0];
  // Real
  const formdata = new FormData();
  formdata.append('file', file_upload);
  console.log('file_upload == ',file_upload);
  documents.value = formdata ;
  ApiMain.post("/image/upload?imageableType=breed",formdata).then((data) => {
      if (data.status == 201) {
        dataform.document_file = data.data;
        showlink_PDF(dataform.document_file);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'อัพโหลด PDF สำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          position: 'top-end',
          icon: "warning",
          title: "ไม่สามารถอัพโหลด PDF ได้",
          timer: 1500,
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });


}

const showlink_PDF = (doc_name) =>{

  ApiMain.get('/image/'+doc_name+'?imageableType=breed').then((res)=>{
      file_pdf.value =res.request.responseURL ;
      console.log('link == ',file_pdf);
  })
}
const check_status = (event) => {

let check = event;
  console.log(check);
if(check==true){
  dataform.status = 'active';
}
else {
  dataform.status = 'notactive';
}
console.log( dataform.status);
};

const submit = async () => {

  const result = await v$.value.$validate();

  if(id){
    if (result) {
      ApiMain.put("/breed/"+ id,{
        code: dataform.code,
        breedCategoryId: dataform.breedCategoryId,
        name: dataform.name,// ชื่อ
        species: dataform.species, // สายพันธุ์
        scientificName: dataform.scientificName,  // ชื่อวิทยาศาสตร์
        commonName: dataform.commonName, // ชื่อสามัญ
        detail: dataform.detail,// รายละเอียด
        harvestPeriod:dataform.harvestPeriod, // อายุการเก็บเกี่ยว
        airTemperatureMax: dataform.airTemperatureMax,// อุณหภูมิในอากาศ Max
        airTemperatureMin: dataform.airTemperatureMin,// อุณหภูมิในอากาศ Min
        soilTemperatureMax: dataform.soilTemperatureMax,// อุณหภูมิในดิน Max
        soilTemperatureMin: dataform.soilTemperatureMin,// อุณหภูมิในดิน Min
        soilMoistureMax: dataform.soilMoistureMax,// ความชื้นในดิน Max
        soilMoistureMin: dataform.soilMoistureMin,// ความชื้นในดิน Min
        soilPhMax: dataform.soilPhMax,// pH ในดิน Max
        soilPhMin: dataform.soilPhMin,// pH ในดิน Min
        soilEcMax: dataform.soilEcMax,// EC ในดิน Max
        soilEcMin: dataform.soilEcMin,// EC ในดิน Min
        nitrogenMax: dataform.nitrogenMax,// N Max
        nitrogenMin: dataform.nitrogenMin,// N Min
        phosphorusMax: dataform.phosphorusMax,// P Max
        phosphorusMin: dataform.phosphorusMin,// P Min
        potassiumMax: dataform.potassiumMax,// K Max
        potassiumMin: dataform.potassiumMin,// K Min
        amountOfWaterMax: dataform.amountOfWaterMax,// ปริมาณน้ำ Max
        amountOfWaterMin: dataform.amountOfWaterMin,// ปริมาณน้ำ Min
        lightIntensityMax: dataform.lightIntensityMax,// ความเข้มแสง Max
        lightIntensityMin: dataform.lightIntensityMin,// ความเข้มแสง Min
        document: dataform.document_file,// เอกสาร
        link: dataform.link,// ลิ้ง
        image: dataform.image,// รูป
        status: dataform.status,// สถานะ
      }
    )
    .then((data) => {
      if (data.status == 200 || data.status == 201) {
        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
          timer: 2500,
          showConfirmButton: 1,
        });
        router.push("/fruits");
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเพิ่มข้อมูลได้",
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
  else {
    alert('submit Failed');
  }
  }
  else {
    if (result) {

    ApiMain.post("/breed",{
        code: dataform.code,
        breedCategoryId: dataform.breedCategoryId,
        name: dataform.name,// ชื่อ
        species: dataform.species, // สายพันธุ์
        scientificName: dataform.scientificName,  // ชื่อวิทยาศาสตร์
        commonName: dataform.commonName, // ชื่อสามัญ
        detail: dataform.detail,// รายละเอียด
        harvestPeriod:dataform.harvestPeriod, // อายุการเก็บเกี่ยว
        airTemperatureMax: dataform.airTemperatureMax,// อุณหภูมิในอากาศ Max
        airTemperatureMin: dataform.airTemperatureMin,// อุณหภูมิในอากาศ Min
        soilTemperatureMax: dataform.soilTemperatureMax,// อุณหภูมิในดิน Max
        soilTemperatureMin: dataform.soilTemperatureMin,// อุณหภูมิในดิน Min
        soilMoistureMax: dataform.soilMoistureMax,// ความชื้นในดิน Max
        soilMoistureMin: dataform.soilMoistureMin,// ความชื้นในดิน Min
        soilPhMax: dataform.soilPhMax,// pH ในดิน Max
        soilPhMin: dataform.soilPhMin,// pH ในดิน Min
        soilEcMax: dataform.soilEcMax,// EC ในดิน Max
        soilEcMin: dataform.soilEcMin,// EC ในดิน Min
        nitrogenMax: dataform.nitrogenMax,// N Max
        nitrogenMin: dataform.nitrogenMin,// N Min
        phosphorusMax: dataform.phosphorusMax,// P Max
        phosphorusMin: dataform.phosphorusMin,// P Min
        potassiumMax: dataform.potassiumMax,// K Max
        potassiumMin: dataform.potassiumMin,// K Min
        amountOfWaterMax: dataform.amountOfWaterMax,// ปริมาณน้ำ Max
        amountOfWaterMin: dataform.amountOfWaterMin,// ปริมาณน้ำ Min
        lightIntensityMax: dataform.lightIntensityMax,// ความเข้มแสง Max
        lightIntensityMin: dataform.lightIntensityMin,// ความเข้มแสง Min
        document: dataform.document_file,// เอกสาร
        link: dataform.link,// ลิ้ง
        image: dataform.image,// รูป
        status: dataform.status,// สถานะ
      })
    .then((data) => {

      console.log(data);
      if (data.data.status == 201) {
        console.log(data.data.status);
        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
          timer: 2500,
          showConfirmButton: 1,
        });
        router.push("/fruits");
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเพิ่มข้อมูลได้",
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
  else {
    alert('submit Failed');
  }
  }
};
const closeForm = () => {
  router.push('/fruits');
};

</script>

<template>
  <div class="flex justify-center bg-white m-4 p-10 rounded-2xl shadow-custom">
    <div class="w-full md:w-[800px] h-full">
      <h1 class="text-center font-semibold text-black text-2xl mb-10">{{type_form}}</h1>
      <form @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-6 mb-10">
          <div class="flex justify-center items-center w-full h-full">
            <label v-if="image_upload ==''" for="dropzone-file"
              class="flex flex-col justify-center items-center w-full h-full bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col justify-center items-center pt-5 pb-6">
                <img :src="vagetable" alt="">
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">คลิกเพื่ออัปโหลด</span> หรือ ลากและวาง</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">.Webp, PNG or JPG (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" accept=".webp, .jpg, .jpeg , .png ,.tif" class="hidden" @change="upload_image">
            </label>
            <label v-else for="dropzone-file"
              class="flex flex-col justify-center items-center w-full h-full bg-green-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer">
              <div class="flex flex-col justify-center items-center pt-5 pb-6 ">
                <img :src="image_upload" class="mb-2 rounded-md" :alt="image_upload" style="width:100px; height:100px;">
                <span class="text-center truncate w-[250px]">{{image_name}}</span>
              </div>
              <input id="dropzone-file" type="file" accept=".webp, .jpg, .jpeg , .png ,.tif" class="hidden" @change="upload_image">
            </label>
          </div>
          <div class="w-full h-full">
            <div class="mb-4">
              <label for="name" class="block mb-2 text-base font-medium text-black dark:text-gray-300">รหัสพืช <span class="text-red-500">*</span></label>
              <input type="text" v-model="dataform.code" :class="v$.code.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <span v-if="v$.code.$error" class="text-xs text-red-500 font-medium float-right">{{v$.code.$errors[0].$message}}</span>
            </div>
            <div class="mb-4">
              <label for="name" class="block mb-2 text-base font-medium text-black dark:text-gray-300">ชื่อ <span class="text-red-500">*</span></label>
              <input type="text" v-model="dataform.name" :class="v$.name.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <small v-if="v$.name.$error" class="text-red-500 float-right">{{ v$.name.$errors[0].$message }}</small>
            </div>
            <div class="mb-4">
              <label for="categories"
                class="block mb-2 text-base font-medium text-black dark:text-gray-300">ประเภท <span class="text-red-500">*</span></label>
                <select id="categories" v-model="dataform.breedCategoryId" :class="v$.breedCategoryId.$error?'border-red-300':'border-gray-300'" class="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="" disabled selected >เลือกประเภทพืช</option>
                  <option v-for="val of categories" :key="val" :value="val.id">{{val.name}}</option>
                </select>
                <small v-if="v$.breedCategoryId.$error" class="text-red-500 float-right">{{ v$.breedCategoryId.$errors[0].$message }}</small>
            </div>
            <div class="mb-4">
              <label for="species"
                class="block mb-2 text-base font-medium text-black dark:text-gray-300">สายพันธุ์ <span class="text-red-500">*</span></label>
              <input type="text" v-model="dataform.species" name="species" id="species" :class="v$.species.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.species.$error" class="text-red-500 float-right">{{ v$.species.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-10 flex flex-row justify-between">
          <div class="w-full mr-2">
              <label for="scientificName"
                class="block mb-2 text-base font-medium text-black dark:text-gray-300">ชื่อวิทยาศาสตร์ <span class="text-red-500">*</span></label>
              <input type="text" v-model="dataform.scientificName" name="scientificName" id="scientificName" :class="v$.scientificName.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.scientificName.$error" class="text-red-500">{{ v$.scientificName.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="" class="block mb-2 text-base font-medium text-black dark:text-gray-300">ชื่อสามัญ <span class="text-red-500">*</span></label>
              <input type="text" v-model="dataform.commonName" name="commonName" id="commonName" :class="v$.commonName.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.commonName.$error" class="text-red-500">{{ v$.commonName.$errors[0].$message }}</small>
            </div>
        </div>
        <div class="mb-10">
          <label for="detail" class="block mb-2 text-base font-medium text-black dark:text-gray-400">รายละเอียด <span class="opacity-50">( ไม่บังคับ )</span></label>
          <textarea rows="3" v-model="dataform.detail" name="detail" id="detail"
            class="block p-2.5 w-full text-base text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
        </div>
        <div class="mb-10">
          <label for="" class="block mb-2 text-base font-medium text-black dark:text-gray-300">อายุการเก็บเกี่ยว <span class="text-red-500">*</span></label>
          <input type="text" v-model="dataform.harvestPeriod" name="harvestPeriod" id="harvestPeriod"  :class="v$.harvestPeriod.$error?'border-red-300':'border-gray-300'"
            class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <small v-if="v$.harvestPeriod.$error" class="text-red-500 float-right">{{ v$.harvestPeriod.$errors[0].$message }}</small>
        </div>
        <div class="mb-10">
          <label for="airTemperature"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">อุณหภูมิในอากาศ <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="airTemperatureMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input step="any" :class="v$.airTemperatureMin.$error?'border-red-300':'border-gray-300'" type="number" v-model="dataform.airTemperatureMin" name="airTemperatureMin" id="airTemperatureMin"
                class="mr-2 bg-gray-50 border  text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.airTemperatureMin.$error" class="text-red-500">{{ v$.airTemperatureMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="airTemperatureMin" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input  type="number" step="any" v-model="dataform.airTemperatureMax" name="airTemperatureMax" id="airTemperatureMax"  :class="v$.airTemperatureMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.airTemperatureMax.$error" class="text-red-500">{{ v$.airTemperatureMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-10">
          <label for="soilTemperature"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">อุณหภูมิในดิน <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between ">
            <div class="w-full mr-2">
              <label for="soilTemperatureMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.soilTemperatureMin" name="soilTemperatureMin"
                id="soilTemperatureMin" :class="v$.soilTemperatureMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border  text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilTemperatureMin.$error" class="text-red-500">{{ v$.soilTemperatureMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="soilTemperatureMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.soilTemperatureMax" name="soilTemperatureMax"
                id="soilTemperatureMax" :class="v$.soilTemperatureMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border  text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilTemperatureMax.$error" class="text-red-500">{{ v$.soilTemperatureMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-10">
          <label for="soilMoisture"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">ความชื้นในดิน <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="soilMoistureMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.soilMoistureMin" name="soilMoistureMin" id="soilMoistureMin" :class="v$.soilMoistureMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border  text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilMoistureMin.$error" class="text-red-500">{{ v$.soilMoistureMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="soilMoistureMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.soilMoistureMax" name="soilMoistureMax" id="soilMoistureMax" :class="v$.soilMoistureMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilMoistureMax.$error" class="text-red-500">{{ v$.soilMoistureMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-10">
          <label for="soilPh" class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">pH ในดิน <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="soilPhMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.soilPhMin" name="soilPhMin" id="soilPhMin" :class="v$.soilPhMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilPhMin.$error" class="text-red-500">{{ v$.soilPhMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="soilPhMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.soilPhMax" name="soilPhMax" id="soilPhMax" :class="v$.soilPhMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilPhMax.$error" class="text-red-500">{{ v$.soilPhMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="soilEc" class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">EC ในดิน <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="soilEcMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.soilEcMin" name="soilEcMin" id="soilEcMin" :class="v$.soilEcMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilEcMin.$error" class="text-red-500">{{ v$.soilEcMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="soilEcMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.soilEcMax" name="soilEcMax" id="soilEcMax" :class="v$.soilEcMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.soilEcMax.$error" class="text-red-500">{{ v$.soilEcMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="nitrogen" class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">ไนโตรเจน ( N ) <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="nitrogenMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.nitrogenMin" name="nitrogenMin" id="nitrogenMin" :class="v$.nitrogenMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.nitrogenMin.$error" class="text-red-500">{{ v$.nitrogenMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="nitrogenMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.nitrogenMax" name="nitrogenMax" id="nitrogenMax" :class="v$.nitrogenMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.nitrogenMax.$error" class="text-red-500">{{ v$.nitrogenMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="phosphorus" class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">ฟอสฟอรัส ( P ) <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="phosphorusMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.phosphorusMin" name="phosphorusMin" id="phosphorusMin" :class="v$.phosphorusMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.phosphorusMin.$error" class="text-red-500">{{ v$.phosphorusMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="phosphorusMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.phosphorusMax" name="phosphorusMax" id="phosphorusMax" :class="v$.phosphorusMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.phosphorusMax.$error" class="text-red-500">{{ v$.phosphorusMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="potassium" class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">โพแทสเซียม ( K ) <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="potassiumMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.potassiumMin" name="potassiumMin" id="potassiumMin" :class="v$.potassiumMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.potassiumMin.$error" class="text-red-500">{{ v$.potassiumMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="potassiumMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.potassiumMax" name="potassiumMax" id="potassiumMax" :class="v$.potassiumMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.potassiumMax.$error" class="text-red-500">{{ v$.potassiumMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="amountOfWaterMin"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">ปริมาณน้ำ <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="amountOfWaterMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.amountOfWaterMin" name="amountOfWaterMin" id="amountOfWaterMin" :class="v$.amountOfWaterMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.amountOfWaterMin.$error" class="text-red-500">{{ v$.amountOfWaterMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="amountOfWaterMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.amountOfWaterMax" name="amountOfWaterMax" id="amountOfWaterMax" :class="v$.amountOfWaterMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.amountOfWaterMax.$error" class="text-red-500">{{ v$.amountOfWaterMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label for="lightIntensity"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">ความเข้มแสง <span class="text-red-500">*</span></label>
          <div class="flex flex-row justify-between">
            <div class="w-full mr-2">
              <label for="lightIntensityMin" class=" font-medium text-sm">ค่าต่ำสุด</label>
              <input type="number" step="any" v-model="dataform.lightIntensityMin" name="lightIntensityMin" id="lightIntensityMin" :class="v$.lightIntensityMin.$error?'border-red-300':'border-gray-300'"
                class="mr-2 bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.lightIntensityMin.$error" class="text-red-500">{{ v$.lightIntensityMin.$errors[0].$message }}</small>
            </div>
            <div class="w-full ml-2">
              <label for="lightIntensityMax" class=" font-medium text-sm">ค่าสูงสุด</label>
              <input type="number" step="any" v-model="dataform.lightIntensityMax" name="lightIntensityMax" id="lightIntensityMax" :class="v$.lightIntensityMax.$error?'border-red-300':'border-gray-300'"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <small v-if="v$.lightIntensityMax.$error" class="text-red-500">{{ v$.lightIntensityMax.$errors[0].$message }}</small>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="document_file"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">เอกสาร <span class="opacity-50">( ไม่บังคับ )</span></label>
          <input id="document_file" type="file" @change="upload_document" accept=".pdf"  class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2" >
          <!-- <small v-if="v$.document_file.$error" class="text-red-500">{{ v$.document_file.$errors[0].$message }}</small> -->
          <a :href="file_pdf" class="text-green-900 cursor-pointer"><span class="text-black cursor-default font-medium mr-2">ดาวน์โหลดไฟล์</span><span class="hover:underline">{{file_pdf}}</span></a>
        </div>
        <div class="mb-4">
          <label for="link"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">ลิ้งค์ <span class="opacity-50">( ไม่บังคับ )</span></label>
            <input type="text" placeholder="https://example.com"  v-model="dataform.link" name="link" id="link"
                class="bg-gray-50 border border-gray-300 text-black text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <!-- <small v-if="v$.link.$error" class="text-red-500">{{ v$.link.$errors[0].$message }}</small> -->
        </div>
        <div class="mb-10">
          <label for="status_"
            class="block mb-2 text-base font-medium text-black dark:text-gray-300 ">สถานะ</label>
          <label for="status" class="inline-flex relative items-center mr-5 cursor-pointer">
            <input type="checkbox" @change="check_status($event.target.checked)"  id="status" class="sr-only peer" checked>
            <div class="w-[68px] h-9 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div class="flex flex-row items-center justify-center">
          <button type="submit"
            class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"><i
              class="fa-solid fa-check mr-3"></i>บันทึกข้อมูล</button>
          <button type="button" @click="closeForm()"
            class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"><i
              class="fa-solid fa-xmark mr-3"></i>ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.shadow-custom {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

#document_file::file-selector-button {
    font-weight: bold;
    color: rgb(9, 124, 78);
    padding: 0.5em;
    border: 0;
    border-radius: 10px;
    margin-right: 20px;
}
</style>

