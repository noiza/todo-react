import checkIcon from "./check.svg";
import editIcon from "./edit.svg";
import deleteIcon from "./delete.svg";
import { useState, useEffect } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/tasks/").then(({ data }) => {
      setTasks(data);
    });
  }, []);

  const addTask = () => {
    const title = window.prompt("New Task:");
    if (title) {
      const id = Math.floor(Math.random() * 1000) + 1;
      const newTask = { id, title, completed: false };
      setTasks([...tasks, newTask]);
      axios.post("http://localhost:3001/tasks/", newTask).catch(() => {
        alert("Error while adding the task.");
      });
    }
  };

  return (
    <>
      <div className="header">
        <h2>to do:</h2>
        <button onClick={() => addTask()}>+</button>
      </div>

      <div className="tasks">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div className="task" key={task.id}>
              <div className="checkbox">
                <input type="checkbox" id={`task-${task.id}`} />
                <label htmlFor={`task-${task.id}`}>
                  <img src={checkIcon} alt="check icon" />
                </label>
              </div>

              <p className={task.completed ? "title completed" : "title"}>
                {task.title}
              </p>

              <div className="actions">
                <button>
                  <img src={editIcon} alt="edit icon" />
                </button>
                <button>
                  <img src={deleteIcon} alt="delete icon" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">
            <h3>No tasks found</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;
