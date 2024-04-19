import { ColumnType, DataTableColumn, RowListGridData, SearchConfigInfo } from '@onecx/portal-integration-angular';
import {
    selectTenantSearchViewModel,
    selectDisplayedColumns,
    selectResults
  } from './tenant-search.selectors';
  
  describe('Tenant search selectors:', () => {
    describe('selectSearchResultsCount', () => {

      it('should return the amount of results', () => {
        expect(selectDisplayedColumns.projector([], [])).toHaveLength(0);
      });
  
      it('should return 0 when results are not defined', () => {
        expect(selectResults.projector([])).toHaveLength(0);
      });
    });
  
    describe('selectTenantSearchViewModel', () => {
      it('should combine the input to be the viewmodel', () => {
        let columns : DataTableColumn[]= [{
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
          }
        ];

        let searchCriteria = {
            orgId: "1",
            
        };
        let results : RowListGridData[]= [{id: 1, imagePath: ''}];
        let searchConfigs: SearchConfigInfo[] = [{id: '1', name: "test1"}];
        let selectedSearchConfig = null;
        let displayedColumns : DataTableColumn[]= [{
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
          }
        ];
        let viewMode = 'advanced' as "basic" | "advanced";
        let chartVisible = false;
        let searchConfigEnabled = true;
        expect(
            selectTenantSearchViewModel.projector(
                columns,
                searchCriteria,
                results,
                searchConfigs,
                selectedSearchConfig,
                displayedColumns,
                viewMode,
                chartVisible,
                searchConfigEnabled
          )
        ).toEqual({
                columns: columns,
                searchCriteria:searchCriteria,
                results:results,
                searchConfigs:searchConfigs,
                selectedSearchConfig:selectedSearchConfig,
                displayedColumns:displayedColumns,
                viewMode:viewMode,
                chartVisible:chartVisible,
                searchConfigEnabled:searchConfigEnabled
        });
      });
    });
  });