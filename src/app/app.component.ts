import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Todo, TodoRepository } from "./shared/repositories/todo.repository";
import { TodoService } from "./shared/services/todo.service";
import { PaginationData } from "@ngneat/elf-pagination";
import { CreateTodoV1, PriorityV1 } from "./core/api/todo";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  selectedHits: number = 0;
  pagination!: PaginationData;
  todos!: Todo[];
  isAdding: boolean = false;
  todoForm!: FormGroup;
  searchQuery: string | undefined = undefined;
  filterCompleted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private todoRepository: TodoRepository,
    private todoService: TodoService,
    private cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.initForm();
    this.todoRepository.pagination$.subscribe((pagination) => {
      this.pagination = pagination;
      this.todos = pagination.data;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.todoForm = this.formBuilder.group({
      title: ["", Validators.required],
      priority: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      completed: [false, Validators.required],
    });
  }

  onFilterCompletedChanged(_event: Event) {
    this.gotoPage(0);
  }

  openDialog() {
    if (!this.isAdding) {
      this.isAdding = true;
    }
  }

  add() {
    this.todoForm.markAllAsTouched();
    if (this.todoForm.invalid) {
      return;
    }

    var formValue = this.todoForm.value;
    let newTodo = {
      title: formValue.title,
      priority: this.todoService.getPriorityById(formValue.priority),
      completed: false,
    } as CreateTodoV1;
    this.todoRepository.create(newTodo);
    this.todoForm.reset({ title: "", priority: 3, completed: false });
    this.isAdding = false;
    this.cd.detectChanges();
  }

  completeTodo(id: number) {
    this.toggleTodo(id, true);
  }

  unfinishTodo(id: number) {
    this.toggleTodo(id, false);
  }

  toggleTodo(id: number, completed: boolean | undefined) {
    if (completed !== undefined) {
      this.todoRepository.toggleTodo(id, completed);
    }
  }

  delete(id: number) {
    this.todoRepository.delete(id);
  }

  onSelectedHitsChanged(selectedHitsEvent: number) {
    this.selectedHits = selectedHitsEvent;
    if (this.todoRepository && this.pagination) {
      this.todoRepository.clearCache();
      this.todoRepository.changePage(
        this.pagination.currentPage,
        this.selectedHits,
        this.searchQuery,
        this.filterCompleted,
      );
    }
  }

  gotoPage(pageIndex: number) {
    this.todoRepository.changePage(
      pageIndex,
      this.selectedHits,
      this.searchQuery,
      this.filterCompleted,
    );
  }
}
