import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { SortHeaderComponent } from './sort-header.component';
import { CrhSortDirective } from './sort.directive';
import { CrhColumnDefDirective } from '../cell';
import { BehaviorSubject } from 'rxjs';
import { SortResult } from './sort.models';

describe('SortHeaderComponent', () => {
  const COLUMN_NAME = 'SomeColumn';
  let component: SortHeaderComponent;
  let fixture: ComponentFixture<SortHeaderComponent>;

  let onSortChange: BehaviorSubject<SortResult | undefined>;

  beforeEach(async () => {
    onSortChange = new BehaviorSubject<SortResult | undefined>(undefined);

    await TestBed.configureTestingModule({
      imports: [SortHeaderComponent],
      providers: [
        MockProvider(CrhSortDirective, {
          _onSortChange: onSortChange.asObservable(),
          cycleNextSortOption: jest.fn(),
        } as unknown as CrhSortDirective),
        MockProvider(CrhColumnDefDirective, {
          name: COLUMN_NAME,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SortHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('shouldUseHoverColor', () => {
    it('should use hoverColor if hovering and current sort is not defined', () => {
      component['currentSortSignal'].set(undefined);
      component.onMouseEnter();
      fixture.detectChanges();

      expect(component['shouldUseHoverColor']()).toEqual(true);
    });

    it('should not use hoverColor if hovering and current sort is defined', () => {
      component['currentSortSignal'].set({
        columnId: COLUMN_NAME,
        direction: 'ascending',
      });
      component.onMouseEnter();
      fixture.detectChanges();

      expect(component['shouldUseHoverColor']()).toEqual(false);
    });
  });

  describe('shouldShowAsCurrentSort', () => {
    it('should show icon when hovering', () => {
      component.onMouseEnter();
      fixture.detectChanges();

      expect(component['shouldShowAsCurrentSort']()).toEqual(true);
    });

    it('should show icon when current sort is on this column', () => {
      component['currentSortSignal'].set({
        columnId: COLUMN_NAME,
        direction: 'ascending',
      });
      fixture.detectChanges();

      expect(component['shouldShowAsCurrentSort']()).toEqual(true);
    });

    it('should not show icon when current sort is not on this column', () => {
      component['currentSortSignal'].set({
        columnId: 'other Column',
        direction: 'ascending',
      });
      fixture.detectChanges();

      expect(component['shouldShowAsCurrentSort']()).toEqual(false);
    });

    it('should not show icon when current sort is undefined', () => {
      component['currentSortSignal'].set(undefined);
      fixture.detectChanges();

      expect(component['shouldShowAsCurrentSort']()).toEqual(false);
    });
  });

  it('should get correct sort icon', () => {
    component['currentSortSignal'].set({
      columnId: COLUMN_NAME,
      direction: 'ascending',
    });
    fixture.detectChanges();

    expect(component['currentSortIcon']()).toEqual('arrow_upward');
  });

  it('should get correct aria sort label', () => {
    component['currentSortSignal'].set({
      columnId: COLUMN_NAME,
      direction: 'ascending',
    });
    fixture.detectChanges();

    expect(component['ariaSortLabel']()).toEqual('ascending');
  });
});
