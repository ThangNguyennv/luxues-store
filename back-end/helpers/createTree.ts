export interface TreeNode {
  id: string;
  parent_id: string;
  [key: string]: any;
}

let count = 0; // Biến toàn cục, lưu trên server, chỉ reset lại khi tắt server
const createTree = (arr: TreeNode[], parentId: string = ""): TreeNode[] => {
  const tree: TreeNode[] = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count++;
      const newItem: TreeNode = { ...item, index: count };
      const children = createTree(arr, item.id);
      if (children.length) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

const tree = (arr: TreeNode[], parentId: string = ""): TreeNode[] => {
  count = 0;
  const tree = createTree(arr, parentId);
  return tree;
};
export default tree;
