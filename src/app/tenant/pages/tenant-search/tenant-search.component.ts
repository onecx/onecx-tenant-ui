import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  Action,
  BreadcrumbService,
  DataTableColumn,
  ExportDataService,
  PortalDialogService,
} from '@onecx/portal-integration-angular';
import { PrimeIcons } from 'primeng/api';
import {
  BehaviorSubject,
  filter,
  first,
  map,
  mergeMap,
  Observable,
  of,
  withLatestFrom,
} from 'rxjs';
import { isValidDate } from '../../../shared/utils/isValidDate.utils';
import { TenantSearchActions } from './tenant-search.actions';
import {
  TenantSearchCriteria,
  tenantSearchCriteriasSchema,
} from './tenant-search.parameters';
import {
  selectConfigValues,
  selectFormValues,
  selectSearchCriteria,
  selectTenantSearchViewModel,
} from './tenant-search.selectors';
import { TenantSearchViewModel } from './tenant-search.viewmodel';

@Component({
  selector: 'app-tenant-search',
  templateUrl: './tenant-search.component.html',
  styleUrls: ['./tenant-search.component.scss'],
})
export class TenantSearchComponent implements OnInit {
  viewModel$: Observable<TenantSearchViewModel> = this.store.select(
    selectTenantSearchViewModel,
  );

  pageName = 'PAGE_TENANT_SEARCH';

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.exportItems(),
        },
        {
          labelKey: vm.chartVisible
            ? 'TENANT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'TENANT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          icon: PrimeIcons.EYE,
          titleKey: vm.chartVisible
            ? 'TENANT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'TENANT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          show: 'asOverflow',
          actionCallback: () => this.toggleChartVisibility(),
        },
      ];
      return actions;
    }),
  );

  diagramColumnId = 'tenantId';
  diagramColumn$ = this.viewModel$.pipe(
    map(
      (vm) =>
        vm.columns.find(
          (e) => e.id === this.diagramColumnId,
        ) as DataTableColumn,
    ),
  );

  public tenantSearchFormGroup: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(
      tenantSearchCriteriasSchema.keyof().options.map((k) => [k, null]),
    ) as Record<keyof TenantSearchCriteria, unknown>),
  } satisfies Record<keyof TenantSearchCriteria, unknown>);

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService,
    private portalDialogService: PortalDialogService,
  ) {
    this.store
      .select(selectFormValues)
      .pipe(filter((values) => Object.keys(values).length == 0))
      .subscribe(() => {
        this.tenantSearchFormGroup.patchValue(
          Object.fromEntries(
            tenantSearchCriteriasSchema.keyof().options.map((k) => [k, null]),
          ),
        );
      });

    this.store.select(selectConfigValues).subscribe((values) => {
      this.tenantSearchFormGroup.patchValue(
        Object.fromEntries(
          tenantSearchCriteriasSchema
            .keyof()
            .options.map((k) => [k, values[k]]),
        ),
      );
    });

    this.tenantSearchFormGroup.valueChanges.subscribe((v) => {
      const values = Object.entries(v).reduce(
        (acc: Partial<TenantSearchCriteria>, [key, value]) => ({
          ...acc,
          [key]: isValidDate(value)
            ? new Date(
                Date.UTC(
                  value.getFullYear(),
                  value.getMonth(),
                  value.getDay(),
                  value.getHours(),
                  value.getMinutes(),
                  value.getSeconds(),
                ),
              ).toISOString()
            : value || undefined,
        }),
        {},
      );
      this.store.dispatch(TenantSearchActions.formValuesChanged({ values }));
    });
  }

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'TENANT_SEARCH.BREADCRUMB',
        labelKey: 'TENANT_SEARCH.BREADCRUMB',
        routerLink: '/tenant',
      },
    ]);
  }

  search(formValue: TenantSearchCriteria) {
    this.store.dispatch(
      TenantSearchActions.searchButtonClicked({ searchCriteria: formValue }),
    );
  }

  resetSearch() {
    this.store.dispatch(TenantSearchActions.resetButtonClicked());
  }

  exportItems() {
    this.viewModel$.pipe(first()).subscribe((data) => {
      this.exportDataService.exportCsv(
        data.displayedColumns,
        data.results,
        'tenant.csv',
      );
    });
  }

  searchConfigInfoSelectionChanged(searchConfig: {
    inputValues: Record<string, any>;
    displayedColumns: string[];
    viewMode: 'basic' | 'advanced';
  }) {
    if (searchConfig) {
      this.store.dispatch(
        TenantSearchActions.searchConfigSelected({
          viewMode: searchConfig.viewMode,
          displayedColumns: searchConfig.displayedColumns,
          values: Object.entries(searchConfig.inputValues).reduce(
            (acc: Partial<TenantSearchCriteria>, [key, value]) => ({
              ...acc,
              [key]: isValidDate(value)
                ? new Date(
                    Date.UTC(
                      value.getFullYear(),
                      value.getMonth(),
                      value.getDay(),
                      value.getHours(),
                      value.getMinutes(),
                      value.getSeconds(),
                    ),
                  ).toISOString()
                : value || undefined,
            }),
            {},
          ),
        }),
      );
    }
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      TenantSearchActions.viewModeChanged({
        viewMode: viewMode,
      }),
    );
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(
      TenantSearchActions.displayedColumnsChanged({ displayedColumns }),
    );
  }

  toggleChartVisibility() {
    this.store.dispatch(TenantSearchActions.chartVisibilityToggled());
  }
}
