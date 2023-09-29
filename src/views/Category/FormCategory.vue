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
const id = url.searchParams.get("category");
const dataform = reactive({
    name_th: '',
    name_en: '',
});
const rules = {
    name_th: { required: helpers.withMessage('กรุณาระบุชื่อของประเภท Category', required) },
    name_en: { required: helpers.withMessage('Please specify the Category type', required) }, 
}
const v$ = useVuelidate(rules, dataform);

onMounted(() => {
    if (id) {
        type_form.value = 'แก้ไขประเภท Category'
        ApiMain.get("/sensor-category/" + id).then((res) => {
            dataform.name_th = res.data.data.name.th;
            dataform.name_en = res.data.data.name.en;
        }).catch((error) => {
            console.log(error);
        });
    }
    else {
        type_form.value = 'เพิ่มประเภท Category'
    }
})

const submit = async () => {

    const result = await v$.value.$validate();
    if (id) {
        if (result) {
            ApiMain.put("/sensor-category/" + id, {
                name: {
                    th: dataform.name_th,
                    en: dataform.name_en,
                }
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
                        router.push("/category-list");
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
            ApiMain.post("/sensor-category", {
                name: {
                    th: dataform.name_th,
                    en: dataform.name_en,
                }
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
                        router.push("/category-list");
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

const closeForm = () => {
    router.push('/category-list');
};

</script>

<template>
    <div class="flex justify-center bg-white m-4 p-10 rounded-2xl shadow-custom">
        <div class="w-full md:w-[500px] h-full">
            <h1 class="text-center font-semibold text-black text-2xl mb-10">{{ type_form }}</h1>
            <form @submit.prevent="submit">
                
                <div class="mb-6">
                    <label for="name_th"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อประเภท<span class="text-red-500">*</span></label>
                    <input type="text" id="name_th" v-model="dataform.name_th"
                        :class="v$.name_th.$error ? 'border-red-300' : 'border-gray-300'" placeholder="กรุณาระบุชื่อ Category"
                        class="shadow-sm bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <small v-if="v$.name_th.$error" class="text-red-500 float-right">{{ v$.name_th.$errors[0].$message
                    }}</small>
                </div>

                <div class="mb-10">
                    <label for="name_en" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
                    <input type="text" id="name_en" v-model="dataform.name_en"
                        :class="v$.name_en.$error ? 'border-red-300' : 'border-gray-300'" placeholder="Please specify Category name"
                        class="shadow-sm bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <small v-if="v$.name_en.$error" class="text-red-500 float-right">{{ v$.name_en.$errors[0].$message
                    }}</small>
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
}</style>
