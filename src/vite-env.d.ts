import { KeyboardElement } from './components/KeyboardElement'
import { GameElement } from './components/GameElement'
import { CanvasElement } from './components/CanvasElement'
import { ActionBar } from './ui/components/ActionBar'
import { LandingElement } from './ui/components/LandingElement'
import { AppElement } from './ui'

declare global {
  interface HTMLElementTagNameMap {
    'app-element': AppElement
    'landing-element': LandingElement
    'game-element': GameElement
    'keyboard-element': KeyboardElement
    'canvas-element': CanvasElement
    'action-bar-element': ActionBar
  }
}

/// <reference types="vite/client" />
