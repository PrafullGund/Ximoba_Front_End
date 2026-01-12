import { Component } from '@angular/core';
import { SpinnerServiceService } from '../spinner-service.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  isLoading = false;

  constructor(private loadingService: SpinnerServiceService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((state) => {
      this.isLoading = state;
    });
  }

}
