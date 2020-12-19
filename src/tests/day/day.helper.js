const Day = require("../../modules/day/day.model");
const {testDay} = require("./day.variables");

const createDayTestHelper = async (userId) => {
  const day = new Day({
    ...testDay,
    user: userId,
  });
  await day.save();
  return day;
}

module.exports = {
  createDayTestHelper,
}