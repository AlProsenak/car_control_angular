import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GetVehicles} from "../model/GetVehicles";
import {PostVehicle} from "../model/PostVehicle";
import {PutVehicle} from "../model/PutVehicle";
import {GetVehicle} from "../model/GetVehicle";

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    apiUrl = 'http://localhost:5000/api/v1/vehicle';

    // TODO: implement logic for pagination and variable page sizes
    hardCodedPageSize = 'page_size=16'

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<GetVehicles>(this.apiUrl + '?' + this.hardCodedPageSize)
    }

    get(vehicleId: number) {
        return this.http.get<GetVehicle>(this.apiUrl + '/' + vehicleId)
    }

    create(vehicle: PostVehicle) {
        return this.http.post(this.apiUrl, vehicle)
    }

    update(vehicle: PutVehicle) {
        return this.http.put(this.apiUrl, vehicle)
    }

    delete(vehicleId: number) {
        return this.http.delete(this.apiUrl + '/' + vehicleId)
    }
}
