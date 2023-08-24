import { Injectable } from "@angular/core";
import { trackRequestResult } from "@ngneat/elf-requests";
import { tap } from "rxjs";
import { TodoRepository } from "../repositories/todo.repository";
import { TodoResourceService, TodoV1 } from "src/app/core/api/todo";
import { PaginationData, skipWhilePageExists } from "@ngneat/elf-pagination";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  constructor(
    private todoApiService: TodoResourceService, // private todoRepository: TodoRepository,
  ) {}

  getPaged(
    pageIndex: number,
    pageSize: number,
    query?: string,
    completed?: boolean,
  ) {
    return this.todoApiService.todosGet(completed, pageIndex, pageSize, query);
    // .pipe(tap(this.todoRepository.addTodos), trackRequestResult(["todos"]));
    // .pipe(
    //   tap((todos: TodoV1[]) => {
    //     var response: PaginationData & { data: TodoV1[] } = {
    //       data: todos,
    //       total: 3,
    //       perPage: pageSize,
    //       lastPage: -1,
    //       currentPage: pageIndex,
    //     };
    //     this.todoRepository.addTodos(response);
    //   }),
    //   skipWhilePageExists(pageIndex),
    // )
  }
}
