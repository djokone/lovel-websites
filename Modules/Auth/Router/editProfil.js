import editsProfilTransition from '../Transitions/editsTransition'
import editProfilTransition from '../Transitions/editTransition'
import editProfil from '../Templates/editProfil'
import editPhoto from '../Templates/editPhoto'
import editSociety from '../Templates/editSociety'
import editWebsite from '../Templates/editWebsite'
import modal from '@/Modules/Modal/Router/modal'

export default {
  '/edit': {
    name: 'editAll',
    meta: { auth: ['admin', 'rev'] },
    component: editProfilTransition,
    children: {
      // '/popup': modal['/popup'],
      '': {
        component: editsProfilTransition,
        children: modal
      },
      '/profil': {
        name: 'editProfil',
        component: editProfil,
        children: modal
      },
      '/photo': {
        name: 'editPhoto',
        component: editPhoto,
        children: modal
      },
      '/society': {
        name: 'editSociety',
        component: editSociety,
        children: modal
      },
      '/website': {
        name: 'editWebsite',
        component: editWebsite,
        children: modal
      }
    }
  }
}
