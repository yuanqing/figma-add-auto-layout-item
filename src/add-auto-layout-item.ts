import { insertAfterNode } from '@create-figma-plugin/utilities'

import { mainFactory } from './utilities/main-factory.js'
import { AutoLayoutNode } from './utilities/types.js'

export default mainFactory(function (node: AutoLayoutNode): void {
  const lastChildNode = node.children[node.children.length - 1]
  if (!('clone' in lastChildNode)) {
    throw new Error('`clone` is `undefined`')
  }
  const clone = lastChildNode.clone()
  insertAfterNode(clone, lastChildNode)
})
