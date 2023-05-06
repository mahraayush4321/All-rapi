const Category = require("../models/catergoryModels");

const add_category = async (req, res) => {
  try {
    const category_data = await Category.find();
    if (category_data.length > 0) {
      let check = false;
      for (let i = 0; i < category_data.length; i++) {
        if (
          category_data[i]["category"].toLowerCase() ===
          req.body.category.toLowerCase()
        ) {
          check = true;
          break;
        }
        if (check == false) {
          const category = new Category({
            category: req.body.category,
          });
          const cat_data = await category.save();
          res
            .status(200)
            .send({ success: true, msg: "category data", data: cat_data });
        } else {
          res.status(200).send({
            success: true,
            msg: "This category (" + req.body.category + ") is already exists ",
          });
        }
      }
    } else {
      const category = new Category({
        category: req.body.category,
      });
      const cat_data = await category.save();
      res
        .status(200)
        .send({ success: true, msg: "category data", data: cat_data });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  add_category,
};
