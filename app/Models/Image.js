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
}

module.exports = Image;
