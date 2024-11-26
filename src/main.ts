import { CyberReportHubModule } from './app/cyber-report-hub.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic()
  .bootstrapModule(CyberReportHubModule, {
    ngZoneEventCoalescing: true,
  })
  .catch(err => console.error(err));
