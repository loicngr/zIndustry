import { Router } from '@vaadin/router'
import type { Params } from '@vaadin/router'
import { routes } from './routes'

const router = new Router()
router.setRoutes([...routes])

export const bind = (outlet: HTMLElement) => router.setOutlet(outlet)

export const goTo = (name: string, params?: Params) => router.urlForName(name, params)
