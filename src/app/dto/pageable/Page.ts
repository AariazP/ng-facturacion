import { Pageable } from "./Pageable";
import { Sort } from "./Sort";

export class Page<T> {
    content: T[];             
    pageable: Pageable;       
    totalPages: number;       
    totalElements: number;    
    last: boolean;            
    first: boolean;           
    sort: Sort;               
    number: number;           
    numberOfElements: number; 
    size: number;             
    empty: boolean;     
    
    constructor() {
        this.content = [];
        this.pageable = new Pageable();
        this.totalPages = 0;
        this.totalElements = 0;
        this.last = false;
        this.first = false;
        this.sort = new Sort();
        this.number = 0;
        this.numberOfElements = 0;
        this.size = 0;
        this.empty = false;
    }
  }