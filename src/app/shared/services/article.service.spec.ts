import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ArticleService, Article } from './article.service';
import { EMPTY } from 'rxjs';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080/api/v1/articles';
  const reportsUrl = 'http://localhost:8080/api/v1/reports';
  const favUrl = 'http://localhost:8080/api/v1/favourites';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService],
    });

    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getArticles should throw an error', () => {
    expect(() => service.getArticles()).toThrowError('Method not implemented.');
  });

  describe('API calls', () => {
    it('addArticle should POST to /add', () => {
      const article = { title: 't', articleId: '1' } as Article;

      service.addArticle(article).subscribe((res) => {
        expect(res).toEqual({ ok: true });
      });

      const req = httpMock.expectOne(`${apiUrl}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(article);
      req.flush({ ok: true });
    });

    it('getArticlesByType should GET correct endpoint', () => {
      const mockArticles = [{ title: 't' } as Article];
      service.getArticlesByType('News').subscribe((res) => {
        expect(res).toEqual(mockArticles);
      });

      const req = httpMock.expectOne(`${apiUrl}/type/News`);
      expect(req.request.method).toBe('GET');
      req.flush(mockArticles);
    });

    it('getAllArticleTypesWithArticles should call correct URL', () => {
      const mockResp = { News: [{ title: 'A' } as Article] };
      service.getAllArticleTypesWithArticles(7).subscribe((res) => {
        expect(res).toEqual(mockResp);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/article-types-with-articles?days=7`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResp);
    });

    it('getAllArticlesTypesIncluded should call correct URL', () => {
      const mockResp = [{ title: 'Z', type: 'Intel' }];
      service.getAllArticlesTypesIncluded(30).subscribe((res) => {
        expect(res).toEqual(mockResp);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/get-all-articles-with-types?days=30`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResp);
    });

    it('getTopMostViewedArticles should GET /top-10', () => {
      const mock = [{ articleId: '1', title: 'A', url: '/a', viewCount: 9 }];
      service.getTopMostViewedArticles().subscribe((res) => {
        expect(res).toEqual(mock);
      });

      const req = httpMock.expectOne(`${apiUrl}/top-10`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });

    it('incrementViewCount should POST to increment endpoint', () => {
      service.incrementViewCount('123').subscribe((res) => {
        expect(res).toEqual({ done: true });
      });

      const req = httpMock.expectOne(`${apiUrl}/increment-view/123`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({ done: true });
    });

    it('chooseArticleOfNote should POST to toggle endpoint', () => {
      service.chooseArticleOfNote('99').subscribe((res) => {
        expect(res).toEqual({ toggled: true });
      });

      const req = httpMock.expectOne(`${apiUrl}/toggle-article-of-note/99`);
      expect(req.request.method).toBe('POST');
      req.flush({ toggled: true });
    });

    it('getArticlesOfNote should GET /articles-of-note', () => {
      const mock = [{ articleId: 'a', title: 'Note' }];
      service.getArticlesOfNote().subscribe((res) => {
        expect(res).toEqual(mock);
      });

      const req = httpMock.expectOne(`${apiUrl}/articles-of-note`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });

    it('getArticleByLink should call endpoint with link param', () => {
      const mock = { ok: true };

      service.getArticleByLink('xyz').subscribe((res) => {
        expect(res).toEqual(mock);
      });

      const req = httpMock.expectOne('/api/articles?link=xyz');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('Authenticated favourites', () => {
    beforeEach(() => {
      localStorage.setItem('authToken', 'abc123');
    });

    it('getMyFavourites should include Authorization header', () => {
      const mock = [{ articleId: '1', title: 'Fav' }];

      service.getMyFavourites().subscribe((res) => {
        expect(res).toEqual(mock);
      });

      const req = httpMock.expectOne(favUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
      req.flush(mock);
    });

    it('addFavourite should POST with Authorization', () => {
      service.addFavourite('42').subscribe((res) => {
        expect(res).toEqual({ added: true });
      });

      const req = httpMock.expectOne(`${favUrl}/42`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
      expect(req.request.body).toEqual({});
      req.flush({ added: true });
    });

    it('removeFavourite should DELETE with Authorization', () => {
      service.removeFavourite('42').subscribe((res) => {
        expect(res).toEqual({ removed: true });
      });

      const req = httpMock.expectOne(`${favUrl}/42`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
      req.flush({ removed: true });
    });
  });

  describe('getAuthHeaders', () => {
    it('should include Authorization when token exists', () => {
      localStorage.setItem('authToken', 'abc');
      const headers = (service as any).getAuthHeaders();
      expect(headers.get('Authorization')).toBe('Bearer abc');
    });

    it('should return empty headers when no token', () => {
      localStorage.removeItem('authToken');
      const headers = (service as any).getAuthHeaders();
      expect(headers.keys().length).toBe(0);
    });
  });

  describe('addArticlesToReport', () => {
    it('should return EMPTY when reportId is null', () => {
      const result = service.addArticlesToReport(null as any, ['1']);
      expect(result).toBe(EMPTY);
    });

    it('should return EMPTY when reportId < 0', () => {
      const result = service.addArticlesToReport(-5, ['1']);
      expect(result).toBe(EMPTY);
    });

    it('should return EMPTY when articleIds is empty', () => {
      const result = service.addArticlesToReport(10, []);
      expect(result).toBe(EMPTY);
    });

    it('should PATCH valid data when params are correct', () => {
      const mockResponse = { ok: true };

      service.addArticlesToReport(7, ['a1', 'a2']).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${reportsUrl}/7/addArticle`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(['a1', 'a2']);

      req.flush(mockResponse);
    });
  });
});
