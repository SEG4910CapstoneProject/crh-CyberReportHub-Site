import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { ReportsService } from '../../../shared/services/reports.service';
import { Dialog } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';

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
  // A restricted template is a special template that takes into account analyst's comment, IOCs and other information.
  // It is only accessible to a subset of analysts (restricted analysts)
  // A non restricted template is open to all analysts to use to create reports, it contains articles and their AI generated summaries.
  protected email_templates = ["non_restricted","restricted"] 
  protected isDarkMode$ = this.darkModeService.isDarkMode$;
  // choosen_email_template tracks the template chosen by the user, it is also used to track which email_template_option has the selected style applied to it
  public choosen_email_template = "";
  private dialog = inject(Dialog);
  private translateService = inject(CrhTranslationService);

  private readonly ERROR_MESSAGE:string = 'dialog.error_message_incomplete_fields';

  constructor() {
    this.form = this.fb.group({
      reportType: ['', Validators.required]
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

  // The template is coming from the child card, and it is passed to the parent in this function.
  set_email_template(template:string):void
  {
    this.choosen_email_template = template;
  }

  // This function is used as a validator, as all fields must be present to be able to move forward with report creation
  collect_report_types():boolean
  {
    console.log("in report_new, the chosen template is: ",this.choosen_email_template,"the report type is: ",this.form.get('reportType')?.value);
    if (this.form.get('reportType')?.value == "" || this.choosen_email_template == "")
    {
      // trigger an alert if one of the fields is missing, although reportType has a mandatory validator on it
      this.translateService.getTranslationFromKeyAsStream(this.ERROR_MESSAGE).subscribe((data)=>{
        const error_message = data;
        setTimeout(()=> { // this prevents an aria hidden warning, it's for accessibility purposes
          this.dialog.open(ErrorDialogComponent, {
            data:{
              message:error_message
            }
          })
        })
      })
      return false;
    }

    return true;
  }

  next(): void {
    if (!this.collect_report_types())
    {
      return;
    }
    const reportType = this.form.get('reportType')?.value.toLowerCase();

    let template_type = '';

    if (this.choosen_email_template == 'restricted')
    {
      template_type = 'restricted';
    } else {
      template_type = 'nonRestricted'
    }

    this.reportsService.createBasicReport(reportType,template_type).subscribe({
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
