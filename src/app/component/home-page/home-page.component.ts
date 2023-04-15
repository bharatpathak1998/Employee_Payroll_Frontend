import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Employee} from 'src/app/model/Employee';
import {HttpService} from 'src/app/service/http.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {

  public employeeCount: number = 0;
  public employeeDetails: Employee[] = [];
  searchText: any;

  constructor(private httpService: HttpService,
              private router: Router,
              private _snackBar: MatSnackBar) {}

  // By Default ngOnInit method is running and get all employee Data :-
  ngOnInit(): void {
    this.httpService.getEmployeeData().subscribe(response => {
      console.log(response);
      this.employeeDetails = response;
      this.employeeCount = this.employeeDetails.length;
    });
  }

  // Delete employee data from the database :-
  remove(empId: number): void {
    console.log(empId);
    this.httpService.deleteEmployeeData(empId).subscribe(response => {
      console.log(response);
      this._snackBar.open(response.message, 'OK', {
        duration:5000
      });
      this.ngOnInit();
    });
  }

  // Change employee data for update :-
  update(employee: Employee): void {
    this.httpService.changeEmployee(employee);
    this.router.navigateByUrl('/add/' + employee.empId);
  }
}
