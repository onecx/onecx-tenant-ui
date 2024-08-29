import { TenantSearchActions } from './tenant-search.actions'
import { initialState, tenantSearchReducer } from './tenant-search.reducers'

describe('TenantSearchReducer', () => {
  describe('on tenantReceived action', () => {
    describe('with the initial state', () => {
      it('should store the results', () => {
        const tenant = {
          results: [
            { id: '123', modificationCount: 1 },
            { id: '234', modificationCount: 1 }
          ],
          totalElements: 2
        }
        const action = TenantSearchActions.tenantSearchResultsReceived(tenant)
        const nextState = tenantSearchReducer(initialState, action)
        expect(nextState).toEqual({
          ...initialState,
          results: tenant.results
        })
        expect(nextState).not.toBe(initialState)
      })
    })
  })
})
