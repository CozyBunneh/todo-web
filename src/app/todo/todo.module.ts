import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TodosComponent } from "./todos/todos.component";
import { TodoComponent } from "./todo/todo.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TodoRoutingModule } from "./todo-routing.module";

@NgModule({
  declarations: [TodosComponent, TodoComponent],
  imports: [
    CommonModule,
    TodoRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
})
export class TodoModule {}
