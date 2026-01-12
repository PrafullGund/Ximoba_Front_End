import { Component, OnInit } from '@angular/core';
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
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  showEventData: any;
  showCategoryData: any;
  selectedFile: File | null = null;
  showEventDataStudent: any[] = [];
  showPendingEvents: any;
  ShowEvent: any;
  id: any;
  event_thumbnail: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null;
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
  minDate: string = '';
  showIcon = false;
  formSubmitted: boolean = false;

  toggleIcon() {
    this.showIcon = !this.showIcon;
  }

  isUser: boolean = true;
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isInstitute: boolean = false;
  isAdmin: boolean = false;

  checkUserRole() {
    const role = this.auth.getUserRole();
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER';
  }

  event = {
    event_name: '',
    event_type: '',
    event_category: '',
    sub_category: '',
    event_info: '',
    event_description: '',
    event_date: '',
    event_start_time: '',
    event_end_time: '',
    event_location: '',
    event_languages: '',
    estimated_seats: '',
    event_thumbnail: null,
  };

  constructor(
    private trainerService: TrainerService,
    private adminService: AdminService,
    private dashboardService: DashboardService,
    private auth: AuthServiceService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.EventsDetails();
      }
    });

    this.getPendingEvents();
    this.checkUserRole();
    this.LoadMyEvent();
    this.dashboardService.getAllCategory().subscribe(data => {
      this.showCategoryData = data;
    });
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const token = sessionStorage.getItem('Authorization');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;
        if (userRole === 'USER') {
          this.trainerService.getRegisteredEvents().subscribe(
            (result: any) => {
              this.showEventDataStudent = result.data;
            },
            (error) => {
              console.error('Error fetching event data:', error);
            }
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  LoadMyEvent() {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'TRAINER' || userRole === 'SELF_EXPERT' || userRole === 'INSTITUTE') {
          this.trainerService.getEventByTrainerId().subscribe(
            (data: any) => {
              this.showEventData = data?.eventsWithThumbnailUrl;
            },
            (error) => {
              console.error("Error fetching event data", error);
            }
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  getPendingEvents() {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'INSTITUTE') {
          this.trainerService.getAllEventsRequest().subscribe(
            (response: any) => {
              this.showPendingEvents = response?.data;
            },
            (error) => {
              console.error("Error fetching pending events", error);
            }
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  EventsDetails() {
    if (this.id) {
      this.trainerService.viewRequestEventsById(this.id).subscribe(result => {
        this.ShowEvent = result;
      });
    }
  }

  openEventsDetailsModal(eventId: string): void {
    this.trainerService.viewRequestEventsById(eventId).subscribe(result => {
      this.ShowEvent = result;
    });
  }

  handleEventsApproval(Eventid: string, Status: string) {
    if (Status === 'rejected') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to reject this Event? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.trainerService.eventsRequestChangeStatus(Eventid, Status).subscribe(
            (response) => {
              this.getPendingEvents();
              Swal.fire('Request Rejected', 'The Trainer Course request Status has been successfully Rejected.', 'success');
            },
            (error) => {
              Swal.fire('Error', 'Failed to reject the request. Please try again later.', 'error');
            }
          );
        }
      });
    } else if (Status === 'approved') {
      this.trainerService.eventsRequestChangeStatus(Eventid, Status).subscribe(
        (response) => {
          this.getPendingEvents();
          Swal.fire('Request Approved', 'The Trainer Course Status has been successfully updated.', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Failed to approve the request. Please try again later.', 'error');
        }
      );
    }
  }

  onSubmit(eventForm: any) {
    this.formSubmitted = true;
    if (eventForm.invalid) {
      Swal.fire('Validation Error', 'Please ensure all required fields are filled out correctly before submitting.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('event_name', this.event.event_name.trim());
    formData.append('event_type', this.event.event_type.trim());
    formData.append('event_category', this.event.event_category.trim());
    formData.append('sub_category', this.event.sub_category.trim());
    formData.append('event_info', this.event.event_info.trim());
    formData.append('event_description', this.event.event_description.trim());
    formData.append('event_date', this.event.event_date.trim());
    formData.append('event_start_time', this.event.event_start_time.trim());
    formData.append('event_end_time', this.event.event_end_time.trim());
    formData.append('event_location', this.event.event_location.trim());
    formData.append('event_languages', this.event.event_languages.trim());
    formData.append('estimated_seats', this.event.estimated_seats.trim());

    if (this.event_thumbnail) {
      formData.append('event_thumbnail', this.event_thumbnail, this.event_thumbnail.name);
    }

    this.trainerService.addEvent(formData).subscribe({
      next: (response) => {
        Swal.fire('Success!', 'Event Added Successfully..!', 'success');
        this.LoadMyEvent();
        bootstrap.Modal.getInstance(document.getElementById('AddEventModal'))?.hide();
      },
      error: (error) => {
        console.error("Error:", error);
        Swal.fire('Error', `Please fill the details. ${error.message}`, 'error');
      }
    });
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;
    const eventName = this.event.event_name.trim().replace(/\s+/g, '_');
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

  onDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Event? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainerService.deleteEvent(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The event has been deleted successfully.', 'success');
            this.LoadMyEvent();
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the course.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The event is safe :)', 'info');
      }
    });
  }

  showEventName = false;
  turnEventName(name: string): string {
    return name.length > 14 ? name.slice(0, 12) + '...' : name;
  }
  showEventName1 = false;
  turnEventName1(name: string): string {
    return name.length > 14 ? name.slice(0, 12) + '...' : name;
  }

  subCategory: any = [];
  fetchCategoryId: string = '';

  getSubCategory(): void {
    if (this.fetchCategoryId) {
      this.adminService.getSubCategoryByCategoryId(this.fetchCategoryId).subscribe(result => {
        this.subCategory = result.data || [];
      });
    } else {
      this.subCategory = [];
    }
  }
}
