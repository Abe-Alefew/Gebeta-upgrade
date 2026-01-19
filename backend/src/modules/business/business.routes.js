import * as BussinessController from "./business.controller.js";

export const registerBusinessRoutes = (app) => {
  app.get("/api/businesses", BussinessController.getAll);

  //featured
  app.get("/api/businesses/featured", BussinessController.getFeatured);

  //category specification
  //in the manual router we created we check the url string before storing
  app.get(
    "/api/businesses/category/:category",
    BussinessController.getByCategory
  );

  //single bussiness getting using id
  app.get("/api/businesses/detail/:id", BussinessController.getById);

  //CRUD actions on the businesses
  app.post("/api/businesses", BussinessController.create);
  app.put("/api/businesses/:id", BussinessController.update);
  app.delete("/api/businesses/:id", BussinessController.remove);
};
