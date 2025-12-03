import { ComponentFixture, TestBed, fakeAsync, flush, tick, flushMicrotasks } from '@angular/core/testing';
import { ReportNewComponent } from './report-new.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { ReportsService } from '../../../shared/services/reports.service';
import { Dialog } from '@angular/cdk/dialog';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { AuthService } from '../../../shared/services/auth.service';

describe('ReportNewComponent', () => {
  let component: ReportNewComponent;
  let fixture: ComponentFixture<ReportNewComponent>;

  let mockDarkModeService: any;
  let mockReportsService: any;
  let mockDialog: any;
  let mockTranslateService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockDarkModeService = { isDarkMode$: of(false) };
    mockReportsService = { createBasicReport: jest.fn() };
    mockDialog = { open: jest.fn() };
    mockTranslateService = { getTranslationOnce: jest.fn() };
    mockAuthService = { getCurrentUser: jest.fn(),getRole:jest.fn()};
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ReportNewComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: DarkModeService, useValue: mockDarkModeService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: Dialog, useValue: mockDialog },
        { provide: CrhTranslationService, useValue: mockTranslateService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load branding settings when present', () => {
    const settings = {
      primaryColor: '#111111',
      accentColor: '#222222',
      logo: 'logo.png',
    };

    localStorage.setItem('brandingSettings', JSON.stringify(settings));

    component['loadBrandingSettings']();

    expect((component as any).form.get('primaryColor')).toBeNull();
    expect((component as any).form.get('accentColor')).toBeNull();
    expect((component as any).form.get('logo')).toBeNull();

    localStorage.removeItem('brandingSettings');
  });

  it('should not fail when branding settings absent', () => {
    localStorage.removeItem('brandingSettings');
    expect(() => component['loadBrandingSettings']()).not.toThrow();
  });

  it('should set the chosen email template', () => {
    component.set_email_template('restricted');
    expect(component.choosen_email_template).toBe('restricted');
  });

  it('should return false and show dialog when reportType missing', fakeAsync(() => {
    component.choosen_email_template = 'restricted';
    (component as any).form.patchValue({ reportType: '' });
    mockTranslateService.getTranslationOnce.mockReturnValue(of('ERR'));

    const result = component.collect_report_types();

    flushMicrotasks();
    tick();
    flush();

    expect(result).toBe(false);
    expect(mockDialog.open).toHaveBeenCalled();
  }));

  it('should return false and show dialog when email template missing', fakeAsync(() => {
    component.choosen_email_template = '';
    (component as any).form.patchValue({ reportType: 'SOC' });
    mockTranslateService.getTranslationOnce.mockReturnValue(of('ERR'));

    const result = component.collect_report_types();

    flushMicrotasks();
    tick();
    flush();

    expect(result).toBe(false);
    expect(mockDialog.open).toHaveBeenCalled();
  }));

  it('should return false when both missing', fakeAsync(() => {
    component.choosen_email_template = '';
    (component as any).form.patchValue({ reportType: '' });
    mockTranslateService.getTranslationOnce.mockReturnValue(of('ERR'));

    const result = component.collect_report_types();

    flushMicrotasks();
    tick();
    flush();

    expect(result).toBe(false);
    expect(mockDialog.open).toHaveBeenCalled();
  }));

  it('should return true when both present', () => {
    component.choosen_email_template = 'restricted';
    (component as any).form.patchValue({ reportType: 'SOC' });
    const result = component.collect_report_types();
    expect(result).toBe(true);
  });

  it('should stop next() if collect_report_types returns false', () => {
    jest.spyOn(component, 'collect_report_types').mockReturnValue(false);
    component.next();
    expect(mockReportsService.createBasicReport).not.toHaveBeenCalled();
  });

  it('should call createBasicReport with restricted template', () => {
    component.choosen_email_template = 'restricted';
    (component as any).form.patchValue({ reportType: 'SOC' });
    mockReportsService.createBasicReport.mockReturnValue(of({ reportId: 5 }));

    component.next();

    expect(mockReportsService.createBasicReport).toHaveBeenCalledWith('soc', 'restricted');
  });

  it('should call createBasicReport with nonRestricted template', () => {
    component.choosen_email_template = 'non_restricted';
    (component as any).form.patchValue({ reportType: 'SOC' });
    mockReportsService.createBasicReport.mockReturnValue(of({ reportId: 10 }));

    component.next();

    expect(mockReportsService.createBasicReport).toHaveBeenCalledWith('soc', 'nonRestricted');
  });

  it('should navigate on successful report creation', () => {
    component.choosen_email_template = 'restricted';
    (component as any).form.patchValue({ reportType: 'SOC' });
    mockReportsService.createBasicReport.mockReturnValue(of({ reportId: 7 }));

    component.next();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/reports-articles'], {
      state: { reportId: 7, template_type: 'restricted' },
    });
  });

  it('should alert on report creation error', () => {
    component.choosen_email_template = 'restricted';
    (component as any).form.patchValue({ reportType: 'SOC' });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    mockReportsService.createBasicReport.mockReturnValue(
      throwError(() => new Error('fail'))
    );

    component.next();

    expect(alertSpy).toHaveBeenCalled();
  });

  it('should navigate to reports on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/reports']);
  });

  it('should return false for guest users', () => {
    mockAuthService.getCurrentUser.mockReturnValue(null);
    expect(component.canAccessReports()).toBe(false);
  });

  it('should allow valid roles', () => {
    mockAuthService.getCurrentUser.mockReturnValue({ role: 'admin' });
    expect(component.canAccessReports()).toBe(true);

    mockAuthService.getCurrentUser.mockReturnValue({ role: 'restricted_analyst' });
    expect(component.canAccessReports()).toBe(true);
  });

  it('should deny invalid roles', () => {
    mockAuthService.getCurrentUser.mockReturnValue({ role: 'viewer' });
    expect(component.canAccessReports()).toBe(false);
  });

  it('should update isDarkMode signal when darkModeService emits', () => {
    mockDarkModeService.isDarkMode$ = of(true);

    fixture = TestBed.createComponent(ReportNewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect((component as any).isDarkMode()).toBe(true);
  });
});

