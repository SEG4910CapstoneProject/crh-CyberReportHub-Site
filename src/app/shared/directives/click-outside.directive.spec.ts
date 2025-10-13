import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';

describe('ClickOutsideDirective', () => {
  let directive: ClickOutsideDirective;
  let mockElementRef: ElementRef;

  beforeEach(() => {
    const mockElement = document.createElement('div');
    mockElementRef = new ElementRef(mockElement);

    TestBed.configureTestingModule({
      providers: [{ provide: ElementRef, useValue: mockElementRef }],
    }).runInInjectionContext(() => {
      directive = new ClickOutsideDirective();
      (directive as any).elementRef = mockElementRef;
    });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should emit when clicking outside the element', () => {
    const emitSpy = jest.spyOn((directive as any)._onClickOutside, 'emit');
    const outsideElement = document.createElement('div');
    const event = { target: outsideElement } as unknown as MouseEvent;
    (directive as any).onClick(event);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit when clicking inside the element', () => {
    const emitSpy = jest.spyOn((directive as any)._onClickOutside, 'emit');
    const insideElement = mockElementRef.nativeElement;
    const event = { target: insideElement } as unknown as MouseEvent;
    (directive as any).onClick(event);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should do nothing when event target is null', () => {
    const emitSpy = jest.spyOn((directive as any)._onClickOutside, 'emit');
    const event = { target: null } as unknown as MouseEvent;
    (directive as any).onClick(event);
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
