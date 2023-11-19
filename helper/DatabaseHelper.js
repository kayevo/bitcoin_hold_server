const UserEntity = require(".././entity/UserEntity");
const Credential = require(".././model/Credential");

const deleteMockUsers = () => {
  UserEntity.deleteMany({ $expr: { $lt: [{ $strLenCP: "$email" }, 4] } }).then(
    (result) => {
      console.log(`${result.deletedCount} users have been deleted.`);
    }
  );
};

/* 
  1 - select all users where exists password and dont exist passwordHash
  2 - create new users from old users
*/
const createUsersWithHash = () => {
  UserEntity.find()
    .then((users) => {
      const oldUsers = users.filter((user) => user.password);
      oldUsers.forEach((oldUser) => {
        const credential = new Credential(oldUser.email, oldUser.password);
        credential
          .getHashFromPassword()
          .then((hash) => {
            const newUserWithPasswordHash = new UserEntity({
              email: oldUser.email,
              passwordHash: hash,
              bitcoinPortfolio: oldUser.bitcoinPortfolio,
            });
            return UserEntity.create(newUserWithPasswordHash);
          })
          .then((createdUser) => {
            console.log(createdUser);
          });
      });
    })
    .catch((error) => console.error(error));
};

/* 
  1 - select all users where exists password and dont exist passwordHash
  2 - delete found users
*/
const deleteUsersWithoutHash = () => {
  UserEntity.find().then((users) => {
    const oldUsers = users.filter((user) => user.password);
    oldUsers.forEach((oldUser) => {
      oldUser
        .deleteOne()
        .then((result) => {
          console.log(`Deleted ${result.deletedCount} user.`);
        })
        .catch((error) => console.error(error));
    });
  });
};

const encryptFieldsAfterUserCreated = () => {
  UserEntity.find()
    .then((existingUsers) => {
      existingUsers.forEach((existingUser) => {
        existingUser
          .save()
          .then((savedUser) => {
            console.log(`Updated user with email: ${savedUser.email}`);
          })
          .catch((updateError) => {
            console.error(
              `Error updating user with email: ${existingUser.email}`,
              updateError
            );
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching existing users", error);
    });
};

module.exports = {
  deleteMockUsers,
  createUsersWithHash,
  deleteUsersWithoutHash,
  encryptFieldsAfterUserCreated,
};
