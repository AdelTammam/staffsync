const { MongoClient } = require("mongodb");
const uri = "mongodb://adeltammam7_db_user:Staffsync2026@ac-7fctwag-shard-00-00.jinlh25.mongodb.net:27017,ac-7fctwag-shard-00-01.jinlh25.mongodb.net:27017,ac-7fctwag-shard-00-02.jinlh25.mongodb.net:27017/staffsync?ssl=true";
const opts = { replicaSet: "atlas-zfjxnp-shard-0", authSource: "admin" };
MongoClient.connect(uri, opts).then(function(c) {
  return c.db("staffsync").collection("users").updateOne(
    { email: "admin@staffsync.com" },
    { $set: { role: "admin" } }
  ).then(function(r) {
    console.log(r.modifiedCount === 1 ? "SUCCESS" : "not found");
    c.close();
  });
}).catch(console.error);
