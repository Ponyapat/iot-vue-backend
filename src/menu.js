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
  mdiShieldAccountVariant
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
      to: '/geography',
      label: 'ภูมิศาสตร์',
      icon: mdiEarth
    },
    {
      to: '/weather',
      label: 'ภูมิอากาศ',
      icon: mdiWeatherPartlyRainy
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
