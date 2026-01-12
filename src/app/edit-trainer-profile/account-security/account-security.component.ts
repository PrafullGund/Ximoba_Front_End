import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditTrainerProfileService } from '../edit-trainer-profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.css']
})
export class AccountSecurityComponent {
   accountForm: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private editTrainerService: EditTrainerProfileService
    ) {
      this.accountForm = this.fb.group({
        email_id: [''],
        mobile_number: [''],
        currentPassword: [''],
        newPassword: [''],
        reTypePassword: ['', [this.passwordMatchValidator]]
      });
    }
  
    ngOnInit() {
      this.loadAccountData();
    }
  
    loadAccountData() {
      this.editTrainerService.getInstituteProfile().subscribe(
        (data) => {
          this.accountForm.patchValue({
            email_id: data.email_id,
            mobile_number: data.mobile_number
          });
        },
        (error) => {
          console.error('Error fetching account data:', error);
        }
      );
    }
  
    passwordMatchValidator(control: any) {
      if (control.parent) {
        const password = control.parent.get('newPassword')?.value;
        const confirmPassword = control.value;
        if (password !== confirmPassword) {
          return { mismatch: true };
        }
      }
      return null;
    }
  
    submitForm() {
      if (this.accountForm.valid) {
        const updatedData = {
          email_id: this.accountForm.value.email_id,
          mobile_number: this.accountForm.value.mobile_number
        };
  
        this.editTrainerService.updateInstituteProfile(updatedData).subscribe(
          (response) => {
            console.log('Account details updated successfully:', response);
            Swal.fire('Success!', 'Account details updated successfully!', 'success');
          },
          (error) => {
            console.error('Error updating account details:', error);
            alert('An error occurred while updating your account details.');
          }
        );
      } else {
        console.error('Form is invalid');
        this.accountForm.markAllAsTouched();
      }
    }
  
    submitPasswordChange() {
      if (this.accountForm.valid) {
        const passwordData = {
          currentPassword: this.accountForm.value.currentPassword,
          newPassword: this.accountForm.value.newPassword
        };
  
        console.log('Password Change Data:', passwordData);
      } else {
        console.error('Password form is invalid');
      }
    }
}
