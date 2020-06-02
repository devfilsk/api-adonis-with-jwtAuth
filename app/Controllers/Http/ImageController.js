"use strict";

const Helpers = use("Helpers");
const Image = use("App/Models/Image");
const Post = use("App/Models/Post");
const Drive = use("Drive");

class ImageController {
  async show({ params, response }) {
    const { id: name } = params;
    try {
      const post = Post.findByOrFail("cover_path", name);

      response.implicitEnd = false;
      response.header("Content-Type", "content-type");
      const stream = await Drive.getStream(post.cover_path);
      stream.pipe(response.response);
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: "O arquivo buscado não existe",
          err_message: err.message,
        },
      });
    }
    // return response.download(Helpers.tmpPath(`uploads/${params.path}`));
  }

  async store({ params, request, response }) {
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
          const today = new Date();
          const year = today.toLocaleString("default", { year: "numeric" });
          const month = today.toLocaleString("default", { month: "long" });
          const name = post.slug ? post.slug : post.id;
          const path = `${year}/images/${month}/${name}`;

          if (post.cover_path) {
            await Drive.delete(post.cover_path);
          }

          const url = await Drive.put(path, file.stream, {
            ContentType: file.headers["content-type"],
            ACL: "public-read",
          });

          await post.merge({
            cover_path: path,
          });
          await post.save();
          // }
          console.log("URL --> => ", url);
          return response.status(201).send(url);
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

    // const property = await Property.findOrFail(params.id);

    // const images = request.file("image", {
    //   types: ["image"],
    //   size: "2mb",
    // });

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

  async destroy({ request, params, response }) {
    const { id: name } = params;
    try {
      const post = Post.findByOrFail("cover_path", name);

      response.implicitEnd = false;
      response.header("Content-Type", "content-type");
      const stream = await Drive.getStream(post.cover_path);
      stream.pipe(response.response);
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: "O arquivo buscado não existe",
          err_message: err.message,
        },
      });
    }
  }

  async postImage({ params, request, response }) {
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
      .file("file", {}, async (file) => {
        try {
          const today = new Date();
          const year = today.toLocaleString("default", { year: "numeric" });
          const month = today.toLocaleString("default", { month: "long" });
          const name = post.slug ? post.slug : post.id;
          const path = `${year}/images/${month}/${name}`;

          if (post.cover_path) {
            await Drive.delete(post.cover_path);
          }

          const url = await Drive.put(path, file.stream, {
            ContentType: file.headers["content-type"],
            ACL: "public-read",
          });

          await post.merge({
            cover_path: path,
          });
          await post.save();
          // }
          console.log("URL --> => ", url);
          return response.status(201).send(url);
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
  }
}

module.exports = ImageController;
