import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {

  _id: any;
  uploadform!: FormGroup;
  showCategorydata: any[] = [];
  event_thumbnail: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null;
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

  formSubmitted: boolean = false;

  constructor
    (
      private router: ActivatedRoute,
      private trainerService: TrainerService,
      private formb: FormBuilder,
      private adminService: AdminService,
      private dashboardService: DashboardService
    ) {
    this._id = this.router.snapshot.paramMap.get('_id');
  }

  ngOnInit() {

    this.dashboardService.getAllCategory().subscribe(data => {
      this.showCategorydata = data;
    });

    this.uploadform = this.formb.group({
      _id: [''],
      event_name: ['', Validators.required],
      event_type: ['', Validators.required],
      event_categories: ['', Validators.required],
      sub_category: ['', Validators.required],
      event_date: ['', Validators.required],
      event_start_time: ['', Validators.required],
      event_end_time: ['', Validators.required],
      event_location: ['', Validators.required],
      estimated_seats: ['', Validators.required],
      event_languages: ['', Validators.required],
      event_info: ['', Validators.required],
      event_description: ['', Validators.required],
      event_thumbnail: ['', Validators.required],
    });

    this.trainerService.getEventByID(this._id).subscribe((d: any) => {
      this.uploadform.patchValue({
        _id: d._id,
        event_name: d.event_name,
        event_type: d.event_type,
        event_categories: d.event_categories,
        sub_category: d.sub_category,
        event_date: d.event_date,
        event_start_time: d.event_start_time,
        event_location: d.event_location,
        estimated_seats: d.estimated_seats,
        event_languages: d.event_languages,
        event_info: d.event_info,
        event_description: d.event_description,
        event_end_time: d.event_end_time,
      });
      this.event_thumbnail = d.event_thumbnail;
    });
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.uploadform.controls).forEach(key => {
      const controlValue = this.uploadform.get(key)?.value;
      if (key === 'event_thumbnail' && this.event_thumbnail) {
        formData.append(key, this.event_thumbnail);
      } else {
        formData.append(key, controlValue);
      }
    });

    this.trainerService.updateEventByID(this._id, formData).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Event updated successfully!', 'success');
      },

      error: error => {
        console.error('Update failed', error);
        Swal.fire('Error', 'Error updating event. Please try again later.', 'error');
      }
    });
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];

    if (!file) return;

    const eventName = this.uploadform.get('event_name')?.value.trim().replace(/\s+/g, '_');
    if (!eventName) {
      Swal.fire('Error', 'Course name is missing. Please ensure the course name is provided.', 'error');
      return;
    }
    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
      return;
    }

    if (!this.allowedFileTypes.includes(file.type)) {
      Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.', 'error');
      return;
    }

    try {
      const compressionOptions = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, compressionOptions);
      const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp');

      const fileExtension = convertedFile.name.split('.').pop();
      const newFileName = `${eventName}.${fileExtension}`;

      const renamedFile = new File([convertedFile], newFileName, {
        type: convertedFile.type,
        lastModified: Date.now(),
      });

      this.event_thumbnail = renamedFile;
      this.imageObjectURL = URL.createObjectURL(renamedFile);

    } catch (error) {
      Swal.fire('Error', 'There was an error processing the image. Please try again.', 'error');
    }
  }

  async convertImageFormat(file: File, format: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + `.${format.split('/')[1]}`, {
                  type: format,
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                reject(new Error('Canvas conversion failed.'));
              }
            },
            format, 0.9);
        };
        img.onerror = (err) => {
          reject(new Error('Error loading image for conversion: ' + err));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => {
        reject(new Error('Error reading file: ' + err));
      };
      reader.readAsDataURL(file);
    });
  }

  subCategory: any = [];
  fetchcategoryID: string = '';

  getsubcategory(): void {
    if (this.fetchcategoryID) {
      this.adminService.getSubCategoryByCategoryId(this.fetchcategoryID).subscribe(result => {
        this.subCategory = result.data || [];
      });
    } else {
      this.subCategory = [];
    }
  }
}