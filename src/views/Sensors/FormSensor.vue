<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from "vue-router";
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators'
import Swal from "sweetalert2";
const router = useRouter();
const token = localStorage.getItem("tkfw");
const code_rule = helpers.regex(/[0-9]/);
let type_form = ref('');
let url = new URL(window.location.href);
const id = url.searchParams.get("sensor_edit");

const categories = ref([]) ;
let image_upload = ref('');
let image_name = ref('');
let formData_img = ref('');


const dataform = reactive({
    name_th: '',
    name_en: '',
    unit: '',
    unit_th: '',
    unit_en: '',
    image: '',
    type: '',
    categoryId: '',
    device_status: 'active',
});
const rules = {
    name_th: { required: helpers.withMessage('กรุณาระบุชื่อของ Sensor', required) },
    name_en: { },
    device_status: { required: helpers.withMessage('กรุณาระบุ Status', required) },
    image: { },
    unit: { required: helpers.withMessage('กรุณาระบุหน่วย', required) },
    unit_th: { required: helpers.withMessage('กรุณาระบุชื่อหน่วย', required) },
    unit_en: { },
    type: { required: helpers.withMessage('กรุณาระบุประเภท', required) },
    categoryId: { required: helpers.withMessage('กรุณาระบุ Category', required) },

}
const v$ = useVuelidate(rules, dataform);

onMounted(() => {
    if (id) {
        type_form.value = 'แก้ไข Sensor';
        ApiMain.get("/sensors/" + id).then((res) => {
            dataform.name_th = res.data.data.name.th;
            dataform.name_en = res.data.data.name.en;
            dataform.unit = res.data.data.unit.en;
            dataform.device_status = res.data.data.status;
            dataform.image = res.data.data.imageName;
            dataform.image = res.data.data.imageWithBackgroundName;
            dataform.unit_th = res.data.data.unit.th;
            dataform.unit_en = res.data.data.unit.en_name;
            dataform.type = res.data.data.type;
            dataform.categoryId = res.data.data.categoryId;
        }).catch((error) => {
            console.log(error);
        });
    }
    else {
        type_form.value = 'เพิ่ม Sensor'
        console.log(dataform.status)

    }

})

