import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  initializeDatabase,
  insertGroup,
  markedgroup,
  fetchGroups,
  deletegroup,
  updategroup,
} from "../../../db";

const TodoScreen = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editedTodo, setEditedTodo] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        const todos = await fetchGroups();
        setTodoList(todos);
      } catch (error) {
        console.error("Database setup error:", error);
      }
    };
    setupDatabase();
  }, []);

  const handleAddTodo = async () => {
    if (todo === "") return;
    const id = Date.now().toString();
    const newTodo = { id, title: todo, completed: 0 };

    await insertGroup(newTodo);
    setTodoList([...todoList, newTodo]);
    setTodo("");
  };

  const handleDeleteTodo = async (id) => {
    await deletegroup(id);
    const updatedList = todoList.filter((item) => item.id !== id);
    setTodoList(updatedList);
  };

  const handleEditTodo = (todo) => {
    setEditedTodo(todo);
    setTodo(todo.title);
  };

  const handleUpdateTodo = async () => {
    if (!editedTodo) return;

    await updategroup(editedTodo.id, todo);
    const updatedTodos = todoList.map((item) => {
      if (item.id === editedTodo.id) {
        return { ...item, title: todo };
      }
      return item;
    });
    setTodoList(updatedTodos);
    setEditedTodo(null);
    setTodo("");
  };

  const handleMarkTodo = async (id) => {
    const updatedTodos = todoList.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, completed: !item.completed };
        return updatedItem;
      }
      return item;
    });

    setTodoList(updatedTodos);
    const updatedItem = updatedTodos.find((item) => item.id === id);
    await markedgroup(id, updatedItem.completed ? 1 : 0);
    await updategroup(id, updatedItem.title);
  };

  const handleUpdateSubTodos = (id, updatedSubTodos) => {
    const updatedTodos = todoList.map((item) => {
      if (item.id === id) {
        return { ...item, subTodos: updatedSubTodos };
      }
      return item;
    });
    setTodoList(updatedTodos);
  };

  const renderTodos = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.renderTodos,
          {
            backgroundColor: item.completed ? "#d3d3d3" : "#fff",
            opacity: item.completed ? 0.2 : 1,
          },
        ]}
        onPress={() =>
          navigation.navigate("SubTodoScreen", {
            todo: item,
            updateSubTodos: (updatedSubTodos) =>
              handleUpdateSubTodos(item.id, updatedSubTodos),
          })
        }
      >
        <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
          <IconButton
            icon={item.completed ? "check-circle" : "circle-outline"}
            onPress={() => handleMarkTodo(item.id)}
          />

          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            {item.title}
          </Text>
        </View>
        <View style={{ gap: 1, alignItems: "center", flexDirection: "row" }}>
          <IconButton icon="pencil" onPress={() => handleEditTodo(item)} />
          <IconButton
            icon="trash-can"
            onPress={() => handleDeleteTodo(item.id)}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <TextInput
        style={styles.inputs}
        placeholder="Add a Category"
        value={todo}
        onChangeText={(text) => setTodo(text)}
      />

      {editedTodo ? (
        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={handleUpdateTodo}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Update
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={handleAddTodo}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Add
          </Text>
        </TouchableOpacity>
      )}
      <FlatList data={todoList} renderItem={renderTodos} />
    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  renderTodos: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 12,
    alignItems: "center",
    flexDirection: "row",
    color: "#000",
  },
  TouchableOpacity: {
    backgroundColor: "#24a0ed",
    borderRadius: 6,
    paddingVertical: 12,
    marginVertical: 24,
    alignItems: "center",
  },
  inputs: {
    borderWidth: 2,
    borderColor: "#1e90ff",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
