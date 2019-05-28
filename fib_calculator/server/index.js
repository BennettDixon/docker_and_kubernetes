const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on("error", () => console.log("Lost PG Connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

// Redis Client Setup
const redis = require("redis");
const redisClient = redisClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handling
app.get("/", (req, resp) => {
  resp.send("Working");
});

app.get("/values/all", async (req, resp) => {
  const values = await pgClient.query("SELECT * FROM values");
  resp.send(values.rows);
});

app.get("/values/current", async (req, resp) => {
  redisClient.hgetall("values", (err, values) => {
    resp.send(values);
  });
});

app.post("/values", async (req, resp) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return resizeBy.status(422).send("Index too high");
  }
  redisClient.hset("values", index, "Calculating...");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  resp.send({ working: true });
});
