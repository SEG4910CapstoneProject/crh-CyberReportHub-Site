import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { AccordionComponent } from './accordion.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccordionComponent],
      imports: [CdkAccordionModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default open state', fakeAsync(() => {
    const openMock = jest.fn();
    (component as any).accordion = { open: openMock, close: jest.fn() };

    (component as any).defaultOpenState = (): boolean => true;

    component.setState((component as any).defaultOpenState());
    tick();

    expect(openMock).toHaveBeenCalled();
  }));
});
