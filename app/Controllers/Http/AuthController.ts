import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    try {
      const email = await request.input('email')
      const password = request.input('password')

      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '30 min',
      })
      return token.toJSON()
    } catch (e) {}
    throw console.log('error', Error)
  }

  public async register({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const name = request.input('name')

    try {
      //creacion de nuevo usuario
      const user = new User()
      user.email = email
      user.name = name
      user.password = password
      const result = await user.save()

      const token = await auth.use('api').login(user, {
        expiresIn: '2 days',
      })
      return { token: token.toJSON(), result: result }
    } catch (e) {
      console.log('errror ------>', e)
      throw Error
    }
  }
}
