const bcrypt = require("bcrypt");

async function run() {
  const hash = await bcrypt.hash("123456", 10);
  console.log("Hashed Password:", hash);
}

run();