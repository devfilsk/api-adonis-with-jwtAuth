'use strict'

const Helpers = use('Helpers')
const Image = use('App/Models/Image')
const Property = use('App/Models/Property')

class ImageController {

    async show ({ params, response }) {
        return response.download(Helpers.tmpPath(`uploads/${params.path}`))
    }

    async store ({ params, request }) {
        console.log("Header", request.headers())
        const property = await Property.findOrFail(params.id);
        console.log("FILEEEE", request.file('image'))

        const images = request.file('image', {
            types: ['image'],
            size: '2mb'
        })

        console.log("IMAGES -- >", images)

        await images.moveAll(Helpers.tmpPath('uploads'), file => ({
            name: `${Date.now()}-${file.clientName}`
        }))

        if (!images.movedAll()) {
            return images.errors()
        }

        // Percorre as imagens e grava cada uma utilizando Promise pois o map e assíncrono 
        await Promise.all(
            images
                .movedList()
                .map(image => property.images().create({ path: image.fileName }))
        )
    }
}

module.exports = ImageController
