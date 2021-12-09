import { formatErrorMessage } from '@create-figma-plugin/utilities'

import { AutoLayoutNode } from './types.js'

export function mainFactory(
  processAutoLayoutNode: (node: AutoLayoutNode) => void
): () => void {
  return function (): void {
    const nodes = getSelectedAutoLayoutNodes()
    if (nodes.length === 0) {
      figma.closePlugin(
        formatErrorMessage('No Auto Layout layers in selection')
      )
      return
    }
    for (const node of nodes) {
      processAutoLayoutNode(node)
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
