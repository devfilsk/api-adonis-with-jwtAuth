'use strict'

const User = use("App/Models/User");

class UserController {
    async create({ request, response, auth }){
        const data = request.only(["username", "email", "password"]);

        const user = await User.create(data);
        let token = await auth.generate(user)

        return response.status(201).json({ user, token: token.token });
    }
}

module.exports = UserController
