import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"],
})
export class CheckboxComponent {
  @Input() label: string = "";
  @Input() value: boolean = false;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onChanged: EventEmitter<void> = new EventEmitter<void>();

  toggle() {
    this.value = !this.value;
    this.valueChange.emit(this.value);
    this.onChanged.emit();
  }
}
