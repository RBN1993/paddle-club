import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthRestService} from '../../core/services/auth.service';
import {AuthModel} from '../../core/models/auth.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  titleCard = 'Inicio de sesión';
  errorMessage = null;

  ngOnInit(): void {
  }

  submitForm(value: AuthModel): void {
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.authRestService.login(value).subscribe(
      (res) => {
        this.authRestService.storeAccessToken(res.headers.get('Authorization'));
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = this.authRestService.makeLoginTextError(error);
      }
    );
  }

  constructor(private fb: FormBuilder, private authRestService: AuthRestService) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
}
