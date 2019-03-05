export const getElementById = function getElementById(array, id) {
  return array.find(element => {
    return element.ID.toString() === id;
  });
};
