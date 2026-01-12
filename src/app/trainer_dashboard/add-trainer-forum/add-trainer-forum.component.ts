import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import Swal from 'sweetalert2';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-trainer-forum',
  templateUrl: './add-trainer-forum.component.html',
  styleUrls: ['./add-trainer-forum.component.css']
})
export class AddTrainerForumComponent {
  subCategoryList: any[] = [];
  forumForm: FormGroup;
  filteredCategory: any[] = [];
  tagsControl: FormControl = new FormControl('');
  tags: string[] = [];
  categoryID: any | null = null;
  forumtype = ['Global', 'Internal'];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) {
    this.forumForm = this.fb.group({
      forumtype: [''],
      category: [''],
      subCategory: [''],
      title: [''],
      description: [''],
      tags: [this.tags],
    });
  }

  ngOnInit(): void {
    this.forumForm = this.fb.group({
      forumtype: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: [this.tags],
    });
    this.tagsControl = new FormControl('');
    this.categoryID = this.route.snapshot.paramMap.get('id');
    this.getCategories();
    this.loadCategories();
  }

  addTag(event: any): void {
    const input = event.input;
    const value = event.value.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      this.tagsControl.setValue(this.tags);
    }
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagsControl.setValue(this.tags);
    }
  }

  editTag(tag: string, newTag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = newTag;
      this.forumForm.get('tags')?.setValue(this.tags);
    }
  }

  onCategoryChange(category: any): void {
    if (category && category) {
      this.adminService.getSubCategoryByCategoryId(category).subscribe(
        (result: any) => {
          this.subCategoryList = result?.data || [];
        },
        (error: any) => {
          this.subCategoryList = [];
        }
      );
    } else {
      this.subCategoryList = [];
    }
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.forumForm.controls).forEach((key) => {
      const controlValue = this.forumForm.get(key)?.value;
      if (key === 'tags' && Array.isArray(controlValue)) {
        const formattedTags = controlValue.map(tag => typeof tag === 'object' ? (tag.name || tag.toString()) : tag);
        formData.append('tags', formattedTags.join(','));
      } else {
        formData.append(key, controlValue);
      }
    });

    this.dashboardService.addForum(this.forumForm.value).subscribe({
      next: (response) => {
        this.forumForm.reset();
        this.tags = [];
        this.tagsControl.setValue(this.tags);

        Swal.fire({
          title: 'Uh hoo!',
          text: 'You have successfully published the forum!',
          icon: 'success',
          confirmButtonText: 'View now',
          confirmButtonColor: '#3b82f6',
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            confirmButton: 'custom-swal-button',
          }


        }).then((result: any) => {
          if (result.isConfirmed) {
          }
        });
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  saveForLater() {
  }

  getCategories() {
    this.dashboardService.getAllCategory().subscribe((data: any) => {
      if (data && data.length > 0) {
        this.filteredCategory = data;
        const firstCategory = data[0];
        const firstSubcategory = firstCategory.subcategories?.length > 0 ? firstCategory.subcategories[0]._id : '';

        this.forumForm.patchValue({
          category_name: firstCategory._id,
          sub_category_name: firstSubcategory
        });
      } else {
        this.filteredCategory = [];
        this.forumForm.patchValue({
          category_name: '',
          sub_category_name: ''
        });
      }
    });
  }
  loadCategories(): void {
    this.dashboardService.getAllCategory().subscribe((data: any) => {
      this.filteredCategory = data;
    });
  }

// tagsControl = new FormControl('');
// tags: string[] = [];

// addTag(event: MatChipInputEvent): void {
//   const value = (event.value || '').trim();
//   if (value && !this.tags.includes(value)) {
//     this.tags.push(value);
//   }
//   event.chipInput!.clear();
// }

// removeTag(tag: string): void {
//   this.tags = this.tags.filter(t => t !== tag);
// }
}
