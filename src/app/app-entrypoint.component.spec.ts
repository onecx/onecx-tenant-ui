import { TestBed } from '@angular/core/testing';
import { AppEntrypointComponent } from './app-entrypoint.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppEntrypointComponent],
      imports: [RouterTestingModule],
      providers: [],
    }).compileComponents();
  });

  it('should create app entrypoint', () => {
    const fixture = TestBed.createComponent(AppEntrypointComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
