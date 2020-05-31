"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PostSchema extends Schema {
  up() {
    this.create("posts", (table) => {
      // table.increments();
      table.uuid("id").primary();
      table.string("title");
      table.text("post");
      table.string("title_temp");
      table.text("post_temp");
      table.string("description");
      table.json("tags");
      table.integer("avaliation").defaultTo(0);
      table.string("cover_path");
      table.boolean("published");
      table.string("slug");
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.timestamps();
    });
  }

  down() {
    this.drop("posts");
  }
}

module.exports = PostSchema;
