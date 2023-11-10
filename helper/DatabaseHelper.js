const UserEntity = require(".././entity/UserEntity");

const deleteMockUsers = () => {
  // delete users where email is less than 4
  UserEntity.deleteMany(
    { $expr: { $lt: [{ $strLenCP: "$email" }, 4] } },
    (err) => {
      if (err) {
        console.error("Error deleting users:", err);
      } else {
        console.log("Users have been deleted.");
      }
    }
  );
};

module.exports = { deleteMockUsers };
