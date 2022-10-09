import { KeyboardElement } from './components/KeyboardElement'
import { GameElement } from './components/GameElement'
import { CanvasElement } from './components/CanvasElement'
import { ActionBar } from './ui/components/ActionBar'

declare global {
  interface HTMLElementTagNameMap {
    'game-element': GameElement
    'keyboard-element': KeyboardElement
    'canvas-element': CanvasElement
    'action-bar-element': ActionBar
  }
}

/// <reference types="vite/client" />
