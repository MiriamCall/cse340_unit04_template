import dbPromise from "../../database/index.js";

const registerUser = async (email, password) => {
  const db = await dbPromise;
  const sql = "INSERT INTO user (email, password) VALUES (?, ?)";
  return await db.run(sql, email, password);
};

const verifyUser = async (email, password) => {
  const db = await dbPromise;
  const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
  return await db.get(sql, email, password);
};

export { registerUser, verifyUser };
