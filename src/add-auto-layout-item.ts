import {
  insertAfterNode,
  setRelaunchButton,
  unsetRelaunchButton
} from '@create-figma-plugin/utilities'

import { mainFactory } from './utilities/main-factory.js'
import { parseInstanceNode } from './utilities/parse-instance-node.js'
import { AutoLayoutNode } from './utilities/types.js'

export default mainFactory(function (node: AutoLayoutNode): void {
  if (node.children.length === 0) {
    unsetRelaunchButton(node, 'addAutoLayoutItem')
    unsetRelaunchButton(node, 'removeAutoLayoutItem')
    return
  }
  if (node.type === 'INSTANCE') {
    addAutoLayoutItemToInstanceNode(node)
    return
  }
  const lastVisibleChildNode = node.children
    .slice()
    .reverse()
    .find(function (node: SceneNode): boolean {
      return node.visible === true
    })
  if (typeof lastVisibleChildNode === 'undefined') {
    // No visible child nodes in `node`
    node.children[0].visible = true
  } else {
    // At least 1 visible child node in `node`
    if (!('clone' in lastVisibleChildNode)) {
      throw new Error('`clone` is `undefined`')
    }
    const clone = lastVisibleChildNode.clone()
    insertAfterNode(clone, lastVisibleChildNode)
  }
  setRelaunchButton(node, 'addAutoLayoutItem')
  setRelaunchButton(node, 'removeAutoLayoutItem')
})

function addAutoLayoutItemToInstanceNode(node: InstanceNode): void {
  const { firstHiddenInstanceNode, lastVisibleInstanceNode } =
    parseInstanceNode(node)
  if (firstHiddenInstanceNode === null && lastVisibleInstanceNode === null) {
    // No instance nodes in `node`
    unsetRelaunchButton(node, 'addAutoLayoutItem')
    unsetRelaunchButton(node, 'removeAutoLayoutItem')
    return
  }
  if (firstHiddenInstanceNode === null) {
    // No more hidden instance nodes in `node`
    unsetRelaunchButton(node, 'addAutoLayoutItem')
    setRelaunchButton(node, 'removeAutoLayoutItem')
    return
  }
  // At least 1 hidden instance node in `node`
  firstHiddenInstanceNode.visible = true
  if (lastVisibleInstanceNode !== null) {
    firstHiddenInstanceNode.mainComponent =
      lastVisibleInstanceNode.mainComponent
  }
  const hiddenInstanceNodeCount = node.children.filter(function (
    node: SceneNode
  ): boolean {
    return node.type === 'INSTANCE' && node.visible === false
  }).length
  if (hiddenInstanceNodeCount === 0) {
    // No more hidden instance nodes in `node`
    unsetRelaunchButton(node, 'addAutoLayoutItem')
  } else {
    // At least 1 hidden instance node in `node`
    setRelaunchButton(node, 'addAutoLayoutItem')
  }
  setRelaunchButton(node, 'removeAutoLayoutItem')
}
