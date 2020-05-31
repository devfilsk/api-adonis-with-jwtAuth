"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PostCategory extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Lucid/Slugify", {
      fields: {
        slug: "category",
      },
      strategy: "dbIncrement",
      disableUpdates: true,
    });
  }

  post() {
    return this.belongsTo("App/Models/Post");
  }
}

module.exports = PostCategory;
