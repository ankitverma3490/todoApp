import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabaseAsync("tasks2.db");

// create or open the database
export const openDatabase = async () => {
  return await SQLite.openDatabaseAsync("task.db");
};

//  Initializing the database with required tables
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
// Insert new group
export const insertGroup = async ({ id, title, completed }) => {
  const db = await openDatabase();
  const result = await db.runAsync(
    "INSERT INTO groups (id , title, completed ) VALUES (?,?,?);",
    [id, title, completed]
  );
  return result.lastInsertRowId;
};

// Fetch all groups
export const fetchGroups = async () => {
  const db = await openDatabase();
  const groups = await db.getAllAsync("SELECT * FROM groups;");
  return groups;
};

// Insert new task
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

// Fetch all tasks by group
export const fetchTasksByGroup = async (groupId) => {
  const db = await openDatabase();
  const tasks = await db.getAllAsync(
    "SELECT * FROM tasks WHERE groupId = ?;",
    groupId
  );
  return tasks;
};

// update task title/description
export const updateTask = async (id, title, description) => {
  const db = await openDatabase();
  await db.runAsync(
    "UPDATE tasks SET title = ?,description=? WHERE id = ?;",
    title,
    description,
    id
  );
};

//update group title
export const updategroup = async (id, title) => {
  const db = await openDatabase();
  await db.runAsync("UPDATE groups SET title = ? WHERE id = ?;", title, id);
};

// marked/unmarked group
export const markedgroup = async (id, completed) => {
  const db = await openDatabase();
  await db.runAsync(
    "UPDATE groups SET completed = ? WHERE id = ?;",
    completed,
    id
  );
};

// marked/unmarked task
export const markedtask = async (id, completed) => {
  const db = await openDatabase();
  await db.runAsync(
    "UPDATE tasks SET completed = ? WHERE id = ?;",
    completed,
    id
  );
};

// delete task
export const deleteTask = async (id) => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM tasks WHERE id = ?;", id);
};

//delete group
export const deletegroup = async (id) => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM groups WHERE id = ?;", id);
};
