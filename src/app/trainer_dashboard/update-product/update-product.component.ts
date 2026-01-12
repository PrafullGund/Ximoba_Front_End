import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  _id: any;
  uploadform!: FormGroup;
  product_image: File | null = null;
  product_gallary: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null;
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

  constructor(
    private router: ActivatedRoute,
    private trainerService: TrainerService,
    private formb: FormBuilder,
    private route: Router
  ) {
    this._id = this.router.snapshot.paramMap.get('_id');
  }

  ngOnInit() {
    this.uploadform = this.formb.group({
      product_name: ['', Validators.required],
      product_prize: ['', Validators.required],
      product_selling_prize: ['', Validators.required],
      products_info: ['', Validators.required],
      product_flag: ['', Validators.required],
      products_description: ['', Validators.required],
      product_image: [''],
      product_gallary: [''],
    });

    this.trainerService.getProductById(this._id).subscribe((d: any) => {
      this.uploadform.patchValue({
        product_name: d.product_name,
        product_prize: d.product_prize,
        product_selling_prize: d.product_selling_prize,
        products_info: d.products_info,
        product_flag: d.product_flag,
        products_description: d.products_description
      });

      this.product_image = d.product_image;
      this.product_gallary = d.product_gallary;
    });
  }



  onSubmit() {
    const formData = new FormData();
    formData.append('product_name', this.uploadform.get('product_name')?.value);
    formData.append('product_prize', this.uploadform.get('product_prize')?.value);
    formData.append('product_selling_prize', this.uploadform.get('product_selling_prize')?.value);
    formData.append('products_info', this.uploadform.get('products_info')?.value);
    formData.append('product_flag', this.uploadform.get('product_flag')?.value);
    formData.append('products_description', this.uploadform.get('products_description')?.value);

    if (this.product_image) {
      formData.append('product_image', this.product_image);
    }
    if (this.product_gallary) {
      formData.append('product_gallary', this.product_gallary);
    }

    this.trainerService.updateProduct(this._id, formData).subscribe({
      next: response => {
        Swal.fire('Success', 'Product updated successfully!', 'success');
        this.route.navigate(['/dashboard/product']);
      },
      error: error => {
        Swal.fire('Error', 'Error updating course.', 'error');
      }
    });
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];

    if (!file) return;
    const productName = this.uploadform.get('product_name')?.value.trim().replace(/\s+/g, '_');
    if (!productName) {
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
      const newFileName = `${productName}.${fileExtension}`;
      const renamedFile = new File([convertedFile], newFileName, {
        type: convertedFile.type,
        lastModified: Date.now(),
      });
      this.product_image = renamedFile;
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
}
