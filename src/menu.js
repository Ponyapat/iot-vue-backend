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
  mdiFruitWatermelon
} from '@mdi/js'

export default [
  'General',
  [
    {
      to: '/dashboard',
      icon: mdiDesktopMac,
      label: 'Dashboard'
    }
  ],
  'Admin',
  [
    {
      to: '/my-customers',
      label: 'ข้อมูลลูกค้าของฉัน',
      icon: mdiEarth
    },
    {
      to: '/customers',
      label: 'ข้อมูลลูกค้าสำหรับฝ่ายขาย',
      icon: mdiEarth
    },
    {
      to: '/geography',
      label: 'ภูมิศาสตร์(ข้อมูลลูกค้า)',
      icon: mdiEarth
    },
    {
      to: '/geography_base',
      label: 'ภูมิศาสตร์(ข้อมูลกลาง)',
      icon: mdiEarth
    },
    {
      to: '/weather',
      label: 'ภูมิอากาศ',
      icon: mdiWeatherPartlyRainy
    },
    {
      to: '/fruits',
      label: 'พืชพันธุ์ผลไม้',
      icon: mdiFruitCherries
    },
    // {
    //   to: '/customers',
    //   label: 'Customer',
    //   icon: mdiAccount
    // },
    {
      to: '/users',
      label: 'Admin',
      icon: mdiAccount
    },
    {
      to: '/roles',
      label: 'Role',
      icon: mdiShieldAccountVariant
    },
    {
      to: '/fruits-type',
      label: 'ประเภทพืชพันธุ์ผลไม้',
      icon: mdiFruitWatermelon
    },

    // {
    //   label: 'Submenus',
    //   subLabel: 'Submenus Example',
    //   icon: mdiViewList,
    //   menu: [
    //     {
    //       to: '/tables',
    //       label: 'Tables',
    //       icon: mdiTable
    //     },
    //     {
    //       to: '/forms',
    //       label: 'Forms',
    //       icon: mdiSquareEditOutline
    //     },
    //     {
    //       to: '/ui',
    //       label: 'UI',
    //       icon: mdiTelevisionGuide
    //     },
    //     {
    //       to: '/responsive',
    //       label: 'Responsive',
    //       icon: mdiResponsive
    //     },
    //     // {
    //     //   to: '/',
    //     //   label: 'Styles',
    //     //   icon: mdiPalette
    //     // },
    //     // {
    //     //   to: '/profile',
    //     //   label: 'Profile',
    //     //   icon: mdiAccountCircle
    //     // },
    //     // {
    //     //   to: '/login',
    //     //   label: 'Login',
    //     //   icon: mdiLock
    //     // },
    //     // {
    //     //   to: '/error',
    //     //   label: 'Error',
    //     //   icon: mdiAlertCircle
    //     // },
    //     {
    //       to: '/test',
    //       icon: mdiDesktopMac,
    //       label: 'TEST'
    //     },
    //   ]
    // }
  ],
  // 'About',
  // [
  //   {
  //     href: 'https://justboil.me/tailwind-admin-templates/vue-dashboard/',
  //     label: 'Premium version',
  //     icon: mdiMonitorShimmer,
  //     target: '_blank'
  //   },
  //   {
  //     href: 'https://github.com/justboil/admin-one-vue-tailwind',
  //     label: 'GitHub',
  //     icon: mdiGithub,
  //     target: '_blank'
  //   }
  // ]
]
