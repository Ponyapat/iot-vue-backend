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

const titleStack = ref(["Admin", "แก้ไขข้อมูลภูมิศาสตร์ (ที่ดิน)"]);

// const selectOptions = [
//   { id: 1, label: "Business development" },
//   { id: 2, label: "Marketing" },
//   { id: 3, label: "Sales" },
// ];

// const customElementsForm = reactive({
//   checkbox: ["lorem"],
//   radio: "one",
//   switch: ["one"],
//   file: null,
// });

const router = useRouter();
const url = window.location.href;
const id = url.split("/")[5];

const form = reactive({
  title: "",
  detail: "",
  lat: "",
  long: "",
  land_detail: "",
  ri: "",
  ngan: "",
  wa: "",
  land_size: "",
  land_code: "",
  land_img: "",
  land_price_rate: "",
  land_price: "",
  land_type: "",
  land_properties: "",
  land_water: "",
  land_mineral: "",
  land_limitation: "",
});

onMounted(async () => {
  const token = localStorage.getItem("tkfw");
  await axios
      .get(import.meta.env.VITE_API_ENDPOINT + "/api/geo/"+id,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(response => {
        console.log(response.data)
        let landSize = response.data.geo.landSize;
        const landSize_split = landSize.split("-");
        //console.log(landSize_split)
        form.title=response.data.geo.title
        form.detail=response.data.geo.detail
        form.lat=response.data.geo.lat
        form.long=response.data.geo.lon
        form.land_detail=response.data.geo.landDetail

        form.ri=landSize_split[0]
        form.ngan=landSize_split[1]
        form.wa=landSize_split[2]

        form.land_code=response.data.geo.landCode
        form.land_img=response.data.geo.landImg

        form.land_price_rate=response.data.geo.landPriceRate
        form.land_price=response.data.geo.landPrice
        
        form.land_type=response.data.geo.landType
        form.land_properties=response.data.geo.landProperties
        form.land_water=response.data.geo.landWater

        form.land_mineral=response.data.geo.landMineral
        form.land_limitation=response.data.geo.landLimitation
      })
})

const submit = () => {
  const token = localStorage.getItem("tkfw");
  console.log(token); 
  axios
    .put(
      import.meta.env.VITE_API_ENDPOINT + "/api/geo/"+id,
      {
        title: form.title,
        detail: form.detail,
        lat: form.lat,
        lon: form.long,
        landImg: form.land_img,
        landDetail: form.land_detail,
        landSize: form.ri+"-"+form.ngan+"-"+form.wa,
        landCode: form.land_code,
        landPriceRate: form.land_price_rate,
        landPrice: form.land_price,
        landType: form.land_type,
        landProperties: form.land_properties,
        landWater: form.land_water,
        landMineral: form.land_mineral,
        landLimitation: form.land_limitation,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((data) => {
      //console.log(data.data);
      if (data.data.status == 204) {
        console.log(data.data.status);
        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลภูมิศาสตร์ (ที่ดิน) สำเร็จ",
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
      title="แก้ไขข้อมูลภูมิศาสตร์ (ที่ดิน)"
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

      <!-- <field label="Dropdown">
        <control v-model="form.department" :options="selectOptions" />
      </field> -->

      <divider />

      <field label="รายละเอียดที่ดิน">
        <control
          v-model="form.land_detail"
          type="textarea"
          placeholder="กรอกข้อมูลรายละเอียดที่ดิน"
        />
      </field>

      <field label="ขนาดที่ดิน (ไร่-งาน-วา)">
        <control v-model="form.ri" type="text" placeholder="ไร่" />
        <control v-model="form.ngan" type="text" placeholder="งาน" />
        <control v-model="form.wa" type="text" placeholder="ตารางวา" />
      </field>

      <field label="เลขโฉนดที่ดิน">
        <control
          v-model="form.land_code"
          type="text"
          placeholder="กรอกเลขโฉนดที่ดิน"
        />
      </field>

      <field label="รูปภาพขอบเขตที่ดิน">
        <control
          v-model="form.land_img"
          type="text"
          placeholder="รูปภาพขอบเขตที่ดิน"
        />
      </field>

      <field label="ราคาประเมิน (บาท/ตารางวา)">
        <control
          v-model="form.land_price_rate"
          type="text"
          placeholder="กรอกราคาประเมิน"
        />
      </field>

      <field label="ราคาประเมินทั้งแปลง">
        <control
          v-model="form.land_price"
          type="text"
          placeholder="ราคาประเมินทั้งแปลง"
        />
      </field>

      <field label="ชนิดของดิน">
        <control
          v-model="form.land_type"
          type="text"
          placeholder="ชนิดของดิน"
        />
      </field>

      <field label="คุณสมบัติของดิน">
        <control
          v-model="form.land_properties"
          type="text"
          placeholder="คุณสมบัติของดิน"
        />
      </field>
      <field label="แหล่งน้ำใกล้เคียง">
        <control
          v-model="form.land_water"
          type="text"
          placeholder="แหล่งน้ำใกล้เคียง"
        />
      </field>
      <field label="แหล่งแร่ธาตุใกล้เคียง">
        <control
          v-model="form.land_mineral"
          type="text"
          placeholder="แหล่งแร่ธาตุใกล้เคียง"
        />
      </field>
      <field label="ข้อจำกัดของดิน">
        <control
          v-model="form.land_limitation"
          type="text"
          placeholder="ข้อจำกัดของดิน"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="อัพเดท" />
        <!-- <jb-button type="reset" color="info" outline label="Reset" /> -->
      </jb-buttons>
    </card-component>
  </main-section>

  <!-- <titled-section> Custom elements </titled-section>

  <main-section>
    <card-component title="Custom elements" :icon="mdiBallotOutline">
      <field label="Checkbox" wrap-body>
        <check-radio-picker
          v-model="customElementsForm.checkbox"
          name="sample-checkbox"
          :options="{ lorem: 'Lorem', ipsum: 'Ipsum', dolore: 'Dolore' }"
        />
      </field>

      <divider />

      <field label="Radio" wrap-body>
        <check-radio-picker
          v-model="customElementsForm.radio"
          name="sample-radio"
          type="radio"
          :options="{ one: 'One', two: 'Two' }"
        />
      </field>

      <divider />

      <field label="Switch">
        <check-radio-picker
          v-model="customElementsForm.switch"
          name="sample-switch"
          type="switch"
          :options="{ one: 'One', two: 'Two' }"
        />
      </field>

      <divider />

      <file-picker v-model="customElementsForm.file" />
    </card-component>
  </main-section> -->

  <bottom-other-pages-section />
</template>
