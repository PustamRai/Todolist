import Todo from "./components/Todo"
import ActiveTaskButton from "./components/ActiveTaskButton"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/activeTasks" element={<ActiveTaskButton />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
