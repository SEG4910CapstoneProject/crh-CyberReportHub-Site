import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesterPageComponent } from './tester-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { CrhTranslationService } from '../../shared/services/crh-translation.service';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

describe('TesterPageComponent', () => {
  let component: TesterPageComponent;
  let fixture: ComponentFixture<TesterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TesterPageComponent],
      providers: [CrhTranslationService, MockProvider(ActivatedRoute)],
    }).compileComponents();

    fixture = TestBed.createComponent(TesterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
