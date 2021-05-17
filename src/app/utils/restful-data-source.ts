import { DataSource } from '@angular/cdk/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ConvertRouteMethod} from '../service/server.service';
import {IReqFetch, RestfulHandler, WhereCondition} from '../service/server/api';

class RestfulDataSource<T> extends DataSource<T> {
  paginator: MatPaginator;
  sort: MatSort;

  private currentPageIndex = 0;
  private currentPageSize = 0;
  private order = {};
  private where: WhereCondition<T>;
  private dataOb$ = new BehaviorSubject<T[]>([]);

  constructor(private requester: ConvertRouteMethod<RestfulHandler>, private db: string, private relations?: string[], private keys?: string[]) {
    super();
  }

  search(where?: WhereCondition<T>) {
    this.where = where;
    this.updateData();
  }

  init(paginator: MatPaginator, sort: MatSort) {
    this.paginator = paginator;
    this.sort = sort;

    this.currentPageIndex = this.paginator.pageIndex;
    this.currentPageSize = this.paginator.pageSize;

    this.paginator.page.subscribe({
      next: (page: PageEvent) => {
        console.log(page);
        if (page.pageIndex !== this.currentPageIndex || page.pageSize !== this.currentPageSize) {
          this.updateData();
        }
      }
    });

    this.sort.sortChange.subscribe({
      next: (event: Sort) => {
        if (event.direction) {
          this.order = {
            [event.active]: event.direction === 'asc' ? 1 : -1,
          };
        } else {
          this.order = {};
        }
        this.updateData();
      }
    });

    this.updateData();
  }

  updateData() {
    this.requester.fetch({
      db: this.db,
      offset: this.currentPageIndex * this.currentPageSize,
      limit: this.currentPageSize,
      order: this.order,
      relations: this.relations,
      select: this.keys,
      where: this.where,
    }).subscribe({
      next: (result) => {
        this.paginator.length = result.total;
        this.dataOb$.next(result.list as T[]);
      }
    });
  }

  connect(): Observable<T[]> {
    return this.dataOb$;
  }

  disconnect() {}
}

export {RestfulDataSource};
