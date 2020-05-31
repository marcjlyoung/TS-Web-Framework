import { Collection } from "./models/Collection";
import { UserProps, User } from "./models/User";
import { UserList } from "./views/UserList";

const users = new Collection(
  "http://localhost:3000/users",
  (json: UserProps) => {
    return User.buildUser(json);
  }
);

users.on("change", () => {
  const root = document.getElementById("root");

  if (root) {
    const userlist = new UserList(root, users);

    userlist.render();
  }
});

users.fetch();
