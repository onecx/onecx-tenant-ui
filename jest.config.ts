/* eslint-disable */
export default {
  displayName: 'onecx-tenant-ui',
  preset: './jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  // Coverage settings
  coverageDirectory: './coverage/onecx-tenant-ui',
  collectCoverage: true,
  coverageReporters: ['text-summary', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!@ngrx|(?!deck.gl)|d3-scale|(?!.*.mjs$))',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  reporters: [
    'default',
    ['jest-sonar-reporter', {
      reportPath: './reports',
      reportFileName: 'sonarqube_report.xml',
      sonarQubeVersion: 'LATEST',
      testPaths: ['./src/app'],
      testFilePattern: '**/*.spec.ts',
      indent: 2,
      useBrowserName: false,
    }],
    ['jest-coverage-reporter', {
      includeAllSources: true,
      dir: 'reports',
      subdir: 'coverage',
      reporters: [{ type: 'text-summary' }, { type: 'lcov' }],
    }]
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
