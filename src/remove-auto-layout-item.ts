import {
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
    removeAutoLayoutItemFromInstanceNode(node)
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
    setRelaunchButton(node, 'addAutoLayoutItem')
    unsetRelaunchButton(node, 'removeAutoLayoutItem')
    return
  }
  // At least 1 visible child node in `node`
  lastVisibleChildNode.remove()
  const visibleNodeCount = node.children.filter(function (
    node: SceneNode
  ): boolean {
    return node.visible === true
  }).length
  if (visibleNodeCount === 0) {
    // No visible child nodes in `node`
    unsetRelaunchButton(node, 'removeAutoLayoutItem')
  } else {
    // At least 1 visible child node in `node`
    setRelaunchButton(node, 'removeAutoLayoutItem')
  }
  if (node.children.length === 0) {
    // No hidden child nodes in `node`
    unsetRelaunchButton(node, 'addAutoLayoutItem')
  } else {
    // At least 1 hidden child node in `node`
    setRelaunchButton(node, 'addAutoLayoutItem')
  }
})

function removeAutoLayoutItemFromInstanceNode(node: InstanceNode): void {
  const { firstHiddenInstanceNode, lastVisibleInstanceNode } =
    parseInstanceNode(node)
  if (firstHiddenInstanceNode === null && lastVisibleInstanceNode === null) {
    // No instance nodes in `node`
    unsetRelaunchButton(node, 'addAutoLayoutItem')
    unsetRelaunchButton(node, 'removeAutoLayoutItem')
    return
  }
  if (lastVisibleInstanceNode === null) {
    // No visible instance nodes in `node`
    setRelaunchButton(node, 'addAutoLayoutItem')
    unsetRelaunchButton(node, 'removeAutoLayoutItem')
    return
  }
  // At least 1 visible instance node in `node`
  lastVisibleInstanceNode.visible = false
  const visibleInstanceNodeCount = node.children.filter(function (
    node: SceneNode
  ): boolean {
    return node.type === 'INSTANCE' && node.visible === true
  }).length
  if (visibleInstanceNodeCount === 0) {
    // No more visible instance nodes in `node`
    unsetRelaunchButton(node, 'removeAutoLayoutItem')
  } else {
    // At least 1 visible instance node in `node`
    setRelaunchButton(node, 'removeAutoLayoutItem')
  }
  setRelaunchButton(node, 'addAutoLayoutItem')
}
