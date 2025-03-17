import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { JsonReportResponse } from '../../../shared/sdk/rest-api/model/jsonReportResponse';

@Component({
  selector: 'crh-report-template',
  templateUrl: './report-template.component.html',
  styleUrl: './report-template.component.scss',
})
export class ReportTemplateComponent implements OnInit {
  reportId: string | null = null;
  reportData!: JsonReportResponse;
  primaryColor: string = '#002D72';
  accentColor: string = '#FF5733';
  logo: string | null = null;

  private route = inject(ActivatedRoute);
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id');
    if (this.reportId) {
      this.fetchReportData(parseInt(this.reportId, 10));
    }
    this.loadBrandingSettings();
  }

  private fetchReportData(id: number): void {
    this.reportsService.getReportByID(id).subscribe(
      (response: JsonReportResponse) => {
        this.reportData = response;
      },
      error => {
        console.error('Error fetching report:', error);
      }
    );
  }

  private loadBrandingSettings(): void {
    const savedSettings = localStorage.getItem('brandingSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.primaryColor = settings.primaryColor ?? '#002D72';
      this.accentColor = settings.accentColor ?? '#FF5733';
      this.logo = settings.logo ?? null;
    }
  }
}
