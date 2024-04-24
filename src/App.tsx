import style from "./App.module.css";
import { useEffect, useState } from "react";
import { Tasks } from "./models/task.model";
import { idGenerator } from "./utils/idGenerator";
import { TaskComponent } from "./Components/TaskComponent";

type Renaming = {
  isRenaming: boolean;
  name: string;
};

function App() {
  const [renameList, setRenameList] = useState<Renaming>({
    isRenaming: false,
    name: "My Todo List",
  });
  const [tasks, setTasks] = useState<Tasks[]>();
  const [allActiveCompleted, setAllActiveCompleted] = useState<string>("All");

  console.log(localStorage);
  const buttonGroup: string[] = ["All", "Active", "Completed"];
  const handleButtonGroup = (event: React.BaseSyntheticEvent) => {
    switch (event.target.id) {
      case "All":
        setAllActiveCompleted("All");
        break;
      case "Active":
        setAllActiveCompleted("Active");
        break;
      case "Completed":
        setAllActiveCompleted("Completed");
    }
  };

  const handleCheckbox = (event: React.BaseSyntheticEvent) => {
    tasks?.forEach((task, index) => {
      if (task.id === event.target.id && event.target.checked == true) {
        task.isCompleted = true;
        tasks[index] = task;
        setTasks([...tasks]);
      } else if (task.id === event.target.id && event.target.checked == false) {
        task.isCompleted = false;
        tasks[index] = task;
        setTasks([...tasks]);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleAddTasks = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    if (event.target[0].value.length >= 3) {
      const tempArr = [...(tasks as Tasks[])];
      tempArr.push({ name: event.target[0].value, id: idGenerator(), isCompleted: false });
      setTasks([...tempArr]);
      event.target[0].value = "";
    }
    //save to local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // load tasks
  useEffect(() => {
    setTasks([]);
    const tasksFromStorage = localStorage.getItem("tasks");
    if (tasksFromStorage) {
      setTasks(JSON.parse(tasksFromStorage!));
    }
  }, []);

  useEffect(() => {
    if (tasks) localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  console.log(tasks);
  return (
    <>
      {/* todo list name */}
      <div className={style["flexrow"]}>
        {(renameList.isRenaming && (
          <input
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter")
                //don't know why it cries about this
                setRenameList({ isRenaming: false, name: event.target.value });
            }}
            className={style["header"]}
          />
        )) || <h1 className={style["header"]}>{renameList.name}</h1>}

        <button
          onClick={() => setRenameList({ ...renameList, isRenaming: true })}
          className={style["header-button"]}
        >
          ...
        </button>
      </div>

      <div className={style["wrapper"]}>
        <div>
          {buttonGroup.map((value, index) => (
            <button id={value} key={index} onClick={(event) => handleButtonGroup(event)}>
              {value}
            </button>
          ))}
        </div>

        <div className={style["task-container"]}>
          {(allActiveCompleted == "All" &&
            tasks?.map((task) => (
              <TaskComponent
                key={task.id}
                handleCheckbox={handleCheckbox}
                setTasks={setTasks}
                task={task}
                tasks={tasks}
                style={style}
              />
            ))) ||
            (allActiveCompleted == "Active" &&
              tasks!
                .filter((task) => task.isCompleted === false)
                .map((task) => (
                  <TaskComponent
                    key={task.id}
                    handleCheckbox={handleCheckbox}
                    setTasks={setTasks}
                    task={task}
                    tasks={tasks!}
                    style={style}
                  />
                ))) ||
            (allActiveCompleted == "Completed" &&
              tasks!
                .filter((task) => task.isCompleted == true)
                .map((task) => (
                  <TaskComponent
                    key={task.id}
                    handleCheckbox={handleCheckbox}
                    setTasks={setTasks}
                    task={task}
                    tasks={tasks!}
                    style={style}
                  />
                )))}
        </div>

        {/* add/delete/update tasks */}
        <form
          onSubmit={(event: React.BaseSyntheticEvent) => handleAddTasks(event)}
          className={style["input-wrapper"]}
        >
          <input className={style["input"]} type="text" />
          <button type="submit">Add task</button>
        </form>
      </div>
    </>
  );
}
export default App;
