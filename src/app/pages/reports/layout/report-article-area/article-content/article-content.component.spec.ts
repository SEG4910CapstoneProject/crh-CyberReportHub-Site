import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentComponent } from './article-content.component';
import { ComponentRef } from '@angular/core';
import { JsonArticleReportResponse } from '../../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';

window.structuredClone = (item): any => JSON.parse(JSON.stringify(item));

describe('ArticleContentComponent', () => {
  let component: ArticleContentComponent;
  let fixture: ComponentFixture<ArticleContentComponent>;
  let componentRef: ComponentRef<ArticleContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleContentComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get available iocs', () => {
    componentRef.setInput('articleDetails', {
      iocs: [
        {
          iocId: 1,
          iocTypeId: 1,
          iocTypeName: 'url',
          value: 'ioc1',
        },
        {
          iocId: 2,
          iocTypeId: 1,
          iocTypeName: 'url',
          value: 'ioc2',
        },
        {
          iocId: 3,
          iocTypeId: 2,
          iocTypeName: 'hash',
          value: 'ioc3',
        },
      ],
    } as JsonArticleReportResponse);

    expect(component['availableIocs']()).toEqual(['url: 2', 'hash: 1']);
  });

  it('should have empty ioc array when data not defined', () => {
    expect(component['availableIocs']()).toStrictEqual([]);
  });
});
