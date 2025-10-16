import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'crh-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
  standalone: false,
})
export class LoginDialogComponent {
  private authService = inject(AuthService);
  private dialogRef = inject(DialogRef<unknown, boolean>);

  protected email = '';
  protected password = '';

  //covered password
  public showPassword = false;
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onLogin(): Promise<void> {
    const success = await this.authService.login(this.email, this.password);

    if (success) {
      this.dialogRef.close(true);
      console.log('Login successful!');
    } else {
      console.error('Login failed');
    }
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
