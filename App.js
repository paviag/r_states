import { TodoProvider } from "./context/todoProvider";
import TodoList from "./pages/TodoList";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <TodoProvider>
        <TodoList />
      </TodoProvider>
    </SafeAreaProvider>
  );
}
