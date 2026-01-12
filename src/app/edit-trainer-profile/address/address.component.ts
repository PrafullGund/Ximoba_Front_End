import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EditTrainerProfileService } from '../edit-trainer-profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private editTrainerService: EditTrainerProfileService
  ) {
    this.addressForm = this.fb.group({
      address1: [''],
      address2: [''],
      city: [''],
      pincode: [''],
      state: [''],
      country: ['']
    });
  }

  ngOnInit() {
    this.loadAddressData();
  }

  loadAddressData() {
    this.editTrainerService.getInstituteProfile().subscribe(
      (data) => {
        this.addressForm.patchValue({
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          pincode: data.pincode,
          state: data.state,
          country: data.country
        });
      },
      (error) => {
        console.error('Error fetching address data:', error);
      });
  }

  updateAddress() {
    if (this.addressForm.valid) {
      const addressUpdateData = {
        address1: this.addressForm.value.address1,
        address2: this.addressForm.value.address2,
        city: this.addressForm.value.city,
        pincode: this.addressForm.value.pincode,
        state: this.addressForm.value.state,
        country: this.addressForm.value.country
      };

      this.editTrainerService.updateInstituteProfile(addressUpdateData).subscribe(
        (response) => {
          console.log("Address Updated :", response);
          Swal.fire('Success!', 'Address Updated Successfully', 'success');
        },
        (error) => {
          console.error('Error updating address:', error);
          alert('An error occurred while updating the address.');
        }
      );
    } else {
      console.error('Form is invalid');
      this.addressForm.markAllAsTouched();
    }
  }
}
