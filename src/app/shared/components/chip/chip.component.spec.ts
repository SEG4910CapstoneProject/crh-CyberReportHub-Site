import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip.component';
import { ComponentRef } from '@angular/core';

describe('ChipComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;
  let componentRef: ComponentRef<ChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should limit value length', () => {
    componentRef.setInput(
      'text',
      'reallyLongIocStringNameThatIsSuperLongLikeThisAReallyLongMessage'
    );
    fixture.detectChanges();

    expect(component['formattedText']()).toEqual(
      'reallyLongIocStringNameThatIsSuperLongLikeThisA...'
    );
  });

  it('should not add "..." if ioc is exact length', () => {
    componentRef.setInput(
      'text',
      'reallyLongIocStringNameThatIsSuperLongLikeThisAndM'
    );
    fixture.detectChanges();

    expect(component['formattedText']()).toEqual(
      'reallyLongIocStringNameThatIsSuperLongLikeThisAndM'
    );
  });
});
