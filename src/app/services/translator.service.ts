import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { TranslateModel } from '../core/model/translate.model';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  constructor(
    private http: HttpClient
  ) { }

  translate(text: string): Observable<TranslateModel> {
    const url = `${environment.api}translator`;
    return this.http.post<TranslateModel>(url, {
      Text: text,
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'es'
    });
  }
}
