import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'crh-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  private authService = inject(AuthService);
  private dialogRef = inject(DialogRef<unknown, boolean>);

  protected form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected login(): void {
    const { username, password } = this.form.value;
    if (this.authService.login(username, password)) {
      this.dialogRef.close(true);
    } else {
      alert('Invalid credentials');
      this.form.reset();
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
