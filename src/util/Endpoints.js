const apis = {
  listCustomerByProviderId: "api/customer/listByProviderId?providerId=",
  listNotificationsByProviderId:
    "api/notification/listByProviderId?providerId=",
  listOSsByProviderId: "api/os/listByProviderId?providerId=",
  sendNotification: "api/notification/sendNotification",
  listProviders: "api/provider/listProviders",
  addUser: "api/user/add",
  updateUser: "api/user/updateStatus",
  getUserInfo: "api/user/info?userLogin="
};

export default apis;
