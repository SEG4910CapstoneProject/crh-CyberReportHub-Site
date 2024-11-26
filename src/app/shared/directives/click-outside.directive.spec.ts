import { TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';
import { MockProvider } from 'ng-mocks';
import { ElementRef } from '@angular/core';

describe('ClickOutsideDirective', () => {
  let directive: ClickOutsideDirective;
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      declarations: [ClickOutsideDirective],
      providers: [MockProvider(ElementRef)],
    }).runInInjectionContext(() => {
      directive = new ClickOutsideDirective();
    });
    expect(directive).toBeTruthy();
  });
});
