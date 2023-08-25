import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
  // implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  // ngOnInit(): void {
  //   // this.isOpen = false;
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (
  //     changes["isOpen"] &&
  //     !changes["isOpen"].isFirstChange &&
  //     changes["isOpen"].currentValue !== changes["isOpen"].previousValue
  //   ) {
  //     this.isOpen = changes["isOpen"].currentValue;
  //   }
  // }

  closeDialog() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
