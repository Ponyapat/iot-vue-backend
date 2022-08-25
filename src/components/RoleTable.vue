
<script setup>
import { computed, ref, onBeforeMount, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import axios from "axios"
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import { mdiTrashCan, mdiGreasePencil } from "@mdi/js";

const mainStore = useMainStore();
const router = useRouter();
// const lightBorderStyle = computed(() => mainStore.lightBorderStyle)
const tableTrStyle = computed(() => mainStore.tableTrStyle);
const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);
const token = localStorage.getItem("tkfw");
const states = reactive({
  roles: {}
})

const fetchRoleData = () => {
  axios
    .get(import.meta.env.VITE_API_ENDPOINT + "/api/role", {
      headers: {
        Authorization: "Bearer " + token,
      }
    })
    .then((response) => {
      console.log('DEBUG:DATAROLE ', response)
      states.roles = response.data.data
    })
}
const edit = (id) => {
//   console.log('edit', id)
  router.push("/role/edit/" + id);
}

const del = (role) => {
  console.log('del', role.id)
  Swal.fire({
    title: "ยืนยันการลบ",
    text: `คุณต้องการลบสถานะ ${role.name} ใช่หรือไม่`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    console.log(result)
    if (result.isConfirmed) {
      console.log('ยืนยันการลบ')
      axios
        .delete(import.meta.env.VITE_API_ENDPOINT + "/api/role/" + role.id, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then((data) => {
          setInterval(function () {
            location.reload();
          }, 1500);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          // console.log("del" + id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  })
}

onBeforeMount(() => {
  fetchRoleData()
})

</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(role, index) in states.roles" :key="index" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="p-3" data-label="ID">{{ role.id }}</td>
          <td class="p-3" data-label="Name">{{ role.name }}</td>
          <td class="actions-cell">
            <jb-buttons type="justify-start lg:justify-end" no-wrap>
              <jb-button color="info" :icon="mdiGreasePencil" small @click="edit(role.id)" />
              <jb-button color="danger" :icon="mdiTrashCan" small @click="del(role)"/>
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
