export interface BstNode { key: number; left?: BstNode; right?: BstNode; }

export const insertBst = (root: BstNode | undefined, key: number): BstNode => {
  if (!root) return { key };
  if (key < root.key) root.left = insertBst(root.left, key);
  else root.right = insertBst(root.right, key);
  return root;
};

export const toArrayInOrder = (root?: BstNode, out: number[] = []) => {
  if (!root) return out;
  toArrayInOrder(root.left, out);
  out.push(root.key);
  toArrayInOrder(root.right, out);
  return out;
};
