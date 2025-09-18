import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { ReportsService } from '../../../shared/services/reports.service';

@Component({
  selector: 'crh-report-new',
  templateUrl: './report-new.component.html',
  styleUrl: './report-new.component.scss',
  standalone: false,
})
export class ReportNewComponent implements OnInit, OnDestroy {
  protected form!: FormGroup;
  private subscriptions: Subscription[] = [];
  protected isDarkMode = signal(false);

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private darkModeService = inject(DarkModeService);
  private reportsService = inject(ReportsService);
  protected isDarkMode$ = this.darkModeService.isDarkMode$;

  constructor() {
    this.form = this.fb.group({
      reportType: ['DAILY', Validators.required],
      templateType: ['byType', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBrandingSettings();
    this.darkModeService.isDarkMode$.subscribe(mode =>
      this.isDarkMode.set(mode)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadBrandingSettings(): void {
    const savedSettings = localStorage.getItem('brandingSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.form.patchValue({
        primaryColor: settings.primaryColor || '#002D72',
        accentColor: settings.accentColor || '#FF5733',
        logo: settings.logo || null,
      });
    }
  }
  next(): void {
    const reportType = this.form.get('reportType')?.value;

    this.reportsService.createBasicReport(reportType).subscribe({
      next: response => {
        const reportId = response.reportId;
        console.log('Report created with ID:', reportId);

        // Navigate to the next page and pass reportId in state
        this.router.navigate(['/reports-articles'], {
          state: { reportId },
        });
      },
      error: (err: any) => {
        console.error('Error creating report:', err);
        alert('Failed to create report');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/reports']);
  }
}
