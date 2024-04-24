import { MutableRefObject, useEffect, useRef } from "react";
import { Tasks } from "../models/task.model";

export function TaskComponent(props: {
  handleCheckbox: (event: React.BaseSyntheticEvent) => void;
  setTasks: (tasks: Tasks[]) => void;
  task: Tasks;
  tasks: Tasks[];
  style: CSSModuleClasses;
}) {
  //ugly fix but works, probably a much simpler way somewhere
  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const changeChecked = (ref: MutableRefObject<HTMLInputElement | null>) => {
    if (props.task.isCompleted && ref != null) ref.current!.checked = true;
  };

  useEffect(() => {
    changeChecked(inputRef);
  }, [props.task.isCompleted]);
  return (
    <div className={props.style["task"]}>
      {props.task.name}
      <div>
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
