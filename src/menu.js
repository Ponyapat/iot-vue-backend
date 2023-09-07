
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
  mdiGroup
} from "@mdi/js";

import axios from "axios";

const token = localStorage.getItem("tkfw");
const roleid = localStorage.getItem("roleid");
let menu = [];
let sub_menu_breed = [];
let sub_geo = [];
let sub_customer = [];
let sub_sensor = [];

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
        menu.push({
          label: "ตั้งค่า/จัดการผู้ดูแล",
          icon: mdiViewList,
          menu: [
            { to: "/users", label: "ผู้ดูแล", icon: mdiAccount },
            {
              to: "/roles",
              label: "สถานะผู้ดูแล",
              icon: mdiShieldAccountVariant,
            },
          ],
        });
      }

      
      // menu.push({
      //   label: "ข้อมูลด้านพืชพรรณ",
      //   icon: mdiViewList,
      //   menu: sub_menu_breed,
      // });
    

      

      menu.push({
        label: "ข้อมูลลูกค้าสำหรับฝ่ายขาย",
        icon: mdiViewList,
        menu: sub_customer,
      });

  

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

        // Plant
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "breed-categorise"
        ) {
          sub_menu_breed.push({
            to: "/fruits-type",
            label: "ประเภทพืชพรรณ",
            icon: mdiFruitWatermelon,
          });
        }
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "breed"
        ) {
          sub_menu_breed.push({
            to: "/fruits",
            label: "ฐานข้อมูลพืชพรรณ",
            icon: mdiFruitCherries,
          });
        }
        
      
        // Custumer
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "geography"
        ) {
          sub_geo.push({
            to: "/geography",
            label: "ฐานข้อมูลลูกค้า",
            icon: mdiEarth,
          });
        }

        //Database
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "geography-base"
        ) {
          sub_geo.push({
            to: "/geography_base",
            label: "ฐานข้อมูลกลาง",
            icon: mdiEarth,
          });
        }

        /** 
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "weather"
        ) {
          menu.push({
            label: "ข้อมูลด้านภูมิอากาศ",
            icon: mdiViewList,
            menu: [
              {
                to: "/weather",
                label: "ฐานข้อมูลภูมิอากาศ",
                icon: mdiWeatherPartlyRainy,
              },
            ],
          });
        }
        */

        //User
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "customer"
        ) {
          menu.push({
            label: "ผู้ใช้งานแพลตฟอร์มและแอปพลิเคชั่น",
            icon: mdiViewList,
            menu: [
              {
                to: "/my-customers",
                label: "ผู้ใช้งานแพลตฟอร์ม",
                icon: mdiAccountSupervisorOutline,
              },
            ],
          });
        }

        //Custumer Database
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "other-customer"
        ) {
          sub_customer.push({
            to: "/customers",
            label: "ฐานข้อมูลลูกค้า",
            icon: mdiFaceAgent,
          });
        }

        //Warranty
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "warranty"
        ) {
          sub_customer.push({
            to: "/warranty-list",
            label: "ข้อมูลการประกันสินค้า",
            icon: mdiFaceAgent,
          });
        }

        //Board Status
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "board-status"
        ) {
          sub_customer.push({
            to: "/board-list",
            label: "สถานะการทำงานของบอร์ด",
            icon: mdiFaceAgent,
          });
        }

        /** 
        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "keyword"
        ) {
          menu.push({
            label: "ตลาด",
            icon: mdiViewList,
            menu: [
              {
                to: "/keyword",
                label: "คำค้นหาสถานที่",
                icon: mdiFaceAgent,
              },
            ],
          });
        }
        */

       

        

        if (
          value.permission[0].action == "read" &&
          value.permission[0].object[0].name == "group-line"
        ) {
          menu.push({
            label: "ระบบแจ้งเตือน",
            icon: mdiViewList,
            menu: [
              {
                to: "/linegroup-list",
                label: "LINE Group",
                icon: mdiFaceAgent,
              },
            ],
          });
        }
        
      }
      //console.log(menu)
      if (sub_menu_breed.length == 0) {
        menu = menu.filter((x) => x.label != "ข้อมูลด้านพืชพรรณ");
      }
      if (sub_geo.length == 0) {
        menu = menu.filter((x) => x.label != "ข้อมูลด้านภูมิศาสตร์");
      }
      if (sub_customer.length == 0) {
        menu = menu.filter((x) => x.label != "ข้อมูลลูกค้าสำหรับฝ่ายขาย");
      }
      if (sub_sensor.length == 0) {
        menu = menu.filter((x) => x.label != "ข้อมูลเซ็นเซอร์");
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
