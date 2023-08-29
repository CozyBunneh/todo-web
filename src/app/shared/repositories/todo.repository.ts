import { Injectable } from "@angular/core";
import { createStore, select, withProps } from "@ngneat/elf";
import { TodoV1 } from "src/app/core/api/todo";
import { TodoService } from "../services/todo.service";

export interface Todo extends TodoV1 {
  id: number;
}

interface TodoProps {
  todo: Todo | null;
}

const store = createStore(
  { name: "todo" },
  withProps<TodoProps>({ todo: null } as TodoProps),
);

@Injectable({ providedIn: "root" })
export class TodoRepository {
  todo$ = store.pipe(select((state) => state));

  constructor(private todoService: TodoService) {}

  update(todo: Todo) {
    store.update((state) => ({
      ...state,
      todo: todo,
    }));
  }

  get(id: number) {
    this.todoService.getById(id).subscribe((todo: TodoV1) => {
      this.update(todo as Todo);
    });
  }

  clear() {
    store.update((state) => ({
      ...state,
      todo: null,
    }));
  }
}
