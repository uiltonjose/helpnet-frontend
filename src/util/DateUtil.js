  const getDateToFileName = () => {
    let date = new Date();
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    let mon = date.getMonth();
    mon = mon + 1;
    if (mon < 10) {
      mon = `0${mon}`;
    }
    let year = date.getFullYear();
    return day + "_" + mon + "_" + year;
  }
  module.exports = {
    getDateToFileName: getDateToFileName
};
