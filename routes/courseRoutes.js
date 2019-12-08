const isAuthenticated = require("../middlewares/isAuthenticated");
const Course = require("../models/Courses");

module.exports = app => {
  app.get("/courses", (req, res) => {
    res.send([{ title: "Amir", description: "ASDaSD", url: "ASD" }]);
    // console.log("HELLOASD \n\n\n\n oy");
  });
  app.get("/api/getCourses", async (req, res) => {
    Course.find({}, (err, courses) => {
      console.log("Courses: \n\n\n\n", courses);
    });
  });
};
