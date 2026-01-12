import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditTrainerProfileService } from '../edit-trainer-profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.css']
})
export class EducationalDetailsComponent {
  educationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private editTrainerService: EditTrainerProfileService
  ) {
  
    this.educationForm = this.fb.group({
      school: [''],
      college: [''],
      degree: [''],
    });
  }

  ngOnInit() {
    this.loadEducationData();
  }

  loadEducationData() {
    this.editTrainerService.getEducationDetails().subscribe(
      (data) => {
        this.educationForm.patchValue({
          school: data.school,
          college: data.college,
          degree: data.degree
        });
      },
      (error) => {
        console.error('Error fetching education details:', error);
      }
    );
  }

  updateEducationDetails() {
    if (this.educationForm.valid) {
      const educationData = this.educationForm.value; 

      this.editTrainerService.postEducation(educationData).subscribe(
        (response) => {
          console.log('Education details updated:', response);
           Swal.fire('Success!', 'Education Update Successfully!', 'success');
        },
        (error) => {
          console.error('Error updating education details:', error);
          alert('An error occurred while updating your education details.');
        }
      );
    } else {
      console.error('Form is invalid');
      this.educationForm.markAllAsTouched();
    }
  }

}