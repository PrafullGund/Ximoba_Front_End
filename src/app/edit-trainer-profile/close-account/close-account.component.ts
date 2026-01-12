import { Component,ViewChild ,TemplateRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-close-account',
  templateUrl: './close-account.component.html',
  styleUrls: ['./close-account.component.css']
})
export class CloseAccountComponent {

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  verificationCode: number | null = null;

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(this.dialogTemplate);
  }

  closeAccount() {
    if (this.verificationCode) {
      console.log(`Account closure confirmed with code: ${this.verificationCode}`);
      
    } else {
      alert('Please enter a valid 6-digit code.');
    }
  }
}
