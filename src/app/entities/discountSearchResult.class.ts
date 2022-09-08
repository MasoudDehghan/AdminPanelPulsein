import { DiscountV } from './../pEntites/discountV.class';
import { DiscountSearch } from 'app/pEntites/discountSearch.class';

export class DiscountFilterSearchResult {
        discountSearch: DiscountSearch;
        discounts: DiscountV[];
        totalSize:number = 0;
        selectedType: number = 0;
        selectedCode: string = null;
        selectedActive: boolean = undefined;
        selectedMultyUse: boolean = undefined;
        selectedEndTimeStart : string = null;
        selectedEndTimeEnd : string = null;
        selectedPercentRange: number[] = null;
        selectedPercentMin: number = null;
        selectedPercentMax: number = null;
        selectedMaxCreditRange: number[] = null;
        selectedMaxCreditMin: number = null;
        selectedMaxCreditMax: number = null;  
        selectedTotalCntRange : number[] = null
        selectedTotalCntMin : number = null
        selectedTotalCntMax: number = null;
        selectedUsedCntRange: number[] = null;
        selectedUsedCntMin: number = null;
        selectedUsedCntMax: number = null;
        selectedCat2Id: number = null;
        selectedCat2Name: string = null;
        selectedCat3Id: number = null;
        selectedCat3Name: string = null;
        selectedProvinceId: number = null;
        selectedCityId: number = null;
        selectedDescription: string = null;
        selectedRegisterTimeStart: string = null;
        selectedRegisterTimeEnd: string = null;
        selectedRegisterBy:number = null;
}