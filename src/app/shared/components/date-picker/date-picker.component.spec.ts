import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialInputDirective } from '../../directives/material-input.directive';

describe('DatePickerComponent', () => {
  let directive: MaterialInputDirective;
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    directive = component['materialInputDirective'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw error if field does not have a valid date format', () => {
    const badDateFormat = 'Bad Format';
    directive.fieldContent.set(badDateFormat);

    fixture.detectChanges();

    expect(component['activeError']()).toEqual(component['DATE_FORMAT_HINT']);
  });

  it('should revert to directive activeError if valid date format', () => {
    const activeSpy = jest.spyOn(directive, 'activeError');
    const dateInput = '2020-02-02';
    directive.fieldContent.set(dateInput);

    fixture.detectChanges();

    expect(component['activeError']()).toBeUndefined();
    expect(activeSpy).toHaveBeenCalled();
  });
});
