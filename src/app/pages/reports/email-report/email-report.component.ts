import { Component, inject, OnInit } from '@angular/core';
import { ROLES } from '../../../shared/Types/types';
import { Router } from '@angular/router';

@Component({
  selector: 'crh-email-report',
  standalone: false,
  templateUrl: './email-report.component.html',
  styleUrl: './email-report.component.scss'
})
export class EmailReportComponent implements OnInit {
    protected userRole:ROLES = ROLES.user;
    Roles = ROLES;
    private response = '';
    private router = inject(Router);
    private reportId = -1;

    ngOnInit(): void {
      const state = history.state;
      // console.log("the state is: ",state)
      this.userRole = state.role;
      // console.log(typeof(this.userRole))
      this.reportId = state.reportId;
    }
    
    //  This function catches the radio changes in the html
    onRadioChange(event: any):void {
      // console.log("the radio response is: ");
      // console.log(event.value);
      if (event.value == "y" || event.value == "n")
      {
        this.response = event.value
      }
    }

    protected onConfirmSendEmail():void {
      console.log("confirming whether to send the email")
      if (this.response == 'y')
      {
        // send here the email of the report id to everybody
        // console.log("the report id is: ",this.reportId)
      }

      else if (this.response == 'n')
      {
        // navigate to the all reports page
        this.router.navigate(['/reports'])
      }
    }

}
