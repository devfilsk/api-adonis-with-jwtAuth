"use strict";

const User = use("App/Models/User");

class UserController {
  async create({ request, response, auth }) {
    const data = request.only([
      "username",
      "email",
      "password",
      "nickname",
      "access",
    ]);

    const user = await User.create(data);
    let token = await auth.generate(user);

    return response.status(201).json({ user, token: token.token });
  }

  async show({ auth, params, response }) {
    try {
      return await auth.getUser();
    } catch (error) {
      response.send("Missing or invalid jwt token");
    }
  }
}

module.exports = UserController;
