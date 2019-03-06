const apis = {
  listCustomerByProviderId: "api/customer/listByProviderId?providerId=",
  listNotificationsByProviderId:
    "api/notification/listByProviderId?providerId=",
  listOsByProviderId: "api/os/listByProviderId?providerId=",
  sendNotification: "api/notification/sendNotification",
  listProviders: "api/provider/listProviders",
  addUser: "api/user/add",
  updateUser: "api/user/activateUserWithProvider",
  getUserInfo: "api/user/info?userLogin=",
  listDefaultMessageForNotification:
    "api/notification/listDefaultMessageForNotification"
};

export default apis;
