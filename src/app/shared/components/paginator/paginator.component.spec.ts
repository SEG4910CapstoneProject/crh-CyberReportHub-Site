import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { ComponentRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let componentRef: ComponentRef<PaginatorComponent>;
  let fixture: ComponentFixture<PaginatorComponent>;

  const paginatorOptions = [10, 20, 30];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginatorComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    componentRef = fixture.componentRef;
    component = fixture.componentInstance;
    fixture.detectChanges();

    componentRef.setInput('options', paginatorOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct select config', () => {
    expect(component['selectConfig']()).toMatchObject({
      options: [
        {
          id: '0',
          label: '10',
        },
        {
          id: '1',
          label: '20',
        },
        {
          id: '2',
          label: '30',
        },
      ],
    });
  });

  it('should calculate startNum correctly', () => {
    componentRef.setInput('totalResults', 100);
    fixture.detectChanges();

    expect(component['startNum']()).toEqual(1);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['startNum']()).toEqual(11);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['startNum']()).toEqual(21);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['startNum']()).toEqual(31);
  });

  it('should calculate endNum correctly', () => {
    componentRef.setInput('totalResults', 100);
    fixture.detectChanges();

    expect(component['endNum']()).toEqual(10);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['endNum']()).toEqual(20);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['endNum']()).toEqual(30);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['endNum']()).toEqual(40);
  });

  it('should disable decrement buttons when on first page', () => {
    componentRef.setInput('totalResults', 100);
    fixture.detectChanges();

    expect(component['disableFirstPage']()).toEqual(true);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['disableFirstPage']()).toEqual(false);
  });

  it('should disable increment buttons when on last page', () => {
    componentRef.setInput('totalResults', 30);
    fixture.detectChanges();

    expect(component['disableLastPage']()).toEqual(false);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['disableLastPage']()).toEqual(false);

    component['incrementPage']();
    fixture.detectChanges();
    expect(component['disableLastPage']()).toEqual(true);
  });

  it('should leave start number in range when onSelectChange called', () => {
    componentRef.setInput('totalResults', 100);
    fixture.detectChanges();

    const pageStatusSpy = jest.spyOn(component.pageStatus, 'emit');

    // Bring to 31 - 50
    component['incrementPage']();
    fixture.detectChanges();
    component['incrementPage']();
    fixture.detectChanges();
    component['incrementPage']();
    fixture.detectChanges();

    expect(pageStatusSpy).toHaveBeenCalledTimes(3);
    pageStatusSpy.mockClear();

    // Change to 20
    component['onSelectChange']('1');
    fixture.detectChanges();

    // Expect new range 21 - 40
    expect(pageStatusSpy).toHaveBeenCalledWith({
      itemsPerPage: 20,
      page: 1,
    });
    expect(component['startNum']()).toEqual(21);
    expect(component['endNum']()).toEqual(40);
  });
});