const submit = async () => {

    const result = await v$.value.$validate();
    if (id) {
        if (result) {
            ApiMain.put("/sensors/" + id, {
                name: {
                    th: dataform.name_th,
                    en: dataform.name_en,
                },
                unit: {
                  th: dataform.unit_th,
                  en: dataform.unit,
                  en_name: dataform.unit_en
                },
                imageName: dataform.image,
                imageWithBackgroundName: dataform.image,
                status: dataform.device_status,
                type: dataform.type,
                categoryId: dataform.categoryId,
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
                        router.push("/sensor-list");
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
            Swal.fire({
                icon: "warning",
                title: "กรุณาระบุข้อมุลในแบบฟอร์มให้ถูกต้อง",
                timer: 3000,
                showConfirmButton: 1,
            });
        }

    }
    else {
        if (result) {
            ApiMain.post("/sensors/", {
              name: {
                    th: dataform.name_th,
                    en: dataform.name_en,
                },
                unit: {
                  th: dataform.unit_th,
                  en: dataform.unit,
                  en_name: dataform.unit_en
                },
                imageName: dataform.image,
                imageWithBackgroundName: dataform.image,
                status: dataform.device_status,
                type: dataform.type,
                categoryId: dataform.categoryId,
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
                        router.push("/sensor-list");
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
            Swal.fire({
                icon: "warning",
                title: "กรุณาระบุข้อมุลในแบบฟอร์มให้ถูกต้อง",
                timer: 3000,
                showConfirmButton: 1,
            });
        }

    }
};

const upload_image = (event) => {
  let name = event.target.files[0].name ;
  image_name.value = event.target.files[0].name ;
  let image = event.target.files[0];
  const formdata = new FormData();
  formdata.append('file', image );
  image_upload.value =  URL.createObjectURL(image) ;
  formData_img.value = formdata ;
  ApiMain.post("/image/upload?folder=sensors",formdata).then((data) => {
      if (data.status == 201) {
        dataform.image = data.data;
        Swal.fire({
          icon: 'success',
          title: 'อัพโหลดรูปสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
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


const closeForm = () => {
    router.push('/sensor-list');
};

</script>

<template>
    <div class="block sm:flex justify-center bg-white m-4 p-10 rounded-2xl shadow-custom">
        <div class="w-full sm:w-[500px] h-full">
            <h1 class="text-center font-semibold text-black text-2xl mb-10">{{ type_form }}</h1>
            <form @submit.prevent="submit">
                
                <!-- name -->
               <div class="block md:flex w-full gap-2">
                <div class="mb-4 w-full">
                    <label for="name_th"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อ Sensor<span class="text-red-500">*</span></label>
                    <input type="text" id="name_th" v-model="dataform.name_th" placeholder="กรุณากรอกชื่อ Sensor"
                        :class="v$.name_th.$error ? 'border-red-300' : 'border-gray-300'"
                        class="shadow-sm bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <small v-if="v$.name_th.$error" class="text-red-500 float-right">{{ v$.name_th.$errors[0].$message
                    }}</small>
                </div>
                
                <div class="mb-4 w-full">
                    <label for="name_en" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sensor Name</label>
                    <input type="text" id="name_en" v-model="dataform.name_en" placeholder="Please specify Sensor name"
                        :class="v$.name_en.$error ? 'border-red-300' : 'border-gray-300'"
                        class="shadow-sm bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <small v-if="v$.name_en.$error" class="text-red-500 float-right">{{ v$.name_en.$errors[0].$message
                    }}</small>
                </div>
               </div>

               <!-- unit -->
               <div class="mb-4 w-full">
                    <label for="unit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unit Abbrv</label>
                    <input type="text" id="unit" v-model="dataform.unit" placeholder="กรุณาระบุหน่วย"
                        :class="v$.unit.$error ? 'border-red-300' : 'border-gray-300'"
                        class="shadow-sm bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <small v-if="v$.unit.$error" class="text-red-500 float-right">{{ v$.unit.$errors[0].$message
                    }}</small>
                </div>

               <!-- unit name -->
               <div class="block md:flex w-full gap-2">
                <div class="mb-4 w-full">
                    <label for="unit_th"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อหน่วย<span class="text-red-500">*</span></label>
                    <input type="text" id="unit_th" v-model="dataform.unit_th" placeholder="กรุณาระบุชื่อหน่วย"
                        :class="v$.unit_th.$error ? 'border-red-300' : 'border-gray-300'"
                        class="shadow-sm bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <small v-if="v$.unit_th.$error" class="text-red-500 float-right">{{ v$.unit_th.$errors[0].$message
                    }}</small>
                </div>
                
                <div class="mb-4 w-full">
                    <label for="unit_en" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unit Name</label>
                    <input type="text" id="unit_en" v-model="dataform.unit_en" placeholder="Please specify Unit name"
                        :class="v$.unit_en.$error ? 'border-red-300' : 'border-gray-300'"
                        class="shadow-sm bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <small v-if="v$.unit_en.$error" class="text-red-500 float-right">{{ v$.unit_en.$errors[0].$message
                    }}</small>
                </div>
               </div>              

                <!-- status -->
                <div class="mb-4">
              <label for="categories" class="block mb-2 text-base font-medium text-black dark:text-white">Status <span class="text-red-500">*</span></label>
                <select id="categories" v-model="dataform.device_status" :class="v$.device_status.$error?'border-red-300':'border-gray-300'" class="bg-gray-50 border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="active" >Active</option>
                  <option value="inactive" >Inactive</option>
                </select>
                <small v-if="v$.device_status.$error" class="text-red-500 float-right">{{ v$.device_status.$errors[0].$message }}</small>
            </div>

             <!-- type -->
             <div class="mb-4">
              <label for="categories" class="block mb-2 text-base font-medium text-black dark:text-white">Type <span class="text-red-500">*</span></label>
                <select id="categories" v-model="dataform.type" :class="v$.type.$error?'border-red-300':'border-gray-300'" class="bg-gray-50 border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" disabled selected>กรุณาเลือก Type</option>
                    <option value="lan">Lan</option>
                </select>
                <small v-if="v$.type.$error" class="text-red-500 float-right">{{ v$.type.$errors[0].$message }}</small>
            </div>

            

             <!-- category -->
             <div class="mb-4">
              <label for="categories" class="block mb-2 text-base font-medium text-black dark:text-white">Category <span class="text-red-500">*</span></label>
                <select id="categories" v-model="dataform.categoryId" :class="v$.categoryId.$error?'border-red-300':'border-gray-300'" class="bg-gray-50 border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" disabled selected>กรุณาเลือก Category</option>
                    <option value="1"  >กลุ่มดิน</option>
                  <option value="2" >กลุ่มน้ำ</option>
                  <option value="3"  >กลุ่มอากาศ</option>
                  <option value="4" >กลุ่มแสง</option>
                  <option value="5"  >กลุ่มเสียง</option>
                  <option value="6" >กลุ่มพลังงาน</option>
                  <option value="7"  >กลุ่มตำแหน่ง</option>
                  <option value="8" >กลุ่มอื่นๆ</option>
                </select>
                <small v-if="v$.categoryId.$error" class="text-red-500 float-right">{{ v$.categoryId.$errors[0].$message }}</small>
            </div>

            <!-- image -->
            <div class="flex justify-center items-center w-full h-72 pb-8">
            <label v-if="image_upload ==''" for="dropzone-file"
              class="flex flex-col justify-center items-center w-full h-full bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-white dark:hover:border-white dark:hover:bg-gray-600">
              <div class="flex flex-col justify-center items-center pt-5 pb-6">
                <p class="mb-2 text-sm text-gray-500 dark:text-white"><span class="font-semibold">คลิกเพื่ออัปโหลด</span> หรือ ลากและวาง</p>
                <p class="text-xs text-gray-500 dark:text-white">.Webp, PNG or JPG (MAX. 800x400px)</p>
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


                <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
                    <button type="submit"
                        class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:mr-2"><i
                            class="fa-solid fa-check sm:mr-3"></i>บันทึกข้อมูล</button>
                    <button type="button" @click="closeForm()"
                        class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:ml-2"><i
                            class="fa-solid fa-xmark sm:mr-3"></i>ยกเลิก</button>
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
