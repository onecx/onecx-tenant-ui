const bypassFn = function (req, res, proxyOptions) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', 'GET, POST, HEAD, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      return res.send('');
    } else {
      console.log('############## REQ ', req.url);
      if (req.url === '/bff/searchConfig/infos/tenant-search' ) {
        console.log('new search config created')
        const searchConfigMock = {
          totalElements: 3,
          configs : [
            {
              id: '1',
              name: 'test1',
            },
            {
              id: '2',
              name: 'test2',
            },
            {
              id: '4',
              name: 'test3',
            },
          ]
        };

          res.end(
            JSON.stringify({
              totalElements:
              searchConfigMock.totalElements,
              configs: searchConfigMock.configs

            })
            
          );
      } else if (req.url === '/bff/searchConfig/' ) {
      const searchConfigMockCreated = {
        totalElements: 4,
        configs : [
          {
            id: '1',
            name: 'test1',
          },
          {
            id: '2',
            name: 'test2',
          },
          {
            id: '4',
            name: 'test3',
          },
          {
            id: '4',
            name: 'test4',
          },
        ]
      };

      res.end(
        JSON.stringify({
          totalElements:
          searchConfigMockCreated.totalElements,
          configs: searchConfigMockCreated.configs
        })
        );
        
      } else if (req.url === '/bff/searchConfig/2' || req.url === '/bff/searchConfig/1' ) {
        console.log('get search config with id')
        const searchConfigSingleMock = {
          config : {
                      id: 1,
                      page: 'tenant',
                      name: 'test',
                      modificationCount: 0,
                      fieldListVersion: 0,
                      isReadonly: false,
                      isAdvanced: false,
                      columns: [],
                      values: {
                        id: '10',
                      },
        }
        };

          res.end(
            JSON.stringify({
              config: searchConfigSingleMock.config

            })
            
          );
      } else if (req.url === '/bff/searchConfig/' ) {
      console.log('searchConfig created')

      const searchConfigMockCreated = {
        totalElements: 4,
        configs : [
          {
            id: '1',
            name: 'test1',
          },
          {
            id: '2',
            name: 'test2',
          },
          {
            id: '4',
            name: 'test3',
          },
          {
            id: '4',
            name: 'test4',
          },
        ]
      };
     
      res.end(
        JSON.stringify({
          totalElements:
          searchConfigMockCreated.totalElements,
          configs: searchConfigMockCreated.configs
        })
        );
      }
        else
       {
        return null;
      }
    }
  } catch (error) {
    console.log('error', error);
  }
};



const PROXY_CONFIG = {
  '/portal-api': {
    target: 'http://tkit-portal-server/',
    secure: false,
    pathRewrite: {
      '^.*/portal-api': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassFn,
  },
  '/bff': {
    target: 'http://onecx-tenant-bff',
    secure: false,
    pathRewrite: {
      '^.*/bff': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassFn,
  }
};

module.exports = PROXY_CONFIG;