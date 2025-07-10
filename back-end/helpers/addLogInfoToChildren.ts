const Account = require("../models/account.model");

let addLogInfoToTree = async (nodes) => {
  for (const node of nodes) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: node.createdBy.account_id,
    });
    if (user) {
      node.accountFullName = user.fullName;
    }

    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = node.updatedBy[node.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullName;
    }

    // Recursively process children
    if (node.children && node.children.length > 0) {
      await addLogInfoToTree(node.children);
    }
  }
};

export default addLogInfoToTree = addLogInfoToTree;
