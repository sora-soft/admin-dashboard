import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icBook from '@iconify/icons-ic/book';
import icEdit from '@iconify/icons-ic/edit';
import icMoreHoriz from '@iconify/icons-ic/more-horiz';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AuthGroup} from 'src/app/service/server/api';
import {fadeInUp400ms} from 'src/@vex/animations/fade-in-up.animation';
import {stagger40ms} from 'src/@vex/animations/stagger.animation';
import {RestfulDataSource} from 'src/app/utils/restful-data-source';
import {ServerService} from 'src/app/service/server.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateAccountGroupComponent} from './create-account-group/create-account-group.component';
import {UpdateAccountPermissionComponent} from './update-account-permission/update-account-permission.component';
import {debounceTime} from 'rxjs/operators';
import {AuthName, AuthService} from 'src/app/service/auth.service';

export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'date' | 'actions';
  visible?: boolean;
  cssClasses?: string[];
}


@Component({
  selector: 'vex-account-group',
  templateUrl: './account-group.component.html',
  styleUrls: ['./account-group.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class AccountGroupComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  columns: TableColumn<AuthGroup>[] = [
    { label: '名称', property: 'name', type: 'text', visible: true},
    { label: '创建时间', property: 'createAt', type: 'date', visible: true },
    { label: '操作', property: 'actions', type: 'actions', visible: true},
  ];

  AuthName = AuthName;

  pageSize = 10;
  pageSizeOptions: number[] = [10];
  dataSource: RestfulDataSource<AuthGroup> | null;

  icSearch = icSearch;
  icAdd = icAdd;
  icBook = icBook;
  icEdit = icEdit;
  icMoreHoriz = icMoreHoriz;

  searchCtrl = new FormControl();

  constructor(
    private server: ServerService,
    private dialog: MatDialog,
    private auth: AuthService,
  ) {
    this.dataSource = new RestfulDataSource(server.restful, 'auth-group', ['permissions']);
  }

  ngOnInit(): void {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe({
      next: (value) => {
        if (value) {
          this.dataSource.search({
            name: {
              $like: `%${value}%`,
            },
          });
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

  createAuthGroup() {
    this.dialog.open(CreateAccountGroupComponent).afterClosed().subscribe((authGroup: AuthGroup) => {
      if (authGroup) {
        this.dataSource.updateData();
        // console.log(authGroup);
      }
    });
  }

  updateGroup(group: AuthGroup) {
    this.dialog.open(CreateAccountGroupComponent, {
      data: group,
      autoFocus: false,
    }).afterClosed().subscribe((authGroup: AuthGroup) => {
      if (authGroup) {
        this.dataSource.updateData();
      }
    });
  }

  updateGroupPermission(group: AuthGroup) {
    if (!this.auth.checkPermission(AuthName.API_AuthGroup_Permission)) {
      return;
    }

    this.dialog.open(UpdateAccountPermissionComponent, {
      data: group,
      autoFocus: false,
    }).afterClosed().subscribe({
      next: (updated: boolean) => {
        if (updated) {
          this.dataSource.updateData();
        }
      }
    });
  }
}
