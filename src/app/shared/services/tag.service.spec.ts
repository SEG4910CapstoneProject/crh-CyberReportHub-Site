import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagService, Tag } from './tag.service';
import { HttpHeaders } from '@angular/common/http';
import { Article } from './article.service';

describe('TagService', () => {
  let service: TagService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080/api/v1/tags';
  const mockToken = 'mock-token';

  const mockArticle: Article = {
    articleId: 'a1',
    title: 'Test Article',
    link: 'http://example.com',
    description: 'Mock article for testing',
    category: 'News',
    publishDate: '2025-01-01',
    type: 'article',
    viewCount: 10,
    isArticleOfNote: false,
  };

  beforeEach(() => {
    localStorage.setItem('authToken', mockToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagService],
    });

    service = TestBed.inject(TagService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('getAuthHeaders', () => {
    it('should include Authorization header when token exists', () => {
      const headers = (service as any).getAuthHeaders() as HttpHeaders;
      expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    });

    it('should return empty headers when no token', () => {
      localStorage.removeItem('authToken');
      const headers = (service as any).getAuthHeaders() as HttpHeaders;
      expect(headers.get('Authorization')).toBeNull();
    });
  });

  it('should get user tags', () => {
    const mockTags: Tag[] = [{ tagId: 1, tagName: 'Work' }];

    service.getUserTags().subscribe((tags) => {
      expect(tags).toEqual(mockTags);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockTags);
  });

  it('should create a new tag', () => {
    const mockTag: Tag = { tagId: 2, tagName: 'Personal' };

    service.createTag('Personal').subscribe((tag) => {
      expect(tag).toEqual(mockTag);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ tagName: 'Personal' });
    req.flush(mockTag);
  });

  it('should delete a tag', () => {
    const tagId = 3;

    service.deleteTag(tagId).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${tagId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get articles by tag', () => {
    const tagId = 4;
    const mockArticles: Article[] = [mockArticle];

    service.getArticlesByTag(tagId).subscribe((articles) => {
      expect(articles).toEqual(mockArticles);
    });

    const req = httpMock.expectOne(`${apiUrl}/${tagId}/articles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticles);
  });

  it('should add an article to a tag', () => {
    const tagId = 5;
    const articleId = 'a1';

    service.addArticleToTag(tagId, articleId).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${tagId}/articles/${articleId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should remove an article from a tag', () => {
    const tagId = 6;
    const articleId = 'a2';

    service.removeArticleFromTag(tagId, articleId).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${tagId}/articles/${articleId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should rename a tag', () => {
    const tagId = 7;
    const newName = 'UpdatedTag';
    const mockResponse: Tag = { tagId, tagName: newName };

    service.renameTag(tagId, newName).subscribe((tag) => {
      expect(tag).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/${tagId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ tagName: newName });
    req.flush(mockResponse);
  });
});
