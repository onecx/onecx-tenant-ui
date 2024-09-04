import { Component, Inject, LOCALE_ID, OnInit, QueryList, ViewChildren } from '@angular/core'
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import {
  Action,
  BreadcrumbService,
  DataTableColumn,
  ExportDataService,
  PortalDialogService
} from '@onecx/portal-integration-angular'
import { PrimeIcons } from 'primeng/api'
import { first, map, Observable } from 'rxjs'
import { isValidDate } from '../../../shared/utils/isValidDate.utils'
import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchCriteria, tenantSearchCriteriasSchema } from './tenant-search.parameters'
import { selectTenantSearchViewModel } from './tenant-search.selectors'
import { TenantSearchViewModel } from './tenant-search.viewmodel'

@Component({
  selector: 'app-tenant-search',
  templateUrl: './tenant-search.component.html',
  styleUrls: ['./tenant-search.component.scss']
})
export class TenantSearchComponent implements OnInit {
  viewModel$: Observable<TenantSearchViewModel> = this.store.select(selectTenantSearchViewModel)

  pageName = 'PAGE_TENANT_SEARCH'

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.exportItems()
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
          actionCallback: () => this.toggleChartVisibility()
        }
      ]
      return actions
    })
  )

  diagramColumnId = 'tenantId'
  diagramColumn$ = this.viewModel$.pipe(
    map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
  )

  public tenantSearchFormGroup: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(tenantSearchCriteriasSchema.keyof().options.map((k) => [k, null])) as Record<
      keyof TenantSearchCriteria,
      unknown
    >)
  } satisfies Record<keyof TenantSearchCriteria, unknown>)

  @ViewChildren(FormControlName) visibleFormControls!: QueryList<FormControlName>

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService,
    private portalDialogService: PortalDialogService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'TENANT_SEARCH.BREADCRUMB',
        labelKey: 'TENANT_SEARCH.BREADCRUMB',
        routerLink: '/tenant'
      }
    ])
  }

  searchConfigInfoSelectionChanged(searchConfig: {
    fieldValues: Record<string, string>
    displayedColumnsIds: string[]
    viewMode: 'basic' | 'advanced'
  }) {
    // if (searchConfig) {
    //   this.store.dispatch(
    //     TenantSearchActions.searchConfigSelected({
    //       viewMode: searchConfig.viewMode,
    //       displayedColumnIds: searchConfig.displayedColumnsIds,
    //       // TODO: fix with parse mechanism
    //       fieldValues: Object.entries(searchConfig.inputValues).reduce(
    //         (acc: Partial<TenantSearchCriteria>, [key, value]) => ({
    //           ...acc,
    //           [key]: isValidDate(value)
    //             ? new Date(
    //                 Date.UTC(
    //                   value.getFullYear(),
    //                   value.getMonth(),
    //                   value.getDate(),
    //                   value.getHours(),
    //                   value.getMinutes(),
    //                   value.getSeconds()
    //                 )
    //               ).toISOString()
    //             : value || undefined
    //         }),
    //         {}
    //       )
    //     })
    //   )
    // }
  }

  private isVisible(control: string) {
    return this.visibleFormControls.some(
      (formControl) => formControl.name !== null && String(formControl.name) === control
    )
  }

  search(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<TenantSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: this.isVisible(key)
          ? isValidDate(value)
            ? new Date(
                Date.UTC(
                  value.getFullYear(),
                  value.getMonth(),
                  value.getDay(),
                  value.getHours(),
                  value.getMinutes(),
                  value.getSeconds()
                )
              ).toISOString()
            : value || undefined
          : undefined
      }),
      {}
    )
    this.store.dispatch(TenantSearchActions.searchButtonClicked({ searchCriteria }))
  }

  resetSearch() {
    this.store.dispatch(TenantSearchActions.resetButtonClicked())
  }

  exportItems() {
    this.viewModel$.pipe(first()).subscribe((data) => {
      this.exportDataService.exportCsv(data.displayedColumns, data.results, 'tenant.csv')
    })
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      TenantSearchActions.viewModeChanged({
        viewMode: viewMode
      })
    )
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(TenantSearchActions.displayedColumnsChanged({ displayedColumns }))
  }

  toggleChartVisibility() {
    this.store.dispatch(TenantSearchActions.chartVisibilityToggled())
  }
}
