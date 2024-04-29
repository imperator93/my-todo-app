import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Tasks } from "../models/task.model";
import { Prev } from "react-bootstrap/esm/PageItem";

export function TaskComponent(props: {
  handleCheckbox: (event: React.BaseSyntheticEvent) => void;
  setTasks: (tasks: Tasks[]) => void;
  task: Tasks;
  tasks: Tasks[];
  style: CSSModuleClasses;
}) {
  type InputRefObj = MutableRefObject<HTMLInputElement | null>;
  //ugly fix but works, probably a much simpler way somewhere
  const inputRef: InputRefObj = useRef(null);
  const changeChecked = (ref: InputRefObj) => {
    if (props.task.isCompleted && ref != null) ref.current!.checked = true;
  };

  const [renameTask, setRenameTask] = useState<boolean>(false);

  useEffect(() => {
    changeChecked(inputRef);
  }, [props.task.isCompleted]);

  const handleRenameInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event);
    if (event.key == "Enter" && event.target.value.length > 3) {
      props.tasks.forEach((task, index) => {
        if (task.id === event.target.id) {
          props.tasks[index].name = event.target.value;
          props.setTasks([...props.tasks]);
          setRenameTask(false);
        }
      });
    }
  };

  return (
    <div className={props.style["task"]}>
      {props.task.name}
      <div>
        {(renameTask && (
          <input
            placeholder={props.task.name}
            id={props.task.id}
            onKeyUp={(event) => handleRenameInput(event)}
          ></input>
        )) || <button onClick={() => setRenameTask(true)}>rename</button>}
        <input
          ref={inputRef}
          id={props.task.id}
          type="checkbox"
          onClick={(event) => props.handleCheckbox(event)}
        ></input>
        <button
          id={props.task.id}
          onClick={(event: React.BaseSyntheticEvent) => {
            props.setTasks(props.tasks.filter((task: Tasks) => task.id !== event.target.id));
          }}
        >
          X
        </button>
      </div>
    </div>
  );
}
