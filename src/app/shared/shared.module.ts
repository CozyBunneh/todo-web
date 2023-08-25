import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { HttpClientModule } from "@angular/common/http";
import { DialogComponent } from "./components/dialog/dialog.component";

const components: any[] = [PaginationComponent, DialogComponent];
const modules: any[] = [HttpClientModule, FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: components,
  imports: [CommonModule].concat(modules),
  exports: components.concat(modules),
})
export class SharedModule {}
