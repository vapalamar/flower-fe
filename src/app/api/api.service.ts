import { Injectable } from "@angular/core";
import { of } from "rxjs/observable/of";

@Injectable()
export class ApiService {
  user = {
    checkEmail: (email: any) => of(null)
  }
}