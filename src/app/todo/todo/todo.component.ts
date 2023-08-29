import { AfterViewInit, Component, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TodoRepository } from "src/app/shared/repositories/todo.repository";

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

  @HostListener("window:popstate", ["$event"])
  onPopState(_event: Event) {
    this.todoRepository.clear();
  }
}
