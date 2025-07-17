import { Document } from 'mongoose'
export interface TreeItem extends Document {
  id: string;
  parent_id: string;
  [key: string]: unknown;
  index?: number;
  children?: TreeItem[];
}

let count = 0

export const createTree = (
  arr: TreeItem[],
  parentId: string = ''
): TreeItem[] => {
  const tree: TreeItem[] = []
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count++
      const newItem = { ...item.toObject(), index: count } as TreeItem
      const children = createTree(arr, item.id)
      if (children.length > 0) {
        newItem.children = children
      }
      tree.push(newItem)
    }
  })
  return tree
}

export const tree = (arr: TreeItem[], parentId: string = ''): TreeItem[] => {
  count = 0
  return createTree(arr, parentId)
}
