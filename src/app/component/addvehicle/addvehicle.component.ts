import {Component, Inject, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {provideNativeDateAdapter} from '@angular/material/core';
import {Vehicle} from '../../model/Vehicle';
import {VehicleService} from '../../service/vehicle.service';
import {PostVehicle} from "../../model/PostVehicle";
import {ToastrService} from "ngx-toastr";
import {PutVehicle} from "../../model/PutVehicle";

@Component({
    selector: 'app-addvehicle',
    imports: [
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        ReactiveFormsModule,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './addvehicle.component.html',
    styleUrl: './addvehicle.component.css'
})
export class AddvehicleComponent implements OnInit {

    title = 'Add Vehicle';
    dialodata: any;
    isEdit: boolean = false;

    constructor(private service: VehicleService, private ref: MatDialogRef<AddvehicleComponent>,
                private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.dialodata = this.data;
        // If ID is more than 0, then we handle it as edit
        // TODO: fix the logic with better design
        if (this.dialodata.code > 0) {
            this.title = 'Edit Vehicle';
            this.isEdit = true;

            this.service.get(this.dialodata.code).subscribe(it => {
                let _vehicle = it.vehicle;
                if (_vehicle != null) {
                    this.vehicleForm.setValue({
                        id: _vehicle.id,
                        make: _vehicle.make,
                        model: _vehicle.model,
                        year: _vehicle.year,
                        fuel_type: _vehicle.fuel_type,
                        door_count: _vehicle.door_count,
                        price: _vehicle.price,
                        currency_code: _vehicle.currency_code,
                        description: _vehicle.description,
                    })
                }
            })

        }
    }

    vehicleForm = new FormGroup({
        id: new FormControl(-1),
        make: new FormControl('', Validators.required),
        model: new FormControl('', Validators.required),
        year: new FormControl(0, Validators.required),
        fuel_type: new FormControl('', Validators.required),
        door_count: new FormControl(0, Validators.required),
        price: new FormControl(0, Validators.required),
        currency_code: new FormControl('', Validators.required),
        description: new FormControl(''),
    })

    saveVehicle() {
        if (this.vehicleForm.valid) {
            let optionalDescription = this.vehicleForm.value.description as string | null;
            // Force description field to be null, if empty or blank
            if (optionalDescription != null && optionalDescription.trim() === '') {
                optionalDescription = null
            }
            // TODO: workaround - build a better solution
            // @ts-ignore
            let _vehicle: Vehicle = {
                id: this.vehicleForm.value.id as number,
                make: this.vehicleForm.value.make as string,
                model: this.vehicleForm.value.model as string,
                year: this.vehicleForm.value.year as number,
                fuel_type: this.vehicleForm.value.fuel_type as string,
                door_count: this.vehicleForm.value.door_count as number,
                price: this.vehicleForm.value.price as number,
                currency_code: this.vehicleForm.value.currency_code as string,
                // description: optionalDescription,
            }
            if (optionalDescription != null) {
                _vehicle.description = optionalDescription;
            }

            if (this.isEdit) {
                let _updatedVehicle: PutVehicle = {
                    vehicle: _vehicle,
                }
                this.service.update(_updatedVehicle).subscribe(it => {
                    this.toastr.success('Vehicle updated successfully', 'Updated');
                    this.closePopup()
                })
            } else {
                // POST API does not require ID
                // @ts-ignore
                _vehicle.id = null;
                let _createdVehicle: PostVehicle = {
                    vehicle: _vehicle,
                }
                this.service.create(_createdVehicle).subscribe(it => {
                    this.toastr.success('Vehicle saved successfully', 'Created');
                    this.closePopup()
                })
            }
        }
    }

    closePopup() {
        this.ref.close();
    }

}
