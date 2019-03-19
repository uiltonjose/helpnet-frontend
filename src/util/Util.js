export const getElementById = function getElementById(array, id) {
  return array.find(element => {
    if (element.ID !== undefined) {
      return element.ID.toString() === id;
    } else {
      return element.id.toString() === id;
    }
  });
};
