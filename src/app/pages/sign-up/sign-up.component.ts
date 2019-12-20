import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {UserRestService} from '../../core/services/user.service';
import {User} from '../../core/models/user.model';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  validateForm: FormGroup;
  titleCard = 'Registro de usuario';
  timerId;

  constructor(private fb: FormBuilder, private userRestService: UserRestService,
              private notification: NzNotificationService, private router: Router) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
      birthdate: ['', []]
    });
  }

  ngOnInit(): void {
  }

  submitForm(value: User, successTemplate: TemplateRef<{}>, errorTemplate: TemplateRef<{}>): void {
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    const {username, email, password, birthdate} = value;

    this.userRestService.postNewUser({
      username,
      email,
      password,
      birthdate: new Date(birthdate).getTime()
    }).subscribe(() => {
      this.notification.template(successTemplate);
      this.router.navigate(['/login']);
    }, () => {
      this.notification.template(errorTemplate);
      this.validateForm.controls.username.updateValueAndValidity();
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      let response;
      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.timerId = setTimeout(async () => {
        try {
          response = await this.userRestService.checkUserName(control.value).toPromise();
        } catch (e) {
          response = e;
        }
        const objectToFormValidation = this.userRestService.handleCheckUserResponse(response);
        observer.next(objectToFormValidation);
        observer.complete();
      }, 1000);
    });

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {error: true, required: true};
    } else if (control.value !== this.validateForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

}
