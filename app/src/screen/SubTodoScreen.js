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
import {
  insertTask,
  fetchTasksByGroup,
  updateTask,
  deleteTask,
  markedtask,
} from "../../../db";
const SubTodoScreen = ({ route }) => {
  const { todo, updateSubTodos } = route.params;
  const [subTodo, setSubTodo] = useState("");
  const [description, setDescription] = useState("");
  const [subTodoList, setSubTodoList] = useState([]);
  const [editedSubTodo, setEditedSubTodo] = useState(null);

  useEffect(() => {
    const loadSubTasks = async () => {
      const tasks = await fetchTasksByGroup(todo.id);
      setSubTodoList(tasks);
    };
    loadSubTasks();
  }, [todo.id]);

  const handleAddSubTodo = async () => {
    const groupId = todo.id;
    if (subTodo === "") return;
    await insertTask(todo.id, subTodo, description, 0);
    const newSubTodo = {
      groupId,
      title: subTodo,
      description: description,
      completed: false,
    };

    const newSubTodoList = [...subTodoList, newSubTodo];
    setSubTodoList(newSubTodoList);
    updateSubTodos(newSubTodoList);
    setSubTodo("");
    setDescription("");
  };

  const handleDeleteSubTodo = async (id) => {
    await deleteTask(id);

    const updatedList = subTodoList.filter((item) => item.id !== id);
    setSubTodoList(updatedList);
    updateSubTodos(updatedList);
  };

  const handleEditSubTodo = (subTodoItem) => {
    setEditedSubTodo(subTodoItem);
    setSubTodo(subTodoItem.title);
    setDescription(subTodoItem.description);
  };

  const handleUpdateSubTodo = async () => {
    await updateTask(editedSubTodo.id, subTodo, description);

    const updatedSubTodos = subTodoList.map((item) => {
      if (item.id === editedSubTodo.id) {
        return { ...item, title: subTodo, description: description };
      }
      return item;
    });
    setSubTodoList(updatedSubTodos);
    updateSubTodos(updatedSubTodos);
    setEditedSubTodo(null);
    setSubTodo("");
    setDescription("");
  };

  const handleMarkSubTodo = async (id) => {
    const updatedSubTodos = subTodoList.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, completed: !item.completed };
        markedtask(id, updatedItem.completed ? 1 : 0);
        return updatedItem;
      }
      return item;
    });
    setSubTodoList(updatedSubTodos);
    updateSubTodos(updatedSubTodos);
  };

  const renderSubTodos = ({ item }) => {
    return (
      <View
        style={[
          styles.renderTodos,
          {
            backgroundColor: item.completed ? "#d3d3d3" : "#fff",
            opacity: item.completed ? 0.2 : 1,
          },
        ]}
      >
        <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
          <IconButton
            icon={item.completed ? "check-circle" : "circle-outline"}
            onPress={() => handleMarkSubTodo(item.id)}
            color="#fff"
          />
          <View>
            <Text
              style={{
                color: "#000",
                fontSize: 20,
                fontWeight: "600",
                flex: 1,
              }}
            >
              {item.title}
            </Text>
            <Text style={styles.todoDescription}>{item.description}</Text>
          </View>
        </View>
        <View style={{ gap: 1, alignItems: "center", flexDirection: "row" }}>
          <IconButton
            icon="pencil"
            onPress={() => handleEditSubTodo(item)}
            color="#fff"
          />
          <IconButton
            icon="trash-can"
            onPress={() => handleDeleteSubTodo(item.id)}
            color="#fff"
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <TextInput
        style={styles.inputs}
        placeholder="Add sub-task"
        value={subTodo}
        onChangeText={(text) => setSubTodo(text)}
      />
      <TextInput
        style={styles.inputs}
        placeholder="Add Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      {editedSubTodo ? (
        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={handleUpdateSubTodo}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Update Sub-task
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={handleAddSubTodo}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Add Sub-task
          </Text>
        </TouchableOpacity>
      )}
      <FlatList data={subTodoList} renderItem={renderSubTodos} />
    </View>
  );
};

export default SubTodoScreen;

const styles = StyleSheet.create({
  renderTodos: {
    backgroundColor: "#1e90ff",
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 12,
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
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
    marginTop: 8,
  },
  todoDescription: {
    color: "#000",
    fontSize: 15,
    marginTop: 4,
  },
});
