"use strict";

const Env = use("Env");
const Helpers = use("Helpers");
const Drive = use("Drive");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Image extends Model {
  static get computed() {
    return ["url"];
  }

  getUrl({ path }) {
    return `${Env.get("APP_URL")}/tmp/uploads/${path}`;
  }
  getCoverPath(path) {
    if (path) {
      return Env.get("S3_PATH") + path;
    } else {
      return path;
    }
  }

  post() {
    return this.belongsTo("App/Models/Post");
  }

  async uploadS3(file, slug) {
    await file
      .file("cover", {}, async (file) => {
        try {
          console.log("TESTEEE");
          const ContentType = file.headers["content-type"];
          const ACL = "public-read"; // necessário para não dar acesso negado
          const Key = `teste_cover4`;

          const today = new Date();
          const year = today.toLocaleString("default", { year: "numeric" });
          const month = today.toLocaleString("default", { month: "long" });

          const url = await Drive.put(
            `${year}/images/${month}/${slug}`,
            file.stream,
            {
              ContentType,
              ACL,
            }
          );
          //   await Drive.put(`teste/${file.clientName}`, file.stream, {
          //     ContentType: file.headers["content-type"],
          //     ACL: "public-read",
          //   });
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
  }

  async deleteImage(path) {
    try {
      response.implicitEnd = false;
      await Drive.delete(path);
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: "O arquivo buscado não existe e não pode ser excluído",
          err_message: err.message,
        },
      });
    }
  }
}

module.exports = Image;
