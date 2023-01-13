import {
  mdiAccountCircle,
  mdiDesktopMac,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiMonitorShimmer,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiAccount,
  mdiEarth,
  mdiWeatherPartlyRainy,
  mdiShieldAccountVariant,
  mdiFruitCherries,
  mdiFruitWatermelon,
  mdiFaceAgent,
  mdiAccountSupervisorOutline,
} from "@mdi/js";

import axios from "axios";

const token = localStorage.getItem("tkfw");
const roleid = localStorage.getItem("roleid");
let menu = [];

if (roleid) {
  await axios
    .get(
      import.meta.env.VITE_API_MAIN + "/role/" + roleid + "/role-permission",
      {
        headers: {
          Authorization: `Bearer ` + token,
        },
      }
    )
    .then((data) => {
      if (roleid == 1) {
        menu.push({ to: "/users", label: "ผู้ใช้งาน", icon: mdiAccount });
        menu.push({
          to: "/roles",
          label: "Role",
          icon: mdiShieldAccountVariant,
        });
      }
      const rolePermission = data.data.data.rolePermission;
      let pms = [];
      for (const [key, value] of Object.entries(rolePermission)) {
        pms.push({
          permissionId: value.permissionId,
          action: value.permission[0].action,
          object: value.permission[0].object[0].name,
        });
        pms.push({
          permissionId: value.permissionId,
          action: value.permission[0].action,
          object: value.permission[0].object[0].name,
        });

        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "breed-categorise"
        ) {
          menu.push({
            to: "/fruits-type",
            label: "ประเภทพืชพันธุ์ผลไม้",
            icon: mdiFruitWatermelon,
          });
        }
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "breed"
        ) {
          menu.push({
            to: "/fruits",
            label: "พืชพันธุ์ผลไม้",
            icon: mdiFruitCherries,
          });
        }
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "geography"
        ) {
          menu.push({
            to: "/geography",
            label: "ภูมิศาสตร์(ข้อมูลลูกค้า)",
            icon: mdiEarth,
          });
        }
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "geography-base"
        ) {
          menu.push({
            to: "/geography_base",
            label: "ภูมิศาสตร์(ข้อมูลกลาง)",
            icon: mdiEarth,
          });
        }
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "weather"
        ) {
          menu.push({
            to: "/weather",
            label: "ภูมิอากาศ",
            icon: mdiWeatherPartlyRainy,
          });
        }
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "customer"
        ) {
          menu.push({
            to: "/my-customers",
            label: "ข้อมูลลูกค้าของฉัน",
            icon: mdiAccountSupervisorOutline,
          });
        }
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "other-customer"
        ) {
          menu.push({
            to: "/customers",
            label: "ข้อมูลลูกค้าสำหรับฝ่ายขาย",
            icon: mdiFaceAgent,
          });
        }
      }
      localStorage.setItem("pms", JSON.stringify(pms));
    })
    .catch((error) => {
      console.log(error);
    });
}

export default [
  "General",
  [
    {
      to: "/dashboard",
      icon: mdiDesktopMac,
      label: "Dashboard",
    },
  ],
  "Admin",
  menu,
];
