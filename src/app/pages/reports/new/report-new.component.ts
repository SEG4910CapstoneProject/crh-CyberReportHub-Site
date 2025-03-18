import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';


@Component({
  selector: 'crh-report-new',
  templateUrl: './report-new.component.html',
  styleUrl: './report-new.component.scss',
})
export class ReportNewComponent implements OnInit, OnDestroy {
  protected form!: FormGroup;
  private subscriptions: Subscription[] = [];
  protected isDarkMode = signal(false);


  private fb = inject(FormBuilder);
  private router = inject(Router);
  private darkModeService = inject(DarkModeService);
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
    this.router.navigate(['/reports-articles']);
  }





  cancel(): void {
    this.router.navigate(['/reports']);
  }


}
