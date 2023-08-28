import { Injectable } from "@angular/core";
import { of } from "rxjs";
import {
  CreateTodoV1,
  PriorityV1,
  TodoResourceService,
  TodoV1,
} from "src/app/core/api/todo";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  constructor(private todoApiService: TodoResourceService) {}

  getPaged(
    pageIndex: number,
    pageSize: number,
    query?: string,
    completed?: boolean,
  ) {
    return this.todoApiService.todosGet(completed, pageIndex, pageSize, query);
  }

  getById(id: number) {
    return this.todoApiService.todosIdGet(id);
  }

  create(todo: CreateTodoV1) {
    return this.todoApiService.todosPut(todo);
  }

  update(todo: TodoV1) {
    if (todo.id) {
      let id: number = todo.id;
      return this.todoApiService.todosIdPost(id, todo);
    }

    return of(null);
  }

  delete(id: number) {
    return this.todoApiService.todosIdDelete(id);
  }

  getPriorityById(priorityId: number): PriorityV1 {
    if (priorityId == 1) {
      return { id: 1, name: "Highest" } as PriorityV1;
    } else if (priorityId == 2) {
      return { id: 2, name: "High" } as PriorityV1;
    } else if (priorityId == 3) {
      return { id: 3, name: "Medium" } as PriorityV1;
    } else if (priorityId == 4) {
      return { id: 4, name: "Low" } as PriorityV1;
    } else {
      return { id: 5, name: "Lowest" } as PriorityV1;
    }
  }
}
