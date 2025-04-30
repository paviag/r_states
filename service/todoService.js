// RemoteTodoService.js

const BASE_URL = "http://unidb.openlab.uninorte.edu.co";
const CONTRACT_KEY = "todo-gaby-lena";
const TABLE = "todos";

//https://unidb.openlab.uninorte.edu.co/e83b7ac8-bdad-4bb8-a532-6aaa5fddefa4/data/todos/all?format=json

const TodoService = {
  /**
   * Fetches all todos.
   * @returns {Promise<Array<Object>>} resolves to an array of todo objects
   */
  async getTodos() {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/all?format=json`;
    
    try {
        
      const response = await fetch(url, { method: "GET"});
      if (response.status !== 200) {
        throw new Error(`Error code ${response.status}`);
      }
      
      const decoded = await response.json();
      const rawData = decoded.data || [];

      // Flatten each record into { id, ...fields }
      const todos = rawData.map((record) => {
        const { entry_id, data } = record;
        return {
          ...data, // spread in name, quantity, description, etc.
          id: entry_id, // top‐level entry_id becomes your id
          
        };
      });

      console.log("TodoService getTodos ok");
      return todos;
    } catch (err) {
      console.error("getTodos error:", err);
      throw err;
    }
  },

  /**
   * Adds a new todo.
   * @param {Object} todo – must match your backend schema
   * @returns {Promise<boolean>} true on 201, false otherwise
   */
  async addTodo(todo) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: TABLE,
          data: todo
        })
      });

      if (res.status === 200) {
        // Parse the returned JSON
        const decoded = await res.json();
        console.log("addTodo → id=", decoded?.entry_id);
      } else {
        const text = await res.text();
        console.error(`addTodo failed ${res.status}:`, text);
        return null;
      }
    } catch (err) {
      console.error("addTodo error:", err);
      return null;
    }
  },

  /**
   * Updates an existing todo by id.
   * @param {Object} todo – must include an `id` field
   * @returns {Promise<boolean>} true on 200
   */
  async updateTodo(todo) {
    if (!todo.id) throw new Error("todo.id is required");
    console.log("updateTodo", todo);
    const { id, ...fields } = todo;
    console.log("updateTodo id ", id, "fields", fields);
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/update/${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ data: fields })
      });

      console.log(`updateTodo status ${res.status}`);
      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`updateTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("updateTodo error:", err);
      return false;
    }
  },

  /**
   * Deletes a todo by id.
   * @param {{ id: string } | string} todoOrId
   * @returns {Promise<boolean>}
   */
  async deleteTodo(todoOrId) {
    const id = typeof todoOrId === "string" ? todoOrId : todoOrId.id;
    if (!id) throw new Error("todo.id is required");
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/delete/${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      });

      console.log(`deleteTodo status ${res.status}`);
      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`deleteTodo failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("deleteTodo error:", err);
      return false;
    }
  },

  /**
   * Deletes *all* todos by fetching them and deleting one by one.
   * @returns {Promise<boolean>}
   */
  async deleteTodos() {
    try {
      const all = await this.getTodos();
      for (const p of all) {
        // now accepts either p or p.id
        // eslint-disable-next-line no-await-in-loop
        await this.deleteTodo(p.id);
      }
      return true;
    } catch (err) {
      console.error("deleteTodos error:", err);
      return false;
    }
  }
};

export default TodoService;