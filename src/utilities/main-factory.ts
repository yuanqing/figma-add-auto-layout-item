import {
  formatErrorMessage,
  setRelaunchButton
} from '@create-figma-plugin/utilities'

import { AutoLayoutNode } from './types.js'

export function mainFactory(
  processAutoLayoutNode: (node: AutoLayoutNode) => void
): () => void {
  return function (): void {
    const autoLayoutNodes = getSelectedAutoLayoutNodes()
    if (autoLayoutNodes.length === 0) {
      figma.closePlugin(
        formatErrorMessage('No Auto Layout layers in selection')
      )
      return
    }
    for (const node of autoLayoutNodes) {
      processAutoLayoutNode(node)
      setRelaunchButton(node, 'addAutoLayoutItem')
      setRelaunchButton(node, 'removeAutoLayoutItem')
    }
    figma.closePlugin()
  }
}

function getSelectedAutoLayoutNodes(): Array<AutoLayoutNode> {
  const result: Array<AutoLayoutNode> = []
  for (const node of figma.currentPage.selection) {
    if ('layoutMode' in node) {
      result.push(node)
    }
  }
  return result
}
