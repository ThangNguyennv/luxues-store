import { StatusItem } from "./filterStatus";
const filterOrderHelpers = (query: Record<string, any>): StatusItem[] => {
  const filterOrder: StatusItem[] = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Chờ duyệt",
      status: "waiting",
      class: "",
    },
    {
      name: "Đã xác nhận",
      status: "confirmed",
      class: "",
    },
    {
      name: "Đã hủy",
      status: "canceled",
      class: "",
    },
  ];
  const target = query.status ?? "";
  const index = filterOrder.findIndex((item) => item.status === target);
  if (index >= 0) {
    filterOrder[index].class = "confirmed";
  }

  return filterOrder;
};
export default filterOrderHelpers;
