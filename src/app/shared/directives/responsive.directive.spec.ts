import { TestBed } from '@angular/core/testing';
import { ElementRef, signal } from '@angular/core';
import { ResponsiveDirective, ResponiveBreakpoint } from './responsive.directive';

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
window.ResizeObserver = jest.fn(() => ({
  observe: mockObserve,
  unobserve: jest.fn(),
  disconnect: mockDisconnect,
})) as any;

describe('ResponsiveDirective', () => {
  let directive: ResponsiveDirective;
  let mockElementRef: ElementRef;

  beforeEach(() => {
    mockElementRef = new ElementRef(document.createElement('div'));
    TestBed.configureTestingModule({
      providers: [{ provide: ElementRef, useValue: mockElementRef }],
    }).runInInjectionContext(() => {
      directive = new ResponsiveDirective();
      (directive as any).elementRef = mockElementRef;
    });
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should observe the element on init', () => {
    directive.ngOnInit();
    expect(mockObserve).toHaveBeenCalledWith(mockElementRef.nativeElement);
  });

  it('should disconnect on destroy', () => {
    directive.ngOnDestroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should ignore resize when entries array is empty', () => {
    const spy = jest.spyOn((directive as any).currentSize, 'set');
    (directive as any).onResizeEvent([]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should set currentSize when entries are provided', () => {
    const spy = jest.spyOn((directive as any).currentSize, 'set');
    const entry = {
      borderBoxSize: [{ inlineSize: 200 }],
      contentBoxSize: [{ inlineSize: 180 }],
    };
    (directive as any).onResizeEvent([entry]);
    expect(spy).toHaveBeenCalledWith({
      borderSize: 200,
      contentSize: 180,
    });
  });

  it('should get current breakpoint when currentSize undefined', () => {
    const breakpoints: ResponiveBreakpoint[] = [
      { id: 'sm', breakpoint: 100 },
      { id: 'md', breakpoint: 200 },
    ];
    (directive as any).breakpoints = signal(breakpoints);
    const result = (directive as any).getCurrentBreakpointSize();
    expect(result).toEqual(breakpoints[0]);
  });

  it('should select correct breakpoint when size within range', () => {
    (directive as any).breakpoints = signal([
      { id: 'xs', breakpoint: 0 },
      { id: 'sm', breakpoint: 100 },
      { id: 'lg', breakpoint: 300 },
    ]);
    (directive as any).sizing = signal<'border-box' | 'content-box'>('border-box');
    (directive as any).currentSize.set({ borderSize: 250, contentSize: 240 });
    const result = (directive as any).getCurrentBreakpointSize();
    expect(result.id).toBe('sm');
  });

  it('should use content-box sizing logic', () => {
    (directive as any).breakpoints = signal([
      { id: 'sm', breakpoint: 100 },
      { id: 'md', breakpoint: 200 },
      { id: 'lg', breakpoint: 300 },
    ]);
    (directive as any).sizing = signal<'border-box' | 'content-box'>('content-box');
    (directive as any).currentSize.set({ borderSize: 150, contentSize: 350 });
    const result = (directive as any).getCurrentBreakpointSize();
    expect(result.id).toBe('lg');
  });

  it('should emit breakpoint change only when id changes', () => {
    const emitSpy = jest.spyOn((directive as any)._onBreakpointChange, 'emit');
    (directive as any).breakpoints = signal([
      { id: 'a', breakpoint: 100 },
      { id: 'b', breakpoint: 200 },
    ]);
    (directive as any).currentSize.set({ borderSize: 250, contentSize: 240 });
    const bp1 = (directive as any).getCurrentBreakpointSize();
    (directive as any).previousEmittedBreakpoint = { id: 'a', breakpoint: 100 };
    (directive as any)._onBreakpointChange.emit(bp1.id);
    expect(emitSpy).toHaveBeenCalledWith(bp1.id);
  });

  it('should not emit if breakpoint id did not change', () => {
    const emitSpy = jest.spyOn((directive as any)._onBreakpointChange, 'emit');
    const bp = { id: 'same', breakpoint: 100 };
    (directive as any).previousEmittedBreakpoint = bp;
    (directive as any)._onBreakpointChange.emit(bp.id);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
