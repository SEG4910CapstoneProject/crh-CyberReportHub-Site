export * from './articles.service';
import { ArticlesService } from './articles.service';
export * from './reports.service';
import { ReportsService } from './reports.service';
export * from './statistics.service';
import { StatisticsService } from './statistics.service';
export const APIS = [ArticlesService, ReportsService, StatisticsService];
