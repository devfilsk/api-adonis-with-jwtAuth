"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PostCategorySchema extends Schema {
  up() {
    this.create("post_categories", (table) => {
      table.increments();
      table.string("category");
      table
        .string("post_id")
        .references("id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("post_categories");
  }
}

module.exports = PostCategorySchema;
