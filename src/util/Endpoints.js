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
    "api/notification/listDefaultMessageForNotification",
  listOsByProviderIdAndSituationOpened:
    "api/os/listOsByProviderIdAndSituationOpened?providerId=",
  listOsByProviderIdAndInProgress:
    "api/os/listOsByProviderIdAndInProgress?providerId=",
  listOsByProviderIdAndSituationClosed:
    "api/os/listOsByProviderIdAndSituationClosed?providerId=",
  changeSituation: "api/os/changeSituation",
  listByProviderId: "api/user/listByProviderId?providerId=",
  getOsByNumber: "api/os/getOsByNumber?numberOS="
};

export default apis;
