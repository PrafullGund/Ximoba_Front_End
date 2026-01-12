import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';
import { jwtDecode } from "jwt-decode";
declare var bootstrap: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  isUser: boolean = true;
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isInstitute: boolean = false;
  isAdmin: boolean = false;
  showProductDataUser: any;
  showProductData: any;
  selectedProduct: any;
  showCategoryData: any;
  starsArray: number[] = [1, 2, 3, 4, 5];
  id: any;
  Showproductdata: any;
  showPendingProducts: any;
  product_image: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null;
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
  subCategory: any = [];
  fetchcategoryID: string = '';
  showproductName = false;
  showproductName1 = false;

  showIcon = false;
  toggleIcon() {
    this.showIcon = !this.showIcon;
  }

  checkUserRole() {
    const role = this.authService.getUserRole();
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER';
  }

  product = {
    product_name: '',
    product_prize: '',
    product_selling_prize: '',
    categoryid: '',
    sub_category: '',
    product_flag: '',
    tags: [],
    products_info: '',
    products_description: '',
    product_image: '',
    product_gallary: '',
  };

  formSubmitted: boolean = false;

  constructor(
    private trainerService: TrainerService,
    private adminService: AdminService,
    private authService: AuthServiceService,
    private dashboardService: DashboardService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.productDetails();
      }
    });
    this.getPendingProducts();
    this.checkUserRole();
    this.loadProduct();
    this.dashboardService.getAllCategory().subscribe(data => {
      this.showCategoryData = data;
    });
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;
        if (userRole === 'USER') {
          this.trainerService.getProductDataById().subscribe(
            (result: any) => {
              this.showProductDataUser = result?.data;
            },
            (error) => {
              console.error("Error fetching product data", error);
            }
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  loadProduct() {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'INSTITUTE' || userRole === 'SELF_EXPERT' || userRole === 'TRAINER') {
          this.trainerService.getAllProductByTrainerId().subscribe(
            (data: any) => {
              this.showProductData = data?.productsWithFullImageUrl;
            },
            (error) => {
              console.error("Error fetching product data", error);
            }
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  getPendingProducts() {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'INSTITUTE') {
          this.trainerService.getAllProductRequest().subscribe(
            (response: any) => {
              this.showPendingProducts = response?.data;
            },
            (error) => {
              console.error("Error fetching pending products", error);
            }
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  productDetails() {
    if (this.id) {
      this.trainerService.viewRequestProductByID(this.id).subscribe(result => {
        this.Showproductdata = result;
      });
    }
  }

  openProductDetailsModal(userId: string): void {
    this.trainerService.viewRequestProductByID(userId).subscribe(result => {
      this.Showproductdata = result;
    });
  }

  handleProductApproval(productId: string, Status: string) {
    if (Status === 'rejected') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to reject this Product? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.trainerService.productRequestChangeStatus(productId, Status).subscribe(
            (response) => {
              this.getPendingProducts();
              Swal.fire('Request Rejected', 'The Trainer Product request Status has been successfully Rejected.', 'success');
            },
            (error) => {
              Swal.fire('Error', 'Failed to reject the request. Please try again later.', 'error');
            }
          );
        }
      });
    } else if (Status === 'approved') {
      this.trainerService.productRequestChangeStatus(productId, Status).subscribe(
        (response) => {
          this.getPendingProducts();
          Swal.fire('Request Approved', 'The Trainer Product Status has been successfully updated.', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Failed to approve the request. Please try again later.', 'error');
        }
      );
    }
  }

  onSubmit(productForm: any) {
    this.formSubmitted = true;
    if (productForm.invalid) {
      Swal.fire('Validation Error', 'Please ensure all required fields are filled out correctly before submitting.', 'warning');
      return;
    }

    const formData = new FormData();

    formData.append('product_name', this.product.product_name);
    formData.append('product_prize', this.product.product_prize.toString());
    formData.append('product_selling_prize', this.product.product_selling_prize.toString());
    formData.append('categoryid', this.product.categoryid);
    formData.append('sub_category', this.product.sub_category);
    formData.append('products_info', this.product.products_info);
    formData.append('products_description', this.product.products_description);
    formData.append('product_flag', this.product.product_flag);

    if (Array.isArray(this.product.tags)) {
      const tagsArray = this.product.tags.map((tag: any) => tag.name);
      formData.append('tags', tagsArray.join(', '));
    }

    if (this.product_image) {
      formData.append('product_image', this.product_image, this.product_image.name);
    }

    this.trainerService.addProduct(formData).subscribe(
      response => {
        Swal.fire('Success !', 'Product Added Successfully..!', 'success');
        this.loadProduct();
        bootstrap.Modal.getInstance(document.getElementById('AddProductModal'))?.hide();
      },
      error => {
        Swal.fire('Error', 'Please fill the details', 'error');
      }
    );
  }


  // async onFileSelected(event: any): Promise<void> {
  //   const file = event.target.files[0];

  //   if (!file) return;

  //   if (file.size > this.maxFileSizeMB * 1024 * 1024) {
  //     Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
  //     return;
  //   }

  //   if (!this.allowedFileTypes.includes(file.type)) {
  //     Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.', 'error');
  //     return;
  //   }

  //   try {
  //     const compressionOptions = {
  //       maxSizeMB: 5,
  //       maxWidthOrHeight: 1000,
  //       useWebWorker: true,
  //     };
  //     const compressedFile = await imageCompression(file, compressionOptions);

  //     // Convert to AVIF or WebP
  //     const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp'); // Change to 'image/avif' for AVIF format

  //     console.log('Original file size:', file.size / 1024 / 1024, 'MB');
  //     console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
  //     console.log('Converted file size:', convertedFile.size / 1024 / 1024, 'MB');

  //     this.product_image = convertedFile;

  //     // Preview the new image
  //     this.imageObjectURL = URL.createObjectURL(convertedFile);

  //   } catch (error) {
  //     console.error('Error during compression or conversion:', error);
  //     Swal.fire('Error', 'There was an error processing the image. Please try again.', 'error');
  //   }
  // }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];

    if (!file) return;

    const productName = this.product.product_name.trim().replace(/\s+/g, '_');
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

  onDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Product? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainerService.deleteProductById(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The product has been deleted successfully.', 'success');
            this.loadProduct();
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the course.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The product is safe :)', 'info');
      }
    });
  }

  trunproductName(name: string): string {
    return name.length > 18 ? name.slice(0, 3) + '...' : name;
  }

  trunproductName1(name: string): string {
    return name.length > 18 ? name.slice(0, 3) + '...' : name;
  }

  getsubcategory(): void {
    if (this.fetchcategoryID) {
      this.adminService.getSubCategoryByCategoryId(this.fetchcategoryID).subscribe(result => {
        this.subCategory = result?.data;
      });
    } else {
      this.subCategory = [];
    }
  }
}