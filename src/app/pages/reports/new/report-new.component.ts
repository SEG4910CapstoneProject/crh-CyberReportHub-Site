import { Component, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'crh-report-new',
  templateUrl: './report-new.component.html',
  styleUrl: './report-new.component.scss',
})
export class ReportNewComponent {
  protected form: FormGroup;
  protected isDarkMode = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      reportType: ['DAILY', Validators.required],
      templateType: ['byType', Validators.required],
      primaryColor: ['#002D72'],
      accentColor: ['#FF5733'],
      articles: this.fb.array([]),
      sections: this.fb.group({
        activeThreats: [true],
        globalNews: [true],
        customerThreats: [true],
      }),
      logo: [null],
    });

    // Add one empty article to start with
    this.addArticle();
  }

  get articles(): FormArray<FormGroup> {
    return this.form.get('articles') as FormArray<FormGroup>;
  }

  addArticle(): void {
    const articleForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      link: [''],
    });
    this.articles.push(articleForm);
  }

  removeArticle(index: number): void {
    this.articles.removeAt(index);
  }

  toggleDarkMode(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }

  handleLogoUpload(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.form.patchValue({ logo: file });
    }
  }
  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }

  handleDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    const url =
      event.dataTransfer?.getData('text/uri-list') ||
      event.dataTransfer?.getData('text/plain');

    if (url) {
      this.articles.at(index).patchValue({ link: url });
    }
  }

  submit(): void {
    console.log('Form Value:', this.form.value);
    // Here you’d normally send to backend
    alert('Report Created! (mock flow)');
    this.router.navigate(['/reports']);
  }

  cancel(): void {
    this.router.navigate(['/reports']);
  }
}
