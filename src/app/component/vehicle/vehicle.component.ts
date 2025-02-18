import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {AddvehicleComponent} from '../addvehicle/addvehicle.component';
import {Vehicle} from '../../model/Vehicle';
import {VehicleService} from '../../service/vehicle.service';
import {Subscription} from 'rxjs';
import {CommonModule} from "@angular/common";
import {Pageable} from "../../model/Pageable";

@Component({
    selector: 'app-vehicle',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        CommonModule,
    ],
    templateUrl: './vehicle.component.html',
    styleUrl: './vehicle.component.css'
})
export class VehicleComponent implements OnInit, OnDestroy {

    vehicleList: Vehicle[] = [];
    pageable: Pageable | undefined;

    dataSource!: MatTableDataSource<Vehicle>;
    displayedColumns: string[] = ['make', 'model', 'year', 'fuel_type', 'door_count', 'price', 'currency_code', 'description', 'action'];
    subscription = new Subscription()

    constructor(private service: VehicleService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getAllVehicles();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getAllVehicles(): void {
        let sub = this.service.getAll().subscribe(it => {
            this.vehicleList = it.vehicles;
            this.pageable = it.pageable;
            this.dataSource = new MatTableDataSource<Vehicle>(this.vehicleList)
        })
        this.subscription.add(sub);
    }


    addVehicle() {
        this.openPopup(-1);
    }

    updateVehicle(vehicle: Vehicle) {
        this.dialog.open(AddvehicleComponent, {
            width: '50%',
            exitAnimationDuration: '250ms',
            enterAnimationDuration: '250ms',
            data: {
                'code': vehicle.id,
                'vehicle': vehicle,
            }
        }).afterClosed().subscribe(it => {
            // Refresh table data after new entry is created
            this.getAllVehicles();
        })
    }

    deleteVehicle(vehicleId: number) {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            let sub = this.service.delete(vehicleId).subscribe(it => {
                this.getAllVehicles();
            })
            this.subscription.add(sub);
        }
    }

    openPopup(vehicleId: number) {
        this.dialog.open(AddvehicleComponent, {
            width: '50%',
            exitAnimationDuration: '250ms',
            enterAnimationDuration: '250ms',
            data: {
                'code': vehicleId,
            }
        }).afterClosed().subscribe(it => {
            // Refresh table data after new entry is created
            this.getAllVehicles();
        })
    }

}
