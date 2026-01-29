import { Component, Inject, LOCALE_ID, OnInit, QueryList, ViewChildren } from '@angular/core'
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { distinctUntilChanged, first, map, Observable } from 'rxjs'
import { MenuItem, PrimeIcons } from 'primeng/api'
import deepEqual from 'fast-deep-equal'

import { Action, BreadcrumbService } from '@onecx/angular-accelerator'
import { DataTableColumn, ExportDataService, SearchConfigData } from '@onecx/portal-integration-angular'

import { isValidDate } from 'src/app/shared/utils/isValidDate.utils'

import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchCriteria, tenantSearchCriteriasSchema } from './tenant-search.parameters'
import { selectTenantSearchViewModel } from './tenant-search.selectors'
import { TenantSearchViewModel } from './tenant-search.viewmodel'
import { ImagesAPIService, RefType, Tenant } from 'src/app/shared/generated'

@Component({
  selector: 'app-tenant-search',
  templateUrl: './tenant-search.component.html',
  styleUrls: ['./tenant-search.component.scss']
})
export class TenantSearchComponent implements OnInit {
  viewModel$: Observable<TenantSearchViewModel> = this.store.select(selectTenantSearchViewModel)

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.onExportItems()
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
        },
        {
          labelKey: 'TENANT_CREATE_UPDATE.ACTION.CREATE',
          icon: PrimeIcons.PLUS,
          titleKey: 'TENANT_CREATE_UPDATE.ACTION.CREATE',
          show: 'asOverflow',
          actionCallback: () => this.onCreateTenant()
        }
      ]
      return actions
    })
  )

  layout: 'list' | 'grid' = 'grid'
  diagramColumnId = 'tenantId'
  diagramColumn$ = this.viewModel$.pipe(
    map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
  )

  currentCardItem: Tenant | null = null
  cardMenuItems: MenuItem[] = [
    {
      icon: PrimeIcons.FILE_EDIT,
      label: 'Edit',
      command: () => this.handleEditEntry(this.currentCardItem as Tenant)
    }
  ]
  imageBasePath = this.imageService.configuration.basePath!
  private loadedImages = new Set()
  private failedImages = new Set()

  public tenantSearchForm: FormGroup = this.formBuilder.group({
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
    private readonly imageService: ImagesAPIService
  ) {}

  public ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'TENANT_SEARCH.BREADCRUMB',
        labelKey: 'TENANT_SEARCH.BREADCRUMB',
        routerLink: '/tenant'
      }
    ])

    this.viewModel$
      .pipe(
        map((vm) => vm.searchCriteria),
        distinctUntilChanged(deepEqual)
      )
      .subscribe((sc) => {
        this.tenantSearchForm.reset(sc)
      })
  }

  public searchConfigInfoSelectionChanged(searchConfig: SearchConfigData | undefined) {
    this.store.dispatch(
      TenantSearchActions.searchConfigSelected({
        searchConfig: searchConfig
      })
    )
  }

  public onSearch(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<TenantSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: this.isVisible(key)
          ? isValidDate(value)
            ? new Date(
                Date.UTC(
                  value.getFullYear(),
                  value.getMonth(),
                  value.getDate(),
                  value.getHours(),
                  value.getMinutes(),
                  value.getSeconds()
                )
              )
            : value || null
          : null
      }),
      {}
    ) as TenantSearchCriteria
    this.store.dispatch(TenantSearchActions.searchButtonClicked({ searchCriteria }))
  }

  public onResetSearchCriteria() {
    this.store.dispatch(TenantSearchActions.resetButtonClicked())
  }

  public onExportItems() {
    this.viewModel$.pipe(first()).subscribe((data) => {
      this.exportDataService.exportCsv(data.displayedColumns, data.results, 'tenant.csv')
    })
  }

  getImageUrl(objectId: string): string {
    return `${this.imageBasePath}/images/${objectId}/${RefType.Logo}`
  }

  imageLoaded(id: string) {
    this.failedImages.delete(id)
  }

  imageLoadFailed(id: string) {
    this.failedImages.add(id)
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

  openMenu(menu: any, event: Event, item: Tenant) {
    this.currentCardItem = item
    menu.toggle(event)
  }

  handleOpenEntryDetails(item: Tenant) {
    console.log('Details', item)
  }

  handleEditEntry(item: Tenant) {
    this.store.dispatch(TenantSearchActions.editTenantButtonClicked({ id: item.id }))
  }

  showDefaultIcon(id: string): boolean {
    return this.failedImages.has(id)
  }

  onCreateTenant() {
    this.store.dispatch(TenantSearchActions.createTenantButtonClicked())
  }

  private isVisible(control: string) {
    return this.visibleFormControls.some(
      (formControl) => formControl.name !== null && String(formControl.name) === control
    )
  }
}
