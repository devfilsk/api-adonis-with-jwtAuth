"use strict";

const Helpers = use("Helpers");
const Image = use("App/Models/Image");
const Post = use("App/Models/Post");
const Drive = use("Drive");

class ImageController {
  async show({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`));
  }

  async store({ params, request, response }) {
    console.log("PATH ", params.id);
    const { id } = params;
    const post = await Post.findOrFail(id);
    if (!post) {
      return response.status(404).send({
        error: {
          message: "Publicação não encontrada",
        },
      });
    }

    await request.multipart
      .file("cover", {}, async (file) => {
        try {
          console.log("TESTEEE");
          const today = new Date();
          const year = today.toLocaleString("default", { year: "numeric" });
          const month = today.toLocaleString("default", { month: "long" });

          const url = await Drive.put(
            `${year}/images/${month}/${post.slug}_cover`,
            file.stream,
            {
              ContentType: file.headers["content-type"],
              ACL: "public-read",
            }
          );

          if (url) {
            post.merge({
              cover_path: url,
            });
            post.save();
          }
          console.log("URL ===> ", url);
        } catch (err) {
          return response.status(err.status).send({
            error: {
              message: "Não foi possível enviar o arquivo",
              err_message: err.message,
            },
          });
        }
      })
      .process();

    // console.log("Header", request.headers());
    // const property = await Property.findOrFail(params.id);
    // console.log("FILEEEE", request.file("image"));

    // const images = request.file("image", {
    //   types: ["image"],
    //   size: "2mb",
    // });

    // console.log("IMAGES -- >", images);

    // await images.moveAll(Helpers.tmpPath("uploads"), (file) => ({
    //   name: `${Date.now()}-${file.clientName}`,
    // }));

    // if (!images.movedAll()) {
    //   return images.errors();
    // }

    // // Percorre as imagens e grava cada uma utilizando Promise pois o map e assíncrono
    // await Promise.all(
    //   images
    //     .movedList()
    //     .map((image) => property.images().create({ path: image.fileName }))
    // );
  }

  async uploadS3({ request, params, response }) {}
}

module.exports = ImageController;
