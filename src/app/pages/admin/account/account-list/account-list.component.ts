import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icBook from '@iconify/icons-ic/book';
import icEdit from '@iconify/icons-ic/edit';
import icMoreHoriz from '@iconify/icons-ic/more-horiz';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Account, AuthGroup} from 'src/app/service/server/api';
import {fadeInUp400ms} from 'src/@vex/animations/fade-in-up.animation';
import {stagger40ms} from 'src/@vex/animations/stagger.animation';
import {RestfulDataSource} from 'src/app/utils/restful-data-source';
import {ServerService} from 'src/app/service/server.service';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime} from 'rxjs/operators';
import {AccountCreateUpdateComponent} from './account-create-update/account-create-update.component';
import {AuthName, AuthService} from 'src/app/service/auth.service';

export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'date' | 'actions' | 'group';
  visible?: boolean;
  cssClasses?: string[];
}

@Component({
  selector: 'vex-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class AccountListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  AuthName = AuthName;

  columns: TableColumn<Account>[] = [
    { label: '用户名', property: 'username', type: 'text', visible: true},
    { label: '创建时间', property: 'createAt', type: 'date', visible: true },
    { label: '邮箱', property: 'email', type: 'text', visible: true},
    { label: '用户组', property: 'group', type: 'group', visible: true},
    { label: '操作', property: 'actions', type: 'actions', visible: true},
  ];


  pageSize = 10;
  pageSizeOptions: number[] = [10];
  dataSource: RestfulDataSource<Account> | null;

  icSearch = icSearch;
  icAdd = icAdd;
  icBook = icBook;
  icEdit = icEdit;
  icMoreHoriz = icMoreHoriz;

  searchCtrl = new FormControl();

  constructor(
    server: ServerService,
    private dialog: MatDialog,
    private auth: AuthService,
  ) {
    this.dataSource = new RestfulDataSource(server.restful, 'account', ['group']);
  }

  ngOnInit(): void {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe({
      next: (value) => {
        if (value) {
          this.dataSource.search([{
            username: {
              $like: `%${value}%`,
            },
          }, {
            email: {
              $like: `%${value}%`,
            }
          }]);
        } else {
          this.dataSource.search();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.init(this.paginator, this.sort);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  updateUser(user: Account) {
    if (!this.auth.checkPermission(AuthName.API_Account_Update)) {
      return;
    }

    this.dialog.open(AccountCreateUpdateComponent, {
      data: user,
      autoFocus: false,
    }).afterClosed().subscribe({
      next: (updated) => {
        if (updated) {
          this.dataSource.updateData();
        }
      }
    });
  }

  createNewUser() {
    this.dialog.open(AccountCreateUpdateComponent, {
      autoFocus: false,
    }).afterClosed().subscribe({
      next: (created) => {
        if (created) {
          this.dataSource.updateData();
        }
      }
    });
  }
}
