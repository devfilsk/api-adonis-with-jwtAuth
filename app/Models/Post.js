"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const Env = use("Env");

class Post extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeCreate", "UuidHook.uuid");
    this.addTrait("@provider:Lucid/Slugify", {
      fields: {
        slug: "title",
      },
      strategy: "dbIncrement",
    });
  }

  static get table() {
    return "posts";
  }

  getTags(tags) {
    console.log(tags);
    return tags ? JSON.parse(tags) : [];
  }

  getCoverPath(cover_path) {
    if (cover_path) {
      return Env.get("S3_PATH") + cover_path;
    } else {
      return cover_path;
    }
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  images() {
    return this.hasMany("App/Models/Image");
  }

  // categories() {
  //   return this.hasOne("App/Models/PostCategory");
  // }
  categories() {
    return this.belongsToMany("App/Models/Category").pivotTable(
      "post_categories"
    );
  }
}

module.exports = Post;
