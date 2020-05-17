"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PostSchema extends Schema {
  up() {
    this.create("posts", (table) => {
      table.increments();
      table.string("title");
      table.text("post");
      table.string("title_temp");
      table.json("tags");
      table.text("post_temp");
      table.integer("avaliation");
      table.string("cover_path");
      table.boolean("published");
      table.timestamps();
    });
  }

  down() {
    this.drop("posts");
  }
}

module.exports = PostSchema;
