import { Component, inject } from '@angular/core';
import { Language } from '../../shared/models/languages.model';
import {
  BreadcrumbConfig,
  ReportHeaderInfo,
} from '../../shared/components/report-header/report-header.models';
import { DateTime } from 'luxon';
import { SortResult } from '../../shared/components/table/sort-header/sort.models';
import { ActivatedRoute, Router } from '@angular/router';
import { TextInputConfig } from '../../shared/components/text-input/text-input.model';
import { FormControl, Validators } from '@angular/forms';
import {
  SelectConfig,
  SelectOption,
} from '../../shared/components/select/select.model';
import { ErrorHintConfig } from '../../shared/models/input.model';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';

@Component({
    selector: 'crh-tester-page',
    templateUrl: './tester-page.component.html',
    styleUrl: './tester-page.component.scss',
    standalone: false
})
export class TesterPageComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public changeLang(lang: Language): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        lang: lang,
      },
      queryParamsHandling: 'merge',
    });
  }

  public reportHeaderBreadcrumbs: BreadcrumbConfig[] = [
    {
      translationKey: 'reportheader.breadcrumbs.report',
      onClick: () => console.log('reports clicked'),
    },
    {
      translationKey: 'reportheader.breadcrumbs.daily',
      onClick: () => console.log('daily clicked'),
    },
  ];
  public reportHeaderBreadcrumbsNotClickable: BreadcrumbConfig[] = [
    {
      translationKey: 'reportheader.breadcrumbs.report',
    },
    {
      translationKey: 'reportheader.breadcrumbs.daily',
    },
  ];

  public reportHeaderInfo: ReportHeaderInfo = {
    reportDate: DateTime.utc(2024, 7, 11),
    generatedDate: DateTime.utc(2024, 7, 10),
    lastModifiedDate: DateTime.utc(2024, 7, 9),
    isEmailSent: true,
  };

  public reportHeaderInfo1: ReportHeaderInfo = {
    reportDate: DateTime.utc(2024, 7, 11),
    generatedDate: DateTime.utc(2024, 7, 10),
    lastModifiedDate: DateTime.utc(2024, 7, 9),
    isEmailSent: false,
  };

  public onSortTableChange(column: SortResult | undefined): void {
    console.log(`Sort change on ${column?.columnId} in ${column?.direction}`);
  }

  public tableDataCols = ['basic', 'text', 'other'];

  public tableBasicData: {
    basic: string;
    text: string;
    other: string;
  }[] = [
    {
      basic: 'basic1',
      text: 'text1',
      other: 'other1',
    },
    {
      basic: 'basic2',
      text: 'text2',
      other: 'other2',
    },
    {
      basic: 'basic3',
      text: 'text3',
      other: 'other3',
    },
    {
      basic: 'basic4',
      text: 'text4',
      other: 'other4',
    },
    {
      basic: 'basic5',
      text: 'text5',
      other: 'other5',
    },
  ];

  public onTextInputChange(v: string | undefined): void {
    console.log(`Text: ${v}`);
  }

  public textInputConfigAffixIcons: TextInputConfig = {
    prefix: {
      ariaLabel: 'test',
      value: 'star',
      affixType: 'icon',
    },
    suffix: {
      ariaLabel: 'test',
      value: 'star',
      affixType: 'icon',
    },
  };

  public textInputConfigAffixIconsClickable: TextInputConfig = {
    prefix: {
      ariaLabel: 'test',
      value: 'star',
      affixType: 'clickable-icon',
      onClick: () => console.log('prefix click'),
    },
    suffix: {
      ariaLabel: 'test',
      value: 'home',
      affixType: 'clickable-icon',
      onClick: () => console.log('suffix click'),
    },
  };

  public textInputConfigAffixText: TextInputConfig = {
    prefix: {
      ariaLabel: 'test',
      value: 'star',
      affixType: 'text',
    },
    suffix: {
      ariaLabel: 'test',
      value: 'home',
      affixType: 'text',
    },
  };

  public textInputConfigErrorHint: ErrorHintConfig[] = [
    {
      hint: 'Error hint',
      hasError: (a): boolean => {
        console.log(`Checking ${a}`);
        return true;
      },
    },
  ];

  public textInputFormControl = new FormControl('', {
    validators: [Validators.required],
  });

  public textInputConfigTextArea: TextInputConfig = {
    variant: 'textarea',
  };

  public options: SelectOption[] = [
    {
      id: 'test1',
      label: 'Test 1',
    },
    {
      id: 'test2',
      label: 'Test 2',
    },
    {
      id: 'test3',
      label: 'Test 3',
    },
  ];

  public onSelectChoose(value: string | undefined): void {
    console.log(`Select: ${value}`);
  }

  public selectConfigBasic: SelectConfig = {
    options: this.options,
  };
  public selectConfigMultiple: SelectConfig = {
    options: this.options,
    multiple: true,
  };
  public selectConfigHint: SelectConfig = {
    options: this.options,
  };

  public selectConfigErrHint: ErrorHintConfig[] = [
    {
      hint: 'Error hint',
      hasError: (a): boolean => {
        console.log(`Checking ${a}`);
        return true;
      },
    },
  ];

  public selectConfigErrHintConfig: SelectConfig = {
    options: this.options,
  };

  public selectFormControl = new FormControl('', {
    validators: [Validators.required],
  });

  public selectConfigDisabled: SelectConfig = {
    options: this.options,
  };

  public onDateChoose(value: DateTime | undefined): void {
    console.log(`Date: ${value}`);
  }
  public dateFormControl = new FormControl(undefined, {
    validators: [Validators.required],
  });

  public datePickerDisabledDate = DateTime.fromISO('2020-10-06');

  public onPaginatorChoose(value: PaginatorStatus): void {
    console.log(
      `Paginator page: ${value.page} Per Page: ${value.itemsPerPage}`
    );
  }

  public onStatClick(type: string): void {
    console.log(`Stat click: ${type}`);
  }
}
