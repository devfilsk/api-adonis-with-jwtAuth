'use strict'
const User = use('App/Models/User') 

class SessionController {
    async create ({ request, auth, response }){
        const { email, password } = request.all();

        // try{
        //     const token = await auth.attempt(email, password);
        //     const user = await auth.getUser();
        //     console.log("TOKEN", token)
        //     const result = {
        //         ...token, user 
        //     }
        //     return result;
        // }catch(erro) {
        //     console.log("Usuário não authenticado")
        // }
        try {
            if (await auth.attempt(email, password)) {
              let user = await User.findBy('email', email)
              let token = await auth.generate(user)
  
            //   Object.assign(user, token)
              return response.json({ user, token: token.token })
            }
  
  
          }
          catch (e) {
            console.log(e)
            return response.json({message: 'You are not registered!'})
          }
    }
}

module.exports = SessionController
