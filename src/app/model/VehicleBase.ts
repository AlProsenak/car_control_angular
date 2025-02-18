export interface VehicleBase {
    make: string;
    model: string;
    year: number;
    fuel_type: string;
    door_count: number;
    price: number;
    currency_code: string;
    description: string | null;
}
