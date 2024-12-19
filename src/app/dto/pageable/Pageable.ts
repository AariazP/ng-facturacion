import { Sort } from "./Sort";

export class Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: Sort;
    
    constructor() {
        this.offset = 0;
        this.pageNumber = 0;
        this.pageSize = 0;
        this.paged = false;
        this.unpaged = false;
        this.sort = new Sort();
    }
  }