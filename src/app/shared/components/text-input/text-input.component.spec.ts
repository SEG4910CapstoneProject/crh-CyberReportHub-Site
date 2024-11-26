import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from './text-input.component';
import { MaterialModule } from '../../../material.module';
import { ComponentRef } from '@angular/core';
import { TextInputConfig } from './text-input.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;
  let componentRef: ComponentRef<TextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, NoopAnimationsModule],
      declarations: [TextInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default signals when not defined', () => {
    fixture.detectChanges();

    expect(component['variantSignal']()).toBeDefined();
    expect(component['prefixConfig']()).toBeUndefined();
    expect(component['suffixConfig']()).toBeUndefined();
  });

  it('should set up affixes properly with default values when partially defined', () => {
    componentRef.setInput('config', {
      prefix: {
        ariaLabel: 'some value',
        value: 'some other value',
      },
      suffix: {
        ariaLabel: 'some value',
        value: 'some other value',
      },
    } satisfies TextInputConfig);
    fixture.detectChanges();

    const prefixConfig = component['prefixConfig']();
    expect(prefixConfig).toBeDefined();
    expect(prefixConfig!.affixType).toBeDefined();
    expect(prefixConfig!.onClick).toBeDefined();
  });
});
