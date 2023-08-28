import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PaginationData } from "@ngneat/elf-pagination";
import { CreateTodoV1 } from "src/app/core/api/todo";
import { Todo } from "src/app/shared/repositories/todo.repository";
import { TodosRepository } from "src/app/shared/repositories/todos.repository";
import { TodoService } from "src/app/shared/services/todo.service";

@Component({
  selector: "app-todos",
  templateUrl: "./todos.component.html",
  styleUrls: ["./todos.component.scss"],
})
export class TodosComponent implements OnInit, AfterViewInit {
  selectedHits: number = 0;
  pagination!: PaginationData;
  todos!: Todo[];
  isAdding: boolean = false;
  todoForm!: FormGroup;
  searchQuery: string | undefined = undefined;
  filterCompletedValue: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private todosRepository: TodosRepository,
    private todoService: TodoService,
    private cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.initForm();
    this.todosRepository.pagination$.subscribe((pagination) => {
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

  get filterCompleted(): true | undefined {
    return this.filterCompletedValue === true ? true : undefined;
  }

  onFilterChanged() {
    this.todosRepository.filter(this.searchQuery, this.filterCompleted);
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
    this.todosRepository.create(newTodo);
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
      this.todosRepository.toggleTodo(id, completed);
    }
  }

  delete(id: number) {
    this.todosRepository.delete(id);
  }

  onSelectedHitsChanged(selectedHitsEvent: number) {
    this.selectedHits = selectedHitsEvent;
    if (this.todosRepository && this.pagination) {
      this.todosRepository.clearCache();
      this.todosRepository.changePage(
        this.pagination.currentPage,
        this.selectedHits,
        this.searchQuery,
        this.filterCompleted,
      );
    }
  }

  gotoPage(pageIndex: number) {
    this.todosRepository.changePage(
      pageIndex,
      this.selectedHits,
      this.searchQuery,
      this.filterCompleted,
    );
  }
}
