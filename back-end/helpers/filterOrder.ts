module.exports = (query) => {
  let filterOrder = [
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

  if (query.status) {
    const index = filterOrder.findIndex((item) => item.status == query.status);
    filterOrder[index].class = "confirmed";
  } else {
    const index = filterOrder.findIndex((item) => item.status == "");
    filterOrder[index].class = "confirmed";
  }

  return filterOrder;
};
