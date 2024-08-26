import { ColumnType, DataTableColumn } from '@onecx/portal-integration-angular'

export const tenantSearchColumns: DataTableColumn[] = [
  {
    columnType: ColumnType.STRING,
    id: 'orgId',
    nameKey: 'TENANT_SEARCH.COLUMNS.ORG_ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.STRING,
    id: 'tenantId',
    nameKey: 'TENANT_SEARCH.COLUMNS.TENANT_ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.STRING,
    id: 'description',
    nameKey: 'TENANT_SEARCH.COLUMNS.DESCRIPTION',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.DATE,
    id: 'modificationDate',
    nameKey: 'TENANT_SEARCH.COLUMNS.MODIFICATION_DATE',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.DATE,
    id: 'creationDate',
    nameKey: 'TENANT_SEARCH.COLUMNS.CREATION_DATE',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  }
]
