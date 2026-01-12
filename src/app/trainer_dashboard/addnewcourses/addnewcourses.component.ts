import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { offerPriceValidator } from 'src/app/offer-price.validator';
import { CanComponentDeactivate } from '../../add-new-course-can-deactivate-interface';
declare var bootstrap: any;

@Component({
  selector: 'app-addnewcourses',
  templateUrl: './addnewcourses.component.html',
  styleUrls: ['./addnewcourses.component.css']
})

export class AddnewcoursesComponent implements CanComponentDeactivate{
  courseForm!: FormGroup;
  tagsControl: FormControl = new FormControl('');
  filteredCategory: any[] = [];
  subCategory: any;
  categoryID: any | null = null;
  subCategoryList: any[] = [];
  selectedFile: File | null = null;
  imageObjectURL: string = '';
  thumbnail_image: File | undefined;
  materials: File | undefined;
  maxFileSizeMB: number = 5;
  maxPdfSizeMB = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg'];
  thumbnailSizeError: boolean = false;
  trainingMaterialPdf: File | null = null;
  courseVideo: File | null = null;
  courseVideoURL: string | null = null;
  isVideoPreviewOpen: boolean = false;
  maxVideoSizeMB = 50;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('_id');
    if (this._id) {
      this.isEditMode = true
      this.getCourse();
    }
    
    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      category_name: ['', Validators.required],
      sub_category_name: ['', Validators.required],
      online_offline: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      offer_prize: [''],
      start_date: ['',],
      end_date: ['',],
      level: ['',],
      course_information: ['', Validators.required],
      tags: '',
      thumbnail_image: '',
      gallary_image: '',
      trainer_materialImage: '',
      materials: '',
      course_video: ''
    }, {
      validators: [
        this.endDateAfterStartDateValidator(),
        offerPriceValidator()
      ]
    });

    this.tagsControl = new FormControl('');
    this.categoryID = this.route.snapshot.paramMap.get('id');
    this.getCategories();
    this.loadCategories();

  }

  getCategories() {
    this.dashboardService.getAllCategory().subscribe((data: any) => {
      this.filteredCategory = data;
      this.showCategorydata = data;
      this.courseForm.patchValue({
        category_name: data[0]?._id,
        sub_category_name: data[0]?.subcategories[0]?._id
      });
    });
  }

  // addTag(event: any): void {
  //   const input = event.input;
  //   const value = event.value.trim();
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  onSubmit(): void {

     this.isFormSubmitted = true;

    if (this.courseForm.invalid) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }
    const formData = new FormData();
    Object.keys(this.courseForm.controls).forEach((key) => {
      const controlValue = this.courseForm.get(key)?.value;
      if (key === 'tags' && Array.isArray(controlValue)) {
        const formattedTags = controlValue.map(tag => typeof tag === 'object' ? (tag.name || tag.toString()) : tag);
        formData.append('tags', formattedTags.join(','));
      } else {
        formData.append(key, controlValue);
      }
    });

    if (this.thumbnail_image) {
      formData.append('thumbnail_image', this.thumbnail_image);
    }

    if (this.trainingMaterialPdf) {
      formData.append('materials', this.trainingMaterialPdf);
    }

    if (this.courseVideo) {
      formData.append('course_video', this.courseVideo);
    }
    this._id = this.route.snapshot.paramMap.get('_id');
    console.log(this._id);
    if (this._id) {
     
      this.updateCourse()

     }
    else {
      this.adminService.postCourse(formData).subscribe({
        next: (response) => {
          Swal.fire('Success!', 'Course Added Successfully!', 'success');

          this.courseForm.reset();
          this.courseForm.setValue({
            course_name: '',
            category_name: '',
            sub_category_name: '',
            online_offline: '',
            offer_prize: '',
            course_information: '',
            endDate: new Date(),
            startDate: new Date(),
            level: '',
            price: 0,
            trainer_materialImage: '',
            gallary_image: '',
            thumbnail_image: '',
            materials: '',
            course_video: '',
            tags: ''
          });
        },
        error: (error) => {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      });
      this.resetForm();
      this.courseTags = [];
      this.trainingMaterialPdf = null;
      this.materialFileName = '';
      this.courseVideo = null;
     
      const fieldsToClear = [
        'course_name',
        'category_name',
        'sub_category_name',
        'online_offline',
        'price',
        'course_information'
      ];
      
      fieldsToClear.forEach(field => {
        const control = this.courseForm.get(field);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
      
    }
  }

  loadCategories(): void {
    this.dashboardService.getAllCategory().subscribe((data: any) => {
      this.filteredCategory = data;
    });
  }

  onCategoryChange(category: any): void {
    if (category && category !== '') {
      this.adminService.getSubCategoryByCategoryId(category).subscribe(
        (result: any) => {
          this.subCategoryList = result?.data || [];
          const selectedSubCategory = this.subCategoryList.find(
            subCategory => subCategory.sub_category_name === this.courseForm.get('sub_category_name')?.value
          );
          if (selectedSubCategory) {
            this.courseForm.get('sub_category_name')?.setValue(selectedSubCategory._id);
          }
        },
        (error: any) => {
          console.error('Error fetching subcategories:', error);
          this.subCategoryList = [];
        }
      );
    } else {
      this.subCategoryList = [];
    }
  }

  resetForm(): void {
    this.courseForm.reset({
      course_name: '',
      category_name: '',
      sub_category_name: '',
      online_offline: '',
      price: 0,
      offer_prize: '',
      start_date: new Date(),
      end_date: new Date(),
      level: '',
      course_information: '',
      tags: '',
      thumbnail_image: '',
      gallary_image: '',
      trainer_materialImage: '',
      materials: '',
      course_video: ''
    });

    this.tagsControl.setValue('');
    this.imageObjectURL = '';
    this.thumbnail_image = undefined;
  }

  onUploadClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];

    if (!file) return;

    const courseName = this.courseForm.get('course_name')?.value.trim().replace(/\s+/g, '_');
    if (!courseName) {
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
      this.newFileName = `${courseName}.${fileExtension}`;
      const renamedFile = new File([convertedFile], this.newFileName, {
        type: convertedFile.type,
        lastModified: Date.now(),
      });

      this.thumbnail_image = renamedFile;
      this.imageObjectURL = URL.createObjectURL(renamedFile);

      Swal.fire('Success', 'Image uploaded successfully!', 'success');


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
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas rendering context not available.'));
            return;
          }

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

  onUploadMaterials(pdfInput: HTMLInputElement): void {
    pdfInput.click();
  }

  async onMaterialsSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file');
      return;
    }

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: true });
      const newPdfDoc = await PDFDocument.create();
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => newPdfDoc.addPage(page));

      const compressedPdfBytes = await newPdfDoc.save();
      const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });

      const courseName = this.courseForm.get('course_name')?.value.trim().replace(/\s+/g, '_');
      if (!courseName) {
        Swal.fire('Error', 'Course name is missing. Please ensure the course name is provided.', 'error');
        return;
      }
      const compressedFile = new File([compressedBlob], `${courseName}.pdf`, { type: 'application/pdf' });
      this.trainingMaterialPdf = compressedFile;
      this.materialFileName = compressedFile.name;
      this.pdfPreviewURL = URL.createObjectURL(compressedFile);
      Swal.fire('Success', 'PDF uploaded successfully!', 'success');
    } catch (error) {
      console.error('PDF processing error:', error);
      Swal.fire('Error', 'Failed to process PDF file.', 'error');
    }
  }

  onUploadVideo(videoInput: HTMLInputElement): void {
    videoInput.click();
  }

  onVideoSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const courseName = this.courseForm.get('course_name')?.value.trim().replace(/\s+/g, '_');
    if (!courseName) {
      Swal.fire('Error', 'Course name is missing. Please ensure the course name is provided.', 'error');
      return;
    }

    if (file.size > this.maxVideoSizeMB * 1024 * 1024) {
      Swal.fire('File Too Large', `The file is too large. Please upload a video smaller than ${this.maxVideoSizeMB} MB.`, 'error');
      return;
    }

    if (!file.type.startsWith('video/')) {
      Swal.fire('Invalid Format', 'Only video files are allowed.', 'error');
      return;
    }

    const newFileName = `${courseName}_CourseVideo.mp4`;
    const renamedFile = new File([file], newFileName, {
      type: file.type,
      lastModified: Date.now(),
    });

    this.courseVideo = renamedFile;
    this.courseVideoURL = URL.createObjectURL(renamedFile);
    Swal.fire('Success', 'Video uploaded successfully!', 'success');
  }


  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  blockInvalidPaste(event: ClipboardEvent) {
    const pastedInput = event.clipboardData?.getData('text') || '';
    if (!/^[1-9][0-9]*$/.test(pastedInput)) {
      event.preventDefault();
    }
  }
  minStartDate: Date = new Date();
  minDate: Date = new Date();

  endDateAfterStartDateValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('start_date')?.value;
      const end = group.get('end_date')?.value;

      if (start && end && new Date(end) < new Date(start)) {
        group.get('end_date')?.setErrors({ endBeforeStart: true });
        return { endBeforeStart: true };
      }

      if (group.get('end_date')?.hasError('endBeforeStart')) {
        group.get('end_date')?.setErrors(null);
      }

      return null;
    };
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;

  courseTags: string[] = [];
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.courseTags.includes(value)) {
      this.courseTags.push(value);
      this.courseForm.get('tags')?.setValue(this.courseTags);
    }
    event.chipInput!.clear();
  }

  removeTag(index: number): void {
    if (index >= 0) {
      this.courseTags.splice(index, 1);
      this.courseForm.get('tags')?.setValue(this.courseTags);
    }
  }

  editTag(index: number, event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.courseTags[index] = value;
      this.courseForm.get('tags')?.setValue(this.courseTags);
    }
  }

  materialFileName: string | null = null;
  newFileName: string | null = null;

  ngOnDestroy() {
    if (this.imageObjectURL) {
      URL.revokeObjectURL(this.imageObjectURL);
    }
  }

  openPreviewModal(): void {
    const modalElement = document.getElementById('imagePreviewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  pdfPreviewURL: string | null = null;
  openPdfPreview(): void {
    if (!this.pdfPreviewURL) return;

    const modalEl = document.getElementById('pdfPreviewModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  _id: any = '';
  showCategorydata: any[] = [];

  getCourse() {
    this._id = this.route.snapshot.paramMap.get('_id');
    this.adminService.getCourseById(this._id).subscribe(d => {
      console.log("Course Data", d);
      const selectedCategory = this.showCategorydata.find(category => category.category_name === d.category_name);
      const categoryValue = selectedCategory ? selectedCategory._id : '';
      this.getCategories();
      this.onCategoryChange(categoryValue);

      this.courseForm.patchValue({
        _id: d._id,
        course_name: d.course_name,
        category_name: categoryValue,
        sub_category_name: d.sub_category_name,
        online_offline: d.online_offline,
        price: d.price,
        offer_prize: d.offer_prize,
        start_date: d.start_date,
        end_date: d.end_date,
        level: d.level,
        course_information: d.course_information,
        tags: (d.tags || "").split(',')
          .map((tag: any) => tag.trim())
          .filter((tag: any) => tag.length > 0),
        thumbnail_image: d.thumbnail_image,
        materials: d.materials,
        course_video: d.course_video,
        trainer_materialImage: '',
      });
      const category_name = new FormControl(d.category_name);
      this.tagsControl = new FormControl(d.tags);
      this.courseTags = (d.tags || "").split(',').map((tag: any) => tag.trim())
        .filter((tag: any) => tag.length > 0);
      this.imageObjectURL = (d.thumbnail_image)
    });
  }

 updateCourse() {
    const formData = new FormData();
    formData.append('_id', this.courseForm.get('_id')?.value);
    formData.append('course_name', this.courseForm.get('course_name')?.value);
    formData.append('category_name', this.courseForm.get('category_name')?.value);
    formData.append('sub_category_name', this.courseForm.get('sub_category_name')?.value);
    formData.append('online_offline', this.courseForm.get('online_offline')?.value);
    formData.append('price', this.courseForm.get('price')?.value);
    formData.append('offer_prize', this.courseForm.get('offer_prize')?.value);
    formData.append('start_date', this.courseForm.get('start_date')?.value);
    formData.append('end_date', this.courseForm.get('end_date')?.value);
    formData.append('start_time', this.courseForm.get('start_time')?.value);
    formData.append('level', this.courseForm.get('level')?.value);
    formData.append('tags', this.courseForm.get('tags')?.value);
    formData.append('course_information', this.courseForm.get('course_information')?.value);

    if (this.thumbnail_image) {
      formData.append('thumbnail_image', this.thumbnail_image);
    }

    if (this.trainingMaterialPdf) {
      formData.append('materials', this.trainingMaterialPdf);
    }

    if (this.courseVideo) {
      formData.append('course_video', this.courseVideo);
    }

    this.adminService.updateCourse(this._id, formData).subscribe({
      next: response => {
        Swal.fire('Success', 'Course updated successfully!', 'success');
        this.router.navigate(['dashboard/mycourse'])
      },
      error: error => {
        console.error('Update failed', error);
        Swal.fire('Error', 'Error updating course.', 'error');
      }
    });
  }
  
  isFormSubmitted = false;
    canDeactivate(): Promise<boolean> {
    if (this.courseForm.dirty && !this.isFormSubmitted) {
      return Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'Stay',
      }).then(result => result.isConfirmed);
    }
    return Promise.resolve(true);
  }

}