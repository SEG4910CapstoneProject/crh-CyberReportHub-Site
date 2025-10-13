import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleSuggestionComponent } from './article-suggestion.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';

class MockColorsService {
  getComputedStyle = () => '#000'; // always return a color
  setAlpha = (color: string, alpha: number) => color;
}
describe('ArticleSuggestionComponent', () => {
  let component: ArticleSuggestionComponent;
  let fixture: ComponentFixture<ArticleSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticleSuggestionComponent,
        IconButtonComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
