import { mainFactory } from './utilities/main-factory.js'
import { AutoLayoutNode } from './utilities/types.js'

export default mainFactory(function (node: AutoLayoutNode): void {
  node.children[node.children.length - 1].remove()
})
