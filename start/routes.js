"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("/users", "UserController.create");
Route.get("/users", "UserController.show").middleware("auth");
Route.post("/sessions", "SessionController.create");
Route.post("/files/:path", "ImageController.uploadS3");
Route.resource("posts", "PostController").apiOnly(); //.middleware("auth");
Route.resource("categories", "CategoryController").apiOnly().middleware("auth");
Route.post("post/presave/:id?", "PostController.presave").middleware("auth");
Route.post("posts/:id/images", "ImageController.store").middleware("auth");
Route.post("posts/:id/postImage", "ImageController.postImage"); //.middleware("auth");

Route.post("posts/:id", "ImageController.show").middleware("auth");
Route.get("images/:path", "ImageController.show");
