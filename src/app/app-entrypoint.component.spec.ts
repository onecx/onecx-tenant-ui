import { TestBed } from '@angular/core/testing';
import { AppEntrypointComponent } from './app-entrypoint.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppEntrypointComponent],
      imports: [],
      providers: [],
    }).compileComponents();
  });

  it('should create app entrypoint', () => {
    const fixture = TestBed.createComponent(AppEntrypointComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
