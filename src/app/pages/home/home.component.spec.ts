import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { AuthService } from '../../shared/services/auth.service';
import { ReportsService } from '../../shared/services/reports.service';
import { ArticleService } from '../../shared/services/article.service';

// Mock AuthService
const mockAuthService = {
  isLoggedIn$: of(false)
};

// Mock ReportsService
const mockReportsService = {
  getLatestReport: jest.fn().mockReturnValue(of(null))
};

// Mock ArticleService
const mockArticleService = {
  getTopMostViewedArticles: jest.fn().mockReturnValue(of([])),
  getArticlesOfNote: jest.fn().mockReturnValue(of([])),
  incrementViewCount: jest.fn().mockReturnValue(of({}))
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: ArticleService, useValue: mockArticleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
