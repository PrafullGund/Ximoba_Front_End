import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexAxisChartSeries, ApexXAxis, ApexDataLabels, ApexTooltip, ApexStroke, ChartComponent } from "ng-apexcharts";
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import Swal from 'sweetalert2';
import { ChartComponent } from 'ng-apexcharts';

export type DonutChartOptions = {
  // series: ApexNonAxisChartSeries;
  // chart: ApexChart;
  // responsive: ApexResponsive[];
  // labels: any;
};

export type AreaChartOptions = {
  // series: ApexAxisChartSeries;
  // chart: ApexChart;
  // xaxis: ApexXAxis;
  // stroke: ApexStroke;
  // tooltip: ApexTooltip;
  // dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-trainer-myhome',
  templateUrl: './trainer-myhome.component.html',
  styleUrls: ['./trainer-myhome.component.css']
})
export class TrainerMyhomeComponent implements OnInit {

  dashboardData: any = {
    totalCourses: '',
    ongoingCourses:'',
    completedCourses: 9,
    issuedCertificates: 127
  };

  chatOpen = false;

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  isTrainer: boolean = false;
  isUser: boolean = false;
  isAdmin: boolean = false;
  isInstitute: boolean = false;
  isSELF_EXPERT: boolean = false

  showDashboardata: any;

  @ViewChild("donutChart") donutChart!: ChartComponent;
  @ViewChild("areaChart") areaChart!: ChartComponent;

  public chartOptions: Partial<DonutChartOptions>;
  public areaChartOptions: Partial<AreaChartOptions>;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthServiceService,

  ) {
    this.chartOptions = {
      series: [0, 0, 0],  // Placeholder values
      chart: {
        type: "donut"
      },
      labels: ["Course", "Events", "Products", "Trainer"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.areaChartOptions = {
      series: [
        {
          name: "Series 1 ",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "Series 2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 300,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

  ngOnInit(): void {

    this.checkUserRole();

    if (this.isAdmin) {
      this.AdminCount();
    } else {
      this.loadCount();
    }
  }

  loadCount() {
    this.dashboardService.getDashboardData().subscribe(result => {
      console.log(result);
      this.showDashboardata = result.data;
      // if (this.showDashboardata) {
      //   this.chartOptions.series = [
      //     this.showDashboardata.totalCourses || 0,
      //     this.showDashboardata.totalEvents || 0,
      //     this.showDashboardata.totalProducts || 0
      //   ];
      // }
    });
  }

  AdminCount() {
    // this.dashboardService.getDashboardDataAdmin().subscribe(response => {
    //   this.showDashboardata = response.data;
    //   if (this.showDashboardata) {
    //     this.chartOptions.series = [
    //       this.showDashboardata.totalCourses || 0,
    //       this.showDashboardata.totalEvents || 0,
    //       this.showDashboardata.totalProducts || 0,
    //       this.showDashboardata.trainerCount || 0
    //     ];
    //   }
    // })
  }

  checkUserRole() {
    const role = this.authService.getUserRole();
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isTrainer = role === 'TRAINER';
    this.isInstitute = role === 'INSTITUTE';
    this.isSELF_EXPERT = role == 'SELF_EXPERT';
    this.isUser = role === 'USER';
  }

  studenttoExpert(): void {
    Swal.fire({
      text: 'Are you Insterested become an Instructor? send a request!',
      confirmButtonText: 'Send Now',
      customClass: {
        confirmButton: 'custom-send-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire('send!', 'The request has been sended successfully.', 'success');
      }
    });
  }
}
