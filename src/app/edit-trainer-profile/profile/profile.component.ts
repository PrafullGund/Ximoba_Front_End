import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditTrainerProfileService } from '../edit-trainer-profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private editTrainerService: EditTrainerProfileService
  ) 
  {
    this.profileForm = this.fb.group({
      f_Name: [''],
      l_Name: [''],
      institute_name: [''],
      Website:[''],
      facebook:[''],
      instagram:[''],
      youtube:[''],

    });
  }

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    this.editTrainerService.getInstituteProfile().subscribe(
      (data) => {
        if (data) {
          this.profileForm.patchValue({
            f_Name: data.f_Name || '',
            l_Name: data.l_Name || '',
            institute_name: data.institute_name || '',
            Website: data.social_media?.Website || '',
            facebook: data.social_media?.facebook || '',
            instagram: data.social_media?.instagram || '',
            youtube: data.social_media?.youtube || ''
          });
        }
      },
      (error) => {
        console.error('Error fetching profile data:', error);
      }
    );
  }
  
    submitForm() {
      if (this.profileForm.valid) {
        const updatedData = this.profileForm.value;
        this.editTrainerService.updateInstituteProfile(updatedData).subscribe(
          (response) => {
            console.log('Profile updated successfully:', response);
            Swal.fire('Success!', 'Profile updated successfully!', 'success');
          },
          (error) => {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
          }
        );
      } else {
        alert('Please fill out the form correctly.');
      }
    }
}