import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrhSortDirective } from './sort.directive';
import { Component, inject } from '@angular/core';
import { SortDirection, SortResult } from './sort.models';

@Component({
  standalone: true,
  hostDirectives: [
    {
      directive: CrhSortDirective,
    },
  ],
})
class HostComponent {
  public hostDirective = inject(CrhSortDirective);
}

describe('SortComponent', () => {
  let directive: CrhSortDirective;
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let currentSortSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    directive = component.hostDirective;
    fixture.detectChanges();

    currentSortSpy = jest.spyOn(directive._onSortChange, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should set sort when changed', () => {
    const sortResult = {
      columnId: 'someCol',
      direction: 'ascending',
    } satisfies SortResult;
    directive.changeSort(sortResult);

    fixture.detectChanges();

    expect(currentSortSpy).toHaveBeenCalledWith(sortResult);
  });

  it('should set sort to undefined when direction is empty', () => {
    const sortResult = {
      columnId: 'someCol',
      direction: '',
    } satisfies SortResult;
    directive.changeSort(sortResult);

    fixture.detectChanges();

    expect(directive['currentSort']()).toBeUndefined();
  });

  it('should set sort to undefined when sort undefined', () => {
    directive.changeSort(undefined);

    fixture.detectChanges();

    expect(directive['currentSort']()).toBeUndefined();
  });

  it.each([
    {
      current: '',
      next: 'ascending',
    },
    {
      current: 'ascending',
      next: 'descending',
    },
  ])('should get next sort direction when cycling', ({ current, next }) => {
    const column = 'someCol';
    const originalSort: SortResult = {
      columnId: column,
      direction: current as SortDirection,
    };

    directive.changeSort(originalSort);
    fixture.detectChanges();
    currentSortSpy.mockClear();

    directive.cycleNextSortOption(column);
    fixture.detectChanges();

    expect(currentSortSpy).toHaveBeenCalledWith({
      columnId: column,
      direction: next as SortDirection,
    });
  });

  it('should reset sort direction when reached the end', () => {
    const column = 'someCol';
    const originalSort: SortResult = {
      columnId: column,
      direction: 'descending',
    };

    directive.changeSort(originalSort);
    fixture.detectChanges();
    currentSortSpy.mockClear();

    directive.cycleNextSortOption(column);
    fixture.detectChanges();

    expect(currentSortSpy).toHaveBeenCalledWith(undefined);
  });
});
