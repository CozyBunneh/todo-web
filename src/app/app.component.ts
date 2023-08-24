import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Todo, TodoRepository } from "./shared/repositories/todo.repository";
import { TodoService } from "./shared/services/todo.service";
import { PaginationData } from "@ngneat/elf-pagination";
import { PriorityV1 } from "./core/api/todo";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  selectedHits: number = 0;
  pagination!: PaginationData;
  todos!: Todo[];
  isAdding: boolean = false;
  todoForm!: FormGroup;

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

  toggleTodo(_id: number, _completed: boolean | undefined) {
    // var todo = this.todos.find((t) => t.id === id);
    // if (todo) {
    //   if (completed) {
    //     todo.completed = completed;
    //   } else {
    //     todo.completed = !todo.completed;
    //   }
    // }
  }

  onSelectedHitsChanged(selectedHitsEvent: number) {
    this.selectedHits = selectedHitsEvent;
    if (this.todoRepository && this.pagination) {
      this.todoRepository.clearCache();
      this.todoRepository.changePage(
        this.pagination.currentPage,
        this.selectedHits,
      );
    }
  }

  gotoPage(pageIndex: number) {
    this.todoRepository.changePage(pageIndex, this.selectedHits);
  }
}
