import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipContainerComponent } from './chip-container.component';
import { ComponentRef } from '@angular/core';

window.structuredClone =
  window.structuredClone ?? jest.fn(obj => JSON.parse(JSON.stringify(obj)));

describe('ChipContainerComponent', () => {
  let component: ChipContainerComponent;
  let fixture: ComponentFixture<ChipContainerComponent>;
  let componentRef: ComponentRef<ChipContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipContainerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should limit amount of displayed iocs without changing order', () => {
    componentRef.setInput('chipTexts', [
      'text1',
      'text2',
      'text3',
      'text4',
      'text5',
      'text6',
    ]);
    fixture.detectChanges();

    expect(component['availableTexts']().length).toBe(5);
    expect(component['availableTexts']()).toEqual([
      'text1',
      'text2',
      'text3',
      'text4',
      'text5',
    ]);
  });
});
