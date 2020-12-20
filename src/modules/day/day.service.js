const getDayProductsOptionsService = (date, user) => [
  {
    $match: {
      date: new Date(date),
      user: user.id,
    },
  },
  {
    $lookup: {
      from: "products",
      localField: "product",
      foreignField: "_id",
      as: "product",
    }
  },
  {
    $unwind: "$product",
  },
  {
    $project: {
      totalWeight: "$weight",
      totalCalories: {
        $divide: [
          {
            $multiply: ["$weight", "$product.calories"]
          },
          "$product.weight"
        ]
      },
      date: true,
      product: {
        _id: true,
        weight: true,
        title: true,
        calories: true,
      }
    },
  },
]

module.exports = {
  getDayProductsOptionsService,
}