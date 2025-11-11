import { Component, inject } from '@angular/core';
import { DialogRef, Dialog } from '@angular/cdk/dialog';
import { AuthService } from '../../services/auth.service';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'crh-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
  standalone: false,
})
export class LoginDialogComponent {
  private authService = inject(AuthService);
  private dialogRef = inject(DialogRef<unknown, boolean>);
  private dialog = inject(Dialog);

  protected email = '';
  protected password = '';

  // covered password
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
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Invalid email or password. Please try again.' },
      });
    }
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}

