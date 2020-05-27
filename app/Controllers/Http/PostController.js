"use strict";

const Post = use("App/Models/Post");
const Image = use("App/Models/Image");
const Helpers = use("Helpers");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const posts = Post.query().with("images").with("categories").fetch();

    return posts;
  }

  /**
   * Render a form to be used for creating a new post.
   * GET posts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const baseFile = "http://localhost:3333/tmp/uploads/";
    const images = request.file("cover", {
      types: ["image"],
      size: "2mb",
    });
    console.log("===>>=>", images);
    await images.moveAll(Helpers.tmpPath("uploads"), {
      name: "custom-name.jpg",
      overwrite: true,
    });

    if (!images.movedAll()) {
      return images.errors();
    }

    // Percorre as imagens e grava cada uma utilizando Promise pois o map e assíncrono

    const { id, title, post, category, tags } = request.all();
    const user_id = await auth.getUser();
    if (id) {
      const existePost = await Post.findOrFail(id);
      existePost.merge({
        title_temp: "",
        title,
        post_temp: "",
        post,
        user_id: user_id.id,
      });

      await Promise.all(
        images
          .movedList()
          .map((image) =>
            existePost.merge({ cover_path: baseFile + image.fileName })
          )
      );

      await existePost.save();
      await existePost.reload();
      return response.status(201).json(existePost);
    } else {
      const resp = await Post.create({
        title_temp: "",
        title,
        post_temp: "",
        post,
        user_id: user_id.id,
      });
      await resp.reload();
      return response.status(201).json(resp);
    }
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const post = await Post.findOrFail(params.id);

    await post.load("images");

    return post;
  }

  /**
   * Render a form to update an existing post.
   * GET posts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}

  async presave({ params, request, response, auth }) {
    const { id, title_temp, post_temp, images } = request.all();
    const user_id = await auth.getUser();
    if (id) {
      const post = await Post.findOrFail(id);
      post.merge({ title_temp, post_temp, user_id: user_id.id });
      await post.save();
      await post.reload();
      return response.status(201).json(post);
    } else {
      const resp = await Post.create({ title_temp, post_temp });
      console.log("RESP ==> ", resp);
      await resp.reload();

      return response.status(201).json(resp);
    }
  }
}

module.exports = PostController;
