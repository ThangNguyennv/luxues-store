import Account from '../models/account.model'
import { TreeItem } from './createTree'

interface UserRef {
  account_id: string;
  accountFullName?: string;
}

export interface LogNode extends TreeItem {
  createdBy: UserRef[];
  updatedBy: UserRef[];
  accountFullName?: string;
}

// Second helper: add log info to each node
export const addLogInfoToTree = async (nodes: LogNode[]): Promise<void> => {
  for (const node of nodes) {
    // Lấy thông tin người tạo
    const creator = node.createdBy?.[0]
    if (creator) {
      const user = await Account.findById(creator.account_id).exec()
      if (user) {
        node.accountFullName = user.fullName
      }
    }

    // Lấy thông tin người cập nhật gần nhất
    // const lastUpdater = node.updatedBy?.slice(-1)[0]
    const lastUpdater = node.updatedBy[node.updatedBy.length - 1]
    if (lastUpdater) {
      const userUpdated = await Account.findById(lastUpdater.account_id).exec()
      if (userUpdated) {
        lastUpdater.accountFullName = userUpdated.fullName
      }
    }

    // Đệ quy xử lý children
    if (node.children && node.children.length > 0) {
      await addLogInfoToTree(node.children as LogNode[])
    }
  }
}
