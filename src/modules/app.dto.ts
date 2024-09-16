import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword, MaxLength, MinLength, ValidateNested, IsPositive } from "class-validator";
import { Type } from "class-transformer";

class ProductDto {
    @IsNotEmpty()
    @IsString()
    item: string;

    @IsNotEmpty()
    @IsString()
    description: string;
    
    @IsNumber()
    @IsPositive()
    unitCost: number;
    
    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    barcode: string;  // Assuming barcode validation as well
    
}

export class AppDto {
    
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];

    @IsNumber()
    @IsPositive()
    amountPaid: number;

    
    @IsNumber()
    @IsPositive()
    discount?: number;
}
