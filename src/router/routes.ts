import type { Route } from '@vaadin/router'
import { ROUTER_DEFAULT, ROUTER_GAME } from '../common/consts'

export const routes: Route[] = [
  {
    path: '/',
    name: ROUTER_DEFAULT,
    component: 'landing-element',
    action: async () => {
      await import('../ui/components/LandingElement')
    },
  },
  {
    path: '/game',
    name: ROUTER_GAME,
    component: 'game-element',
    action: async () => {
      await import('../ui/components/GameElement')
    },
  },
  {
    path: '(.*)',
    name: 'not-found',
    component: 'not-found-element',
    action: async () => {
      await import('../ui/components/NotFoundElement')
    },
  },
]
