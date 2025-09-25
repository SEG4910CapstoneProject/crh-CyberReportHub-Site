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

  protected username = '';
  protected password = '';

  //covered password
  public showPassword = false;
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public login(): void {
    if (this.authService.login(this.username, this.password)) {
      this.dialogRef.close(true);
    } else {
      alert('Invalid credentials');
    }
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
