import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../model/Employee';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  baseUrl: string = 'http://localhost:8088/employee_service/';

  constructor(private httpClient: HttpClient) { }

  getEmployeeData(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'retrieve');
  }

  addEmployee(body: any): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'create', body);
  }

  updateEmployeeData(empId: number, body: any): Observable<any> {
    return this.httpClient.put(this.baseUrl + 'update/' + empId, body);
  }

  deleteEmployeeData(empId: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + 'delete/' + empId);
  }

  private employeeSource = new BehaviorSubject(new Employee());
  currentEmployee = this.employeeSource.asObservable();

  changeEmployee(employee: Employee) {
    this.employeeSource.next(employee);
  }
}
