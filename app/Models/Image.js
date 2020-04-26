'use strict'

const Env = use('Env')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Image extends Model {

    static get computed () {
        return ['url'];
    }

    getUrl ({ path }) {
        return `${Env.get('APP_URL')}/tmp/uploads/${path}`
    }

}

module.exports = Image
