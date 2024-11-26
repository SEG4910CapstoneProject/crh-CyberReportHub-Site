import { TestBed } from '@angular/core/testing';
import { ResponsiveDirective } from './responsive.directive';
import { MockProvider } from 'ng-mocks';
import { ElementRef } from '@angular/core';

window.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('ResponsiveDirective', () => {
  let directive: ResponsiveDirective;
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      declarations: [ResponsiveDirective],
      providers: [MockProvider(ElementRef)],
    }).runInInjectionContext(() => {
      directive = new ResponsiveDirective();
    });
    expect(directive).toBeTruthy();
  });
});
