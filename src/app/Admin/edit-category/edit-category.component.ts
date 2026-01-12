import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  _id: any;
  uploadForm!: FormGroup;
  category_image: File | null = null;
  categoryImagePreview: string | null = null; // <-- Declare this property

  constructor(
    private router: ActivatedRoute,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private route: Router
  ) {
    this._id = this.router.snapshot.paramMap.get('_id');
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      _id: [''],
      category_name: ['', Validators.required],
      sub_title: ['', Validators.required],
      category_image: ['', Validators.required]
    });

    this.adminService.getCategoryById(this._id).subscribe(d => {
      this.uploadForm.patchValue({
        _id: d._id,
        category_name: d.category_name,
        sub_title: d.sub_title
      });

      if (d.category_image) {
        this.categoryImagePreview = d.category_image; 
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.category_image = file;

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('_id', this.uploadForm.get('_id')?.value);
    formData.append('category_name', this.uploadForm.get('category_name')?.value);
    formData.append('sub_title', this.uploadForm.get('sub_title')?.value);

    if (this.category_image) {
      formData.append('category_image', this.category_image);
    }

    this.adminService.updateCategory(this._id, formData).subscribe({
      next: response => {
        Swal.fire('Success', 'Category updated successfully!', 'success');
        this.route.navigate(['dashboard/admincategory']);
      },
      error: error => {
        Swal.fire('Error', 'Error updating category.', 'error');
      }
    });
  }
}