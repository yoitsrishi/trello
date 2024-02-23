import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequestInterface } from '../../types/registerRequest.interface';
import { currentUser } from '../../../../../../server/src/controllers/users';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  errorMessage: string | null = null;
  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    const formValue = this.form.value as RegisterRequestInterface;
    if (formValue.email && formValue.username && formValue.password) {
      this.authService.register(formValue).subscribe({
        next: (currentUser) => {
          console.log('currentUser', currentUser);
          this.authService.setToken(currentUser);
          this.authService.setCurrentUser(currentUser);
          this.errorMessage = null;
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          console.log('err', err.error);
          this.errorMessage = err.error.join(', '); //as we are sending a array of strings from our backend
        },
      });
    } else {
      console.error('Some form values are undefined.');
    }
  }
}
