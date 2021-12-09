export function parseInstanceNode(node: InstanceNode): {
  firstHiddenInstanceNode: null | InstanceNode
  lastVisibleInstanceNode: null | InstanceNode
} {
  let firstHiddenInstanceNode: null | InstanceNode = null
  let lastVisibleInstanceNode: null | InstanceNode = null
  for (const childNode of node.children) {
    if (childNode.type === 'INSTANCE' && childNode.visible === false) {
      if (firstHiddenInstanceNode === null) {
        firstHiddenInstanceNode = childNode
        break
      }
    }
  }
  for (const childNode of node.children.slice().reverse()) {
    if (childNode.type === 'INSTANCE' && childNode.visible === true) {
      if (lastVisibleInstanceNode === null) {
        lastVisibleInstanceNode = childNode
        break
      }
    }
  }
  return {
    firstHiddenInstanceNode,
    lastVisibleInstanceNode
  }
}
