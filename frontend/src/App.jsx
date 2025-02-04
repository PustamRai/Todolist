import Todo from "./components/Todo"
import ActiveTaskButton from "./components/ActiveTaskButton"
import CompletedTaskButton from "./components/CompletedTaskButton"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/activeTasks" element={<ActiveTaskButton />} />
          <Route path="/completedTasks" element={<CompletedTaskButton />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
