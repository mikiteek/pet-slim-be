const testProduct = {
  categories: ["яйца"],
  weight: 100,
  title: {
    ru: "Омлет по киевски",
    ua: "Омлет по киевски",
  },
  calories: 321,
  groupBloodNotAllowed: {
    1: true,
    2: false,
    3: false,
    4: false,
  },
}
const testAdmin = {
  name: "John Wick",
  email: Date.now().toString() + "jonny@gmail.com",
  password: "111111",
  role: "admin",
}

module.exports = {
  testProduct,
  testAdmin
};