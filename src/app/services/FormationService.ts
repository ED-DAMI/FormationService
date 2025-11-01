import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Formation} from '../interfaces/formation';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class FormationService {

  private url = "http://192.168.0.121:8080/api/formations";

  constructor(private http: HttpClient) {
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.url}/${id}`);
  }
  createFormation(formation:Formation): Observable<Formation> {
    return this.http.post<Formation>(`${this.url}`,formation);
  }
}
