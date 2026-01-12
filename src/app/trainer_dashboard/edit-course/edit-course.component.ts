import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
declare var bootstrap: any;
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  showCategorydatadefault: any
  showCategorydata: any[] = [];
  subCategoryList: any[] = [];
  _id: any;
  uploadForm!: FormGroup;
  thumbnail_image: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null;
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
  tags: string[] = [];
  tagsControl: FormControl = new FormControl('');
  subCategory: any = [];
  fetchCategoryId: string = '';
  maxPdfSizeMB = 5;
  trainingMaterialPdf: File | null = null;
  maxVideoSizeMB = 50;
  courseVideo: File | null = null;
  addOnBlur = true;
  courseTags: string[] = [];
  newFileName: string | null = null;
  isVideoPreviewOpen: boolean = false;
  courseVideoURL: string | null = null;

  constructor(
    private router: ActivatedRoute,
    private adminService: AdminService,
    private dashboard: DashboardService,
    private formBuilder: FormBuilder,
    private route: Router
  ) {
    this._id = this.router.snapshot.paramMap.get('_id');
  }

  ngOnInit() {

    this.dashboard.getAllCategory().subscribe(data => {
      console.log(data);
      this.showCategorydata = data;
    });
    this.uploadForm = this.formBuilder.group({
      _id: ['', Validators.required],
      course_name: ['', Validators.required],
      category_name: ['', Validators.required],
      sub_category_name: ['', Validators.required],
      online_offline: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      offer_prize: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      level: ['', Validators.required],
      course_information: ['', Validators.required],
      tags: '',
      thumbnail_image: '',
      gallary_image: '',
      trainer_materialImage: '',
      materials: '',
      course_video: ''
    }

    );
    this.tagsControl = new FormControl('');

    this.adminService.getCourseById(this._id).subscribe(d => {
      console.log("Course Data", d);
      const selectedCategory = this.showCategorydata.find(category => category.category_name === d.category_name);
      const categoryValue = selectedCategory ? selectedCategory._id : '';
      this.getCategories();
      this.onCategoryChange(categoryValue);

      this.uploadForm.patchValue({
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

    console.log(this.courseTags)
  }

  onUploadClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  editTag(index: number, event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.courseTags[index] = value;
      this.uploadForm.get('tags')?.setValue(this.courseTags);
    }
  }

  getCategories() {
    this.dashboard.getAllCategory().subscribe(data => {
      this.showCategorydata = data;
      this.uploadForm.patchValue({
        category_name: data[0]._id,
        sub_category_name: data[0].subcategories[0]._id
      });
    });
  }

  onCategoryChange(category: any): void {
    if (category && category !== '') {
      this.adminService.getSubCategoryByCategoryId(category).subscribe(
        (result: any) => {
          this.subCategoryList = result?.data || [];
          const selectedSubCategory = this.subCategoryList.find(
            subCategory => subCategory.sub_category_name === this.uploadForm.get('sub_category_name')?.value
          );
          if (selectedSubCategory) {
            this.uploadForm.get('sub_category_name')?.setValue(selectedSubCategory._id);
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

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;
    const courseName = this.uploadForm.get('course_name')?.value.trim().replace(/\s+/g, '_');
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

  onSubmit() {
    const formData = new FormData();
    formData.append('_id', this.uploadForm.get('_id')?.value);
    formData.append('course_name', this.uploadForm.get('course_name')?.value);
    formData.append('category_name', this.uploadForm.get('category_name')?.value);
    formData.append('sub_category_name', this.uploadForm.get('sub_category_name')?.value);
    formData.append('online_offline', this.uploadForm.get('online_offline')?.value);
    formData.append('price', this.uploadForm.get('price')?.value);
    formData.append('offer_prize', this.uploadForm.get('offer_prize')?.value);
    formData.append('start_date', this.uploadForm.get('start_date')?.value);
    formData.append('end_date', this.uploadForm.get('end_date')?.value);
    formData.append('start_time', this.uploadForm.get('start_time')?.value);
    formData.append('level', this.uploadForm.get('level')?.value);
    formData.append('tags', this.uploadForm.get('tags')?.value);
    formData.append('course_information', this.uploadForm.get('course_information')?.value);

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
        this.route.navigate(['dashboard/mycourse'])
      },
      error: error => {
        console.error('Update failed', error);
        Swal.fire('Error', 'Error updating course.', 'error');
      }
    });
  }

  getSubCategory(): void {
    if (this.fetchCategoryId) {
      this.adminService.getSubCategoryByCategoryId(this.fetchCategoryId).subscribe(result => {
        this.subCategory = result.data || [];
      });
    } else {
      this.subCategory = [];
    }
  }

  onUploadMaterials(pdfInput: HTMLInputElement): void {
    pdfInput.click();
  }

  onMaterialsSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) return;

    const courseName = this.uploadForm.get('course_name')?.value.trim().replace(/\s+/g, '_');
    if (!courseName) {
      Swal.fire('Error', 'Course name is missing. Please ensure the course name is provided.', 'error');
      return;
    }

    if (file.size > this.maxPdfSizeMB * 1024 * 1024) {
      Swal.fire('File Too Large', `The file is too large. Please upload a PDF smaller than ${this.maxPdfSizeMB} MB.`, 'error');
      return;
    }

    if (file.type !== 'application/pdf') {
      Swal.fire('Invalid Format', 'Only PDF files are allowed for training materials.', 'error');
      return;
    }

    const newFileName = `${courseName}_TrainingMaterial.pdf`;
    const renamedFile = new File([file], newFileName, {
      type: file.type,
      lastModified: Date.now(),
    });

    this.trainingMaterialPdf = renamedFile;
    console.log("pdf add",this.trainingMaterialPdf)
    Swal.fire('Success', 'PDF uploaded successfully!', 'success');
  }

  onUploadVideo(videoInput: HTMLInputElement): void {
    videoInput.click();
  }

  onVideoSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const courseName = this.uploadForm.get('course_name')?.value.trim().replace(/\s+/g, '_');
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

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.courseTags.includes(value)) {
      this.courseTags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(index: number): void {
    if (index >= 0) {
      this.courseTags.splice(index, 1);
      this.uploadForm.get('tags')?.setValue(this.courseTags);
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
  materialFileName: string | null = null;
}
