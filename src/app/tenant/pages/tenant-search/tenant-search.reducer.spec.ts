import { TenantSearchActions } from './tenant-search.actions';
import { TenantSearchState } from './tenant-search.state';
import { initialState, tenantSearchReducer } from './tenant-search.reducers';

describe('TenantSearchReducer', () => {
  describe('on searchClicked action', () => {
    describe('with the initial state', () => {
      it('should store the query, increase button click count', () => {
        const action = TenantSearchActions.searchButtonClicked({ searchCriteria:{orgId: "orgIdTest"} });
        const nextState = tenantSearchReducer(initialState, action);
        expect(nextState).toEqual({
          ...initialState,
        });
        expect(nextState).not.toBe(initialState);
      });
    });

    describe('with the intermediate state', () => {
      const intermediateState: TenantSearchState = {
        columns: [],
        results: [{ id: 12345, modificationCount:1, orgId: 'asdf_1' }],
        searchConfigs: [],
        selectedSearchConfig: null,
        displayedColumns: [],
        viewMode: 'basic',
        chartVisible: true,
        searchConfigEnabled: true,
      };

      it('should store the query, increase button click count and clear the results', () => {
        const action = TenantSearchActions.searchButtonClicked({ searchCriteria: {} });
        const nextState = tenantSearchReducer(intermediateState, action);

        expect(nextState).toEqual({
          ...intermediateState,
        });
        expect(nextState).not.toBe(intermediateState);
      });
    });
  });

  describe('on tenantReceived action', () => {
    describe('with the initial state', () => {
      it('should store the results', () => {
        const tenant = {
            results: [
                {id: 123, modificationCount:1},
                {id: 234, modificationCount:1}
            ],
            totalElements: 2
        }
        const action = TenantSearchActions.tenantSearchResultsReceived(
            tenant
        );
        const nextState = tenantSearchReducer(initialState, action);
        expect(nextState).toEqual({
          ...initialState,
          results: tenant.results
        });
        expect(nextState).not.toBe(initialState);
      });
    });


  });
});