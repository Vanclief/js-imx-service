/** @format */

// Require the framework and instantiate it
import Fastify from "fastify";
import { IMXClient } from "./imx_client.js";
// import { ImmutableXClient, ETHTokenType, ERC721TokenType, ERC20TokenType } from '@imtbl/imx-sdk'

// const fastify = require("fastify")({ logger: true });

const server = Fastify({ logger: true });
const client = new IMXClient();

server.post("/init", async (request, reply) => {
  try {
    const response = await client.init(request.body);
    reply
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  } catch (err) {
    reply
      .code(400)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(err);
  }
});

server.get("/register", async (request, reply) => {
  try {
    const response = await client.register();
    reply
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  } catch (err) {
    reply = err;
  }

  return reply;
});

server.post("/erc20/transfer", async (request, reply) => {
  try {
    const response = await client.transferERC20(request.body);
    reply
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  } catch (err) {
    console.log("err", err);
    reply
      .code(400)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(err);
  }
});

server.post("/erc721/transfer", async (request, reply) => {
  try {
    const response = await client.transferERC721(request.body);
    reply
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  } catch (err) {
    console.log("err", err);
    reply
      .code(400)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(err);
  }
});

server.post("/erc20/approve", async (request, reply) => {
  try {
    const response = await client.approveERC20(request.body);
    reply
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  } catch (err) {
    reply
      .code(400)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(err);
  }
});

server.post("/erc721/approve", async (request, reply) => {
  try {
    const response = await client.approveERC721(request.body);
    reply
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  } catch (err) {
    reply
      .code(400)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(err);
  }
});

// Run the server!
const start = async () => {
  try {
    await server.listen(4000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
