import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpService} from "../../service/http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Employee} from "../../model/Employee";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})

export class AddEmployeeComponent {

  public employee: Employee = new Employee();
  public employeeFormGroup!: FormGroup;

  empId: number = this.activatedRoute.snapshot.params['empId'];
  color!: string;

  constructor(private formBuilder: FormBuilder,
              private _snackBar: MatSnackBar,
              private httpService: HttpService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

    this.employeeFormGroup = this.formBuilder.group({
      empName: new FormControl('', [Validators.required,
        Validators.pattern('^[A-Z][a-zA-z\\s]{2,}$'),Validators.minLength(4)]),
      empProfilePic: new FormControl('', Validators.required),
      empGender: new FormControl('', Validators.required),
      empDepartment: this.formBuilder.array([], Validators.required),
      empSalary: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required)
    })
  }

  // Create department array for the department values on check selection :-
  departmentArr: Array<any> = [
    {id: 1, name: 'HR', value: 'HR', checked: false},
    {id: 2, name: 'Sales', value: 'Sales', checked: false},
    {id: 3, name: 'Finance', value: 'Finance', checked: false},
    {id: 4, name: 'Engineer', value: 'Engineer', checked: false},
    {id: 5, name: 'Other', value: 'Other', checked: false},
  ];

  // For Department Mat Check Box changes :-
  onCheckboxChange(event: MatCheckboxChange) {
    const empDepartment: FormArray = this.employeeFormGroup.get(
      'empDepartment'
    ) as FormArray;
    if (event.checked) {
      empDepartment.push(new FormControl(event.source.value));
    } else {
      const index = empDepartment.controls.findIndex(
        (x) => x.value === event.source.value
      );
      empDepartment.removeAt(index);
    }
  }

  // Mat Slider For Salary :-
  formatLabel(value: number): string {
    if (value >= 1000) {
      if (value >= 100000) {
        this.color = 'primary';
      } else {
        this.color = 'warn';
      }
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  // By Default ngOnInit method is running :-
  ngOnInit(): void {
    // Getting all the data of employee for update :-
    if (this.empId != undefined) {
      console.log(this.empId);
      this.httpService.currentEmployee.subscribe(employee => {
          console.log(employee);
          this.employeeFormGroup.get('empName')?.setValue(employee.empName);
          this.employeeFormGroup.get('empProfilePic')?.setValue(employee.empProfilePic);
          this.employeeFormGroup.get('empGender')?.setValue(employee.empGender);
          this.employeeFormGroup.get('empSalary')?.setValue(employee.empSalary);
          // Sometimes We Get Date In Timestamp Millisecond
          // Timestamp In Millisecond(1679900816390) To Convert ISO(2023-03-27T08:32:33.836Z)
          // this.employeeFormGroup.get('startDate')?.setValue(new Date(employee.startDate).toISOString());
          this.employeeFormGroup.get('startDate')?.setValue(employee.startDate);
          this.employeeFormGroup.get('note')?.setValue(employee.note);
          const department: FormArray = this.employeeFormGroup.get('empDepartment') as FormArray;
          employee.empDepartment.forEach(departmentData => {
            for (let index = 0; index < this.departmentArr.length; index++) {
              if (this.departmentArr[index].name === departmentData) {
                this.departmentArr[index].checked = true;
                department.push(new FormControl(this.departmentArr[index].value))
              }
            }
          });
      });
    }
  }

  onSubmit() {
    if (this.employeeFormGroup.valid) {
      // updating employee data by calling http method :-
      this.employee = this.employeeFormGroup.value;
      if (this.empId != undefined) {
        this.httpService.updateEmployeeData(this.empId, this.employee).subscribe(res => {
          console.log(res);
          this._snackBar.open(res.message, 'OK', {
            duration:5000,
          });
          this.router.navigateByUrl("/home");
        });
      } else {
        // adding employee data by calling http method :-
        this.employee = this.employeeFormGroup.value;
        this.httpService.addEmployee(this.employee).subscribe(res => {
          console.log(res);
          this._snackBar.open(res.message, 'OK', {
            duration:5000
          });
          this.router.navigateByUrl("/home");
        });
      }
    }
  }
}
