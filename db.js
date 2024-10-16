import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabaseAsync("tasks2.db");
export const openDatabase = async () => {
  return await SQLite.openDatabaseAsync("task.db");
};
export const initializeDatabase = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT,
      title TEXT NOT NULL,
      completed INTEGER
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      groupId INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER,
      FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
    );
  `);
};
export const insertGroup = async ({ id, title, completed }) => {
  const db = await openDatabase();
  const result = await db.runAsync(
    "INSERT INTO groups (id , title, completed ) VALUES (?,?,?);",
    [id, title, completed]
  );
  return result.lastInsertRowId;
};
export const fetchGroups = async () => {
  const db = await openDatabase();
  const groups = await db.getAllAsync("SELECT * FROM groups;");
  return groups;
};
export const insertTask = async (groupId, title, description, completed) => {
  const db = await openDatabase();
  const result = await db.runAsync(
    "INSERT INTO tasks (groupId, title,description, completed) VALUES (?, ?, ?,?);",
    groupId,
    title,
    description,
    completed
  );
  return result.lastInsertRowId;
};
export const fetchTasksByGroup = async (groupId) => {
  const db = await openDatabase();
  const tasks = await db.getAllAsync(
    "SELECT * FROM tasks WHERE groupId = ?;",
    groupId
  );
  return tasks;
};

export const updateTask = async (id, title, description) => {
  const db = await openDatabase();
  await db.runAsync(
    "UPDATE tasks SET title = ?,description=? WHERE id = ?;",
    title,
    description,
    id
  );
};
export const updategroup = async (id, title) => {
  const db = await openDatabase();
  await db.runAsync("UPDATE groups SET title = ? WHERE id = ?;", title, id);
};
export const markedgroup = async (id, completed) => {
  const db = await openDatabase();
  await db.runAsync(
    "UPDATE groups SET completed = ? WHERE id = ?;",
    completed,
    id
  );
};
export const markedtask = async (id, completed) => {
  const db = await openDatabase();
  await db.runAsync(
    "UPDATE tasks SET completed = ? WHERE id = ?;",
    completed,
    id
  );
};
export const deleteTask = async (id) => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM tasks WHERE id = ?;", id);
};
export const deletegroup = async (id) => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM groups WHERE id = ?;", id);
};
