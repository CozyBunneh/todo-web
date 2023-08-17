import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Todo, TodoRepository } from "./shared/repositories/todo.repository";
import { TodoService } from "./shared/services/todo.service";
import { PaginationData } from "@ngneat/elf-pagination";
import { PriorityV1 } from "./core/api/todo";

export function rangeByStep(
  start: number,
  end: number,
  step: number,
): number[] {
  if (end === start || step === 0) {
    return [start];
  }
  if (step < 0) {
    step = -step;
  }

  const stepNumOfDecimal = step.toString().split(".")[1]?.length || 0;
  const endNumOfDecimal = end.toString().split(".")[1]?.length || 0;
  const maxNumOfDecimal = Math.max(stepNumOfDecimal, endNumOfDecimal);
  const power = Math.pow(10, maxNumOfDecimal);
  const diff = Math.abs(end - start);
  const count = Math.trunc(diff / step + 1);
  step = end - start > 0 ? step : -step;

  const intStart = Math.trunc(start * power);
  return Array.from(Array(count).keys()).map((x) => {
    const increment = Math.trunc(x * step * power);
    const value = intStart + increment;
    return Math.trunc(value) / power;
  });
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  hitsRange = rangeByStep(5, 50, 5);
  selectedHits: number = this.hitsRange[0];
  pagination!: PaginationData;
  todos!: Todo[];
  currentPage!: number;
  isAdding: boolean = false;
  todoForm!: FormGroup;
  paginationRange: number[] = [];
  showFirst: boolean = false;
  showLast: boolean = false;

  private relativePagesToShow = 1;

  constructor(
    private formBuilder: FormBuilder,
    private todoRepository: TodoRepository,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      title: ["", Validators.required],
      priority: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      completed: [false, Validators.required],
    });
    this.todoRepository.pagination$.subscribe((pagination) => {
      this.pagination = pagination;
      this.todos = pagination.data;
      this.paginationRange = this.getPaginationRange();
      this.showFirst = this.showFirstDots();
      this.showLast = this.showLastDots();
    });
  }

  openDialog() {
    if (!this.isAdding) {
      this.isAdding = true;
    }
  }

  closeDialog() {
    this.isAdding = false;
  }

  add() {
    if (this.todoForm.invalid) {
      return;
    }

    var formValue = this.todoForm.value;
    let newTodo = {
      id: 4,
      title: formValue.title,
      priority: this.getPriority(formValue.priority),
      completed: true,
    } as Todo;
    // this.todos.push(newTodo);
    this.closeDialog();
  }

  private getPriority(priorityId: number): PriorityV1 {
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

  completeTodo(id: number) {
    this.toggleTodo(id, true);
  }

  unfinishTodo(id: number) {
    this.toggleTodo(id, false);
  }

  toggleTodo(id: number, completed: boolean | undefined) {
    // var todo = this.todos.find((t) => t.id === id);
    // if (todo) {
    //   if (completed) {
    //     todo.completed = completed;
    //   } else {
    //     todo.completed = !todo.completed;
    //   }
    // }
  }

  selectedHitsChanged(event: Event) {
    this.todoRepository.clearCache();
    this.todoRepository.changePage(
      this.pagination.currentPage,
      this.selectedHits,
    );
  }

  gotoFirstPage() {
    if (this.pagination.currentPage === 0) {
      return;
    }
    this.gotoPage(0);
  }

  gotoLastPage() {
    if (this.pagination.currentPage === this.pagination.lastPage) {
      return;
    }
    this.gotoPage(this.pagination.lastPage);
  }

  gotoPreviousPage() {
    if (this.pagination.currentPage === 0) {
      return;
    }
    this.gotoPage(this.pagination.currentPage - 1);
  }

  gotoNextPage() {
    if (this.pagination.currentPage === this.pagination.lastPage) {
      return;
    }
    this.gotoPage(this.pagination.currentPage + 1);
  }

  gotoPage(pageIndex: number) {
    this.todoRepository.changePage(pageIndex, this.selectedHits);
  }

  getPaginationRange(): number[] {
    const lastPage = this.pagination.lastPage;
    const currentPage = this.pagination.currentPage;
    var startIndex =
      currentPage > this.relativePagesToShow
        ? currentPage - this.relativePagesToShow
        : 0;
    var endIndex =
      currentPage < lastPage - this.relativePagesToShow
        ? currentPage + this.relativePagesToShow
        : lastPage;
    return rangeByStep(startIndex, endIndex, 1);
  }

  get isFirstPage() {
    return this.pagination.currentPage === 0;
  }

  get isLastPage() {
    return this.pagination.currentPage === this.pagination.lastPage;
  }

  showFirstDots() {
    return this.pagination.currentPage > this.relativePagesToShow;
  }

  showLastDots() {
    return (
      this.pagination.currentPage <
      this.pagination.lastPage - this.relativePagesToShow
    );
  }

  isIndexCurrentPage(index: number) {
    return this.pagination.currentPage === index;
  }
}
