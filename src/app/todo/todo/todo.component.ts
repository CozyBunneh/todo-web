import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PaginationData } from "@ngneat/elf-pagination";
import { CreateTodoV1 } from "src/app/core/api/todo";
import {
  Todo,
  TodoRepository,
} from "src/app/shared/repositories/todo.repository";
import { TodoService } from "src/app/shared/services/todo.service";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"],
})
export class TodoComponent implements AfterViewInit {
  todo$ = this.todoRepository.todo$;

  private id: number = -1;

  constructor(
    private route: ActivatedRoute,
    private todoRepository: TodoRepository,
  ) {}

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      if (id) {
        this.id = +id;
        this.todoRepository.get(this.id);
      }
    });
  }
}
