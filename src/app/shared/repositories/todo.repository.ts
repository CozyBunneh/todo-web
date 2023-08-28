import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import {
  addEntities,
  deleteAllEntities,
  deleteEntities,
  selectEntity,
  setEntities,
  withEntities,
} from "@ngneat/elf-entities";
import {
  PaginationData,
  deleteAllPages,
  getPaginationData,
  hasPage,
  selectCurrentPageEntities,
  selectPaginationData,
  setCurrentPage,
  setPage,
  updatePaginationData,
  withPagination,
} from "@ngneat/elf-pagination";
import { combineLatest, debounceTime, map } from "rxjs";
import { TodoService } from "../services/todo.service";
import { CreateTodoV1, TodoV1 } from "src/app/core/api/todo";

export interface Todo extends TodoV1 {
  id: number;
}

const store = createStore(
  { name: "todos" },
  withEntities<Todo>(),
  withPagination(),
);

@Injectable({ providedIn: "root" })
export class TodoRepository {
  pagination$ = combineLatest([
    store.pipe(selectPaginationData()),
    store.pipe(selectCurrentPageEntities()),
  ]).pipe(
    map(([pagination, data]) => ({ ...pagination, data })),
    debounceTime(0),
  );
  private query: string | undefined = undefined;
  private filterCompleted: true | undefined = undefined;

  constructor(private todoService: TodoService) {
    this.loadPage(0, 5);
  }

  addTodos(response: PaginationData & { data: TodoV1[] }) {
    const { data, ...paginationData } = response;
    store.update(
      addEntities(data.map((t) => t as Todo)),
      updatePaginationData(paginationData),
      setPage(
        0,
        data.map((t) => (t as Todo).id),
      ),
    );
  }

  changePage(
    pageIndex: number,
    pageSize: number,
    query?: string,
    filterCompleted?: boolean,
  ) {
    if (store.query(hasPage(pageIndex))) {
      store.update(setCurrentPage(pageIndex));
      return;
    }

    this.loadPage(pageIndex, pageSize, query, filterCompleted);
  }

  clearCache() {
    store.update(deleteAllEntities(), deleteAllPages());
  }

  deleteEntity(id: number) {
    store.update(deleteEntities(id));
  }

  loadPage(
    pageIndex: number,
    pageSize: number,
    query?: string,
    filterCompleted?: boolean,
  ) {
    const { lastPage, total } = store.query(getPaginationData());

    query = query === undefined ? this.query : query;
    filterCompleted =
      filterCompleted === undefined ? this.filterCompleted : filterCompleted;

    this.todoService
      .getPaged(pageIndex, pageSize, query, filterCompleted)
      .subscribe((paginatedData) => {
        store.update(
          addEntities(paginatedData?.data?.map((t) => t as Todo) ?? []),
          updatePaginationData({
            currentPage: paginatedData?.pageIndex ?? 0,
            perPage: paginatedData?.pageSize ?? 0,
            lastPage: (paginatedData?.totalPages ?? 1) - 1,
            total: paginatedData?.totalItems ?? 0,
          }),
          setPage(
            pageIndex,
            paginatedData?.data?.map((t) => (t as Todo).id) ?? [],
          ),
        );
      });
  }

  reloadPage() {
    const paginationData = store.query(getPaginationData());
    this.clearCache();
    this.loadPage(0, paginationData.perPage);
  }

  create(todo: CreateTodoV1): void {
    this.todoService.create(todo).subscribe(() => {
      this.reloadPage();
    });
  }

  update(todo: TodoV1): void {
    this.todoService.update(todo).subscribe(() => {});
  }

  delete(id: number): void {
    this.todoService.delete(id).subscribe(() => {
      this.reloadPage();
    });
  }

  toggleTodo(id: number, completed: boolean) {
    store.pipe(selectCurrentPageEntities()).subscribe((todos: Todo[]) => {
      let todo = todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = completed;
        this.update(todo);
      }
    });
  }

  filter(query?: string, filterCompleted?: true) {
    this.query = query;
    this.filterCompleted = filterCompleted;
    const paginationData = store.query(getPaginationData());
    this.clearCache();
    this.loadPage(0, paginationData.perPage, undefined, filterCompleted);
  }

  clearFilters() {
    this.query = undefined;
    this.filterCompleted = undefined;
  }
}
