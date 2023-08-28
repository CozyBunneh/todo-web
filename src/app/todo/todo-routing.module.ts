import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TodosComponent } from "./todos/todos.component";
import { TodoComponent } from "./todo/todo.component";

const routes: Routes = [
  {
    path: "",
    component: TodosComponent,
  },
  {
    path: ":id",
    component: TodoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
