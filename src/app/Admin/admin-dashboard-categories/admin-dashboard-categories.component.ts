import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/common_service/admin.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-dashboard-categories',
  templateUrl: './admin-dashboard-categories.component.html',
  styleUrls: ['./admin-dashboard-categories.component.css']
})
export class AdminDashboardCategoriesComponent implements OnInit {

  showIcon = true;
  // toggleIcon() {
  //   this.showIcon = !this.showIcon;
  // }
  showCategoryData: any[] = [];
  category_name: string = '';
  sub_title: string = '';
  category_image: File | null = null;
  categoryId: string = '';
  subCategoryName: string = '';
  subcategory: any;
  fetchCategoryId: any;
  subCategoryId: string = '';
  isEditingCategory: boolean = false;

  constructor(
    private adminService: AdminService,
    private dashboard: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadAllCategory();
  }

  loadAllCategory() {
    this.dashboard.getAllCategory().subscribe(data => {
      this.showCategoryData = data;
    });
  }

  onFileSelected(event: any): void {
    this.category_image = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.category_name || !this.sub_title || !this.category_image) {
      Swal.fire('Validation Error', 'All fields are required!', 'error');
      return;
    }

    if (this.category_name && this.category_image) {
      this.adminService.postCategory(this.category_name, this.sub_title, this.category_image).subscribe(
        response => {
          Swal.fire('Success!', 'Category Added Successfully..!', 'success');
          bootstrap.Modal.getInstance(document.getElementById('Add category Modal'))?.hide();
          this.loadAllCategory();
        },
        error => {
          console.error(alert("Category Allready Exit..!"), 'Error posting category', error);
        }
      );
    }
  }

  onDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Category? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteCategory(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The category has been deleted successfully.', 'success');
            this.loadAllCategory();
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the category.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The category is safe :)', 'info');
      }
    });
  }

  addSubCategory() {
    if (!this.categoryId || !this.subCategoryName) {
      console.error('All fields are required!');
      return;
    }
    this.adminService.postSubCategory(this.categoryId, this.subCategoryName).subscribe(
      (response) => {
        Swal.fire('Success!', 'Category Added Successfully..!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('Add subcategory Modal'))?.hide();
        this.resetForm();
      },
      (error) => {
        Swal.fire('Sorry', 'Error Adding category', 'error');
      });
  }

  resetForm() {
    this.categoryId = '';
    this.subCategoryName = '';
  }

  getSubCategory(): void {
    this.adminService.getSubCategoryByCategoryId(this.fetchCategoryId).subscribe(result => {
      this.subcategory = result.data || [];
    });
  }

  onCategorySelect(event: Event): void {
    const selectedCategoryName = (event.target as HTMLInputElement).value;
    const selectedCategory = this.showCategoryData.find(
      category => category.category_name === selectedCategoryName
    );

    if (selectedCategory) {
      this.fetchCategoryId = selectedCategory._id;
      this.category_name = selectedCategory.category_name;
      this.getSubCategory();
      this.isEditingCategory = false;
    } else {

    }
  }

  onSubCategoryClick(subCategory: any): void {
    this.subCategoryName = subCategory.sub_category_name;
    this.subCategoryId = subCategory._id;
  }

  updateSubCategory(): void {
    if (this.subCategoryName && this.subCategoryId && this.fetchCategoryId) {
      const updatedSubCategory = {
        id: this.subCategoryId,
        sub_category_name: this.subCategoryName,
        category_id: this.fetchCategoryId
      };

      this.adminService.updateSubCategory(updatedSubCategory.id, updatedSubCategory.sub_category_name, updatedSubCategory.category_id)
        .subscribe(response => {
          bootstrap.Modal.getInstance(document.getElementById('update subcategory Modal'))?.hide();
          this.getSubCategory();
        }, error => {
          console.error('Error updating subcategory:', error);
        });
    } else {
      console.error('Subcategory name or ID is invalid!');
    }
  }
}
