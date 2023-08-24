import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { PaginationData } from "@ngneat/elf-pagination";
import { rangeByStep } from "src/app/utilities/RangeUtil";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pagination!: PaginationData;
  @Input() hitsRange = rangeByStep(5, 50, 5);
  @Input() relativePagesToShow = 1;
  @Output() changePage = new EventEmitter<number>();
  @Output() selectedHitsChanged = new EventEmitter<number>();

  selectedHits: number = this.hitsRange[0];
  paginationRange: number[] = [];
  showFirst: boolean = false;
  showLast: boolean = false;

  ngOnInit(): void {
    this.selectedHitsChanged.emit(this.selectedHits);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["pagination"] && !changes["pagination"].firstChange) {
      this.updatePagination();
    }
    if (changes["hitsRange"] && !changes["hitsRange"].firstChange) {
      this.updatePagination();
    }
    if (
      changes["relativePagesToShow"] &&
      !changes["relativePagesToShow"].firstChange
    ) {
      this.updatePagination();
    }
  }

  private updatePagination() {
    this.paginationRange = this.getPaginationRange();
    this.showFirst = this.showFirstDots();
    this.showLast = this.showLastDots();
  }

  onSelectedHitsChanged(_event: Event) {
    this.selectedHitsChanged.emit(this.selectedHits);
  }

  gotoFirstPage() {
    if (this.pagination.currentPage === 0) {
      return;
    }
    this.gotoPage(0);
  }

  gotoLastPage() {
    if (this.pagination.currentPage === this.pagination.lastPage) {
      return;
    }
    this.gotoPage(this.pagination.lastPage);
  }

  gotoPreviousPage() {
    if (this.pagination.currentPage === 0) {
      return;
    }
    this.gotoPage(this.pagination.currentPage - 1);
  }

  gotoNextPage() {
    if (this.pagination.currentPage === this.pagination.lastPage) {
      return;
    }
    this.gotoPage(this.pagination.currentPage + 1);
  }

  gotoPage(pageIndex: number) {
    this.changePage.emit(pageIndex);
  }

  getPaginationRange(): number[] {
    const lastPage = this.pagination.lastPage;
    const currentPage = this.pagination.currentPage;
    var startIndex =
      currentPage > this.relativePagesToShow
        ? currentPage - this.relativePagesToShow
        : 0;
    var endIndex =
      currentPage < lastPage - this.relativePagesToShow
        ? currentPage + this.relativePagesToShow
        : lastPage;
    return rangeByStep(startIndex, endIndex, 1);
  }

  get isFirstPage() {
    return this.pagination.currentPage === 0;
  }

  get isLastPage() {
    return this.pagination.currentPage === this.pagination.lastPage;
  }

  showFirstDots() {
    return this.pagination.currentPage > this.relativePagesToShow;
  }

  showLastDots() {
    return (
      this.pagination.currentPage <
      this.pagination.lastPage - this.relativePagesToShow
    );
  }

  isIndexCurrentPage(index: number) {
    return this.pagination.currentPage === index;
  }
}
