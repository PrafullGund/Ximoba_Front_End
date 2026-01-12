import { ChangeDetectorRef, Component } from '@angular/core';
import { RealoadServiceService } from 'src/app/common_service/reaload-service.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent {
  compressedFile?: File;
  currentImage: string | null = null;
  trainer_image: File | null = null;
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
  maxResolution = { width: 2000, height: 2000 };
  uploadAttempts = 0;
  maxAttempts = 5;
  imageObjectURL: string | null = null;
  trainerName: any;

  constructor(
    private service: TrainerService,
    private cd: ChangeDetectorRef,
    private reload: RealoadServiceService
  ) { }

  ngOnInit(): void {
    this.loadTrainerData();
  }

  ngOnDestroy(): void {
    if (this.imageObjectURL) {
      URL.revokeObjectURL(this.imageObjectURL);
    }
  }

  loadTrainerData(): void {
    this.service.getTrainerById().subscribe((data: any) => {
      this.currentImage = data.trainer_image;
      this.trainerName = `${data.f_Name} ${data.l_Name}`;
    });
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];

    if (!file) return;

    // Ensure course name is available before proceeding
    const trainerName = this.trainerName.trim().replace(/\s+/g, '_'); // Replace spaces with underscores to make the filename valid
    if (!trainerName) {
      Swal.fire('Error', 'Course name is missing. Please ensure the course name is provided.', 'error');
      return;
    }

    // Check if the file is too large
    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
      return;
    }

    // Check if the file type is valid
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

      // Convert the compressed image to desired format (e.g., WebP)
      const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp'); // Change to 'image/avif' if needed

      // Create a new file name by combining the course name and the original file extension
      const fileExtension = convertedFile.name.split('.').pop();
      const newFileName = `${trainerName}.${fileExtension}`;

      // Create a new File object with the updated name
      const renamedFile = new File([convertedFile], newFileName, {
        type: convertedFile.type,
        lastModified: Date.now(),
      });

      // Log the file information (optional)
      console.log('Original file size:', file.size / 1024 / 1024, 'MB');
      console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
      console.log('Converted file size:', convertedFile.size / 1024 / 1024, 'MB');
      console.log('Renamed file:', renamedFile);

      // Set the renamed file for uploading
      this.trainer_image = renamedFile;

      // Preview the renamed image
      this.imageObjectURL = URL.createObjectURL(renamedFile);

    } catch (error) {
      console.error('Error during compression or conversion:', error);
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
            format, 0.1);
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

  onSubmit(): void {
    if (!this.trainer_image) {
      Swal.fire('Error', 'Please select an image to upload.', 'error');
      return;
    }

    if (this.uploadAttempts >= this.maxAttempts) {
      Swal.fire('Too Many Attempts', 'You’ve made too many upload attempts. Please wait a few minutes before trying again.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('trainer_image', this.trainer_image);

    this.service.updateTrainerDetails(formData).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Image updated successfully.', 'success');
        this.loadTrainerData();
        this.cd.detectChanges();
        this.uploadAttempts = 0;
        sessionStorage.setItem("Profile", response.user.trainer_image);
        this.reload.updateUserImage();
      },
      error: (error: any) => {
        if (error.status === 0) {
          Swal.fire('Network Error', 'Network issue detected. Please check your connection and try again.', 'error');
        } else {
          Swal.fire('Upload Failed', 'There was an error uploading your profile image. Please try again.', 'error');
        }
        this.uploadAttempts++;
      }
    });
  }
}