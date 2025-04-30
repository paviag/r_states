import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Modal, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, IconButton } from "react-native-paper";  // <-- Importamos IconButton
import { TodoContext } from "../context/todoProvider";
import { ActivityIndicator } from "react-native";

export default function TodoList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [newItemText, setNewItemText] = useState("");

  const { refreshTodos, deleteTodo, createTodo, updateTodo, loading, todos, error } =
    useContext(TodoContext);

  useEffect(() => {
    refreshTodos();
  }, []);
  
  const addItem = async() => {
    if (newItemText.length == "") return;

    const newItem = {
      //id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      name: newItemText,
    };

    await createTodo(newItem);
  };

  const deleteItem = async(id) => {
    await deleteTodo(id);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditedText(item.name);
    setModalVisible(true);
  };

  const saveEdit = async() => {

    await updateTodo( { id: selectedItem.id, name: editedText })

    setModalVisible(false);
    setSelectedItem(null);
    setEditedText("");
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText} onPress={() => openEditModal(item)}>
        {item.name}
      </Text>
      <IconButton
        icon="delete"       // Ícono de caneca
        size={24}
        onPress={() => deleteItem(item.id)}
        iconColor="red"
      />
    </View>
  );


  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text>Loading todos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "red" }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
        <TextInput style={styles.fabInput} placeholder="New Item" onChangeText={(t) => setNewItemText(t)} />
        <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />
      </View>

      {/* Modal para editar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Editar Item</Text>
            <TextInput
              style={styles.input}
              value={editedText}
              onChangeText={setEditedText}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Guardar" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 5,
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6200ee",
  },
  fabInput: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 76,
    height: 60,
    paddingLeft: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});
