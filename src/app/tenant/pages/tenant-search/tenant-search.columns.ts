import { ColumnType, DataTableColumn } from '@onecx/portal-integration-angular';

export const tenantSearchColumns: DataTableColumn[] = [
    {
    columnType: ColumnType.STRING,
    id: 'id',
    nameKey: 'TENANT_SEARCH.COLUMNS.ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL',
    ],
  },
  {
    columnType: ColumnType.STRING,
    id: 'orgId',
    nameKey: 'TENANT_SEARCH.COLUMNS.ORG_ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.TENANT_GROUP.DEFAULT',
      'TENANT_SEARCH.TENANT_GROUP.EXTENDED',
      'TENANT_SEARCH.TENANT_GROUP.FULL',
    ],
  },
  {
    columnType: ColumnType.STRING,
    id: 'tenantId',
    nameKey: 'TENANT_SEARCH.COLUMNS.TENANT_ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.TENANT_GROUP.DEFAULT',
      'TENANT_SEARCH.TENANT_GROUP.EXTENDED',
      'TENANT_SEARCH.TENANT_GROUP.FULL',
    ],
  },
  {
    columnType: ColumnType.STRING,
    id: 'description',
    nameKey: 'TENANT_SEARCH.COLUMNS.DESCRIPTION',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.TENANT_GROUP.DEFAULT',
      'TENANT_SEARCH.TENANT_GROUP.EXTENDED',
      'TENANT_SEARCH.TENANT_GROUP.FULL',
    ],
  },
]
