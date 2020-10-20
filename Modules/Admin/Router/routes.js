
export default {
  admin: {
    path: '/admin',
    // name: 'admin',
    meta: {
      auth: ['admin', 'god']
    },
    components: {
      default: require('@/Modules/Admin/Layouts/elementAdmin').default.default
    },
    children: [
      {
        name: 'dash',
        path: '/',
        component: require('@/Modules/Admin/Templates/dash').default.default
      },
      {
        name: 'adminChallengesIndex',
        path: 'challenges-list',
        component: require('@/Modules/Challenges/Transitions/adminChallengesIndex').default
      },
      {
        name: 'adminChallengesTab',
        path: 'challenges/advanced',
        component: require('@/Modules/Challenges/Transitions/adminChallengesTab').default
      },
      {
        name: 'adminChallengeGameEditTab',
        path: 'game/edit/:id',
        component: require('@/Modules/Games/Transitions/adminGameEdition').default
      },
      {
        // name: 'adminChallengesTab',
        path: 'tab',
        component: require('@/Modules/Challenges/Transitions/adminChallengesTab').default,
        children: [
          {
            name: 'adminChallengesNewTab',
            path: '/',
            component: require('@/Modules/Challenges/Transitions/adminChallengesIndex').default
          },
          {
            name: 'adminChallengeEditTab',
            path: 'edit/:id',
            component: require('@/Modules/Challenges/Transitions/adminChallengeEdit').default
          },
          {
            name: 'adminChallengeGamesHomeTab',
            path: 'games-list',
            component: require('@/Modules/Games/Transitions/adminGamesHome').default
          }
        ]
      },
      {
        name: 'adminChallengeEdit',
        path: 'challenge/edit/:id',
        component: require('@/Modules/Challenges/Transitions/adminChallengeEdit').default
      },
      {
        name: 'adminInterestsIndex',
        path: 'interets',
        component: require('@/Modules/Interets/Transitions/adminInterestsIndex').default
      },
      {
        name: 'adminInterestEdit',
        path: 'interet/edit/:id',
        component: require('@/Modules/Interets/Transitions/AdminInterestEdit').default
      },
      {
        name: 'adminUserEdit',
        path: 'user/edit/:id',
        component: require('@/Modules/Users/Transitions/AdminUserEdit').default
      },
      {
        name: 'adminUsersIndexDefault',
        path: 'users',
        component: require('@/Modules/Users/Transitions/adminUsersIndex').default
      },
      {
        name: 'adminUsersIndex',
        path: 'users/:tab',
        component: require('@/Modules/Users/Transitions/adminUsersIndex').default
      },
      {
        name: 'adminSettingsIndex',
        path: 'settings',
        component: require('@/Modules/Settings/Transitions/adminSettingsIndex').default
      },
      {
        name: 'adminMatchEdit',
        path: 'match/edit/:id',
        component: require('@/Modules/Matches/Transitions/AdminMatchEdit').default
      },
      {
        name: 'adminMediaEdit',
        path: 'media/edit/:id',
        component: require('@/Modules/Medias/Transitions/adminMediaEdit').default
      }
    ]
  }
}
