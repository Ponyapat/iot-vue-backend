<script setup>
import { computed, ref, onBeforeMount, reactive  } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import { mdiTrashCan, mdiGreasePencil } from "@mdi/js";
const mainStore = useMainStore();

const lightBorderStyle = computed(() => mainStore.lightBorderStyle);

const tableTrStyle = computed(() => mainStore.tableTrStyle);

const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);

const edit = (id) => {
  console.log('Edit', id)
}
const del = (id) => {
  console.log('Delete', id)
}
const users = [
  {
    id: 1,
    username: "inkink1",
    name: "ink1",
    email: "ink1@gmailcom",
    status: "admin",
  },
  {
    id: 2,
    username: "inkink2",
    name: "ink2",
    email: "ink2@gmailcom",
    status: "super_admin",
  },
];
</script>
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td>{{ index + 1 }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.status }}</td>
          <td class="actions-cell">
            <jb-buttons type="justify-start lg:justify-end" no-wrap>
              <jb-button color="info" :icon="mdiGreasePencil" small @click="edit(user.id)" />
              <jb-button color="danger" :icon="mdiTrashCan" small @click="del(user.id)"/>
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
