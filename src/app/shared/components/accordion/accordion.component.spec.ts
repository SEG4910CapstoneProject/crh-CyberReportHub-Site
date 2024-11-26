import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { AccordionComponent } from './accordion.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ComponentRef } from '@angular/core';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;
  let componentRef: ComponentRef<AccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccordionComponent],
      imports: [CdkAccordionModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default open state', fakeAsync(() => {
    const openMock = jest.fn();
    const closeMock = jest.fn();
    component['accordion'] = {
      open: openMock,
      close: closeMock,
    } as any;

    componentRef.setInput('defaultOpenState', true);
    tick();

    expect(openMock).toHaveBeenCalled();

    componentRef.setInput('defaultOpenState', false);
    tick();

    expect(closeMock).toHaveBeenCalled();
  }));
});
