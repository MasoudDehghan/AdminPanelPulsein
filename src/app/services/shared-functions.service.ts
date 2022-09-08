import * as glob from '../shared/global';
import { Injectable } from '@angular/core'
import { SelectItem } from 'primeng/primeng';
import { Constant } from '../shared/constants.class';

@Injectable()
export class SharedFunctions {
    public convertPersianNumberToEnglish(inputValue: string): string {
        let englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        let persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];
        for (var i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
            inputValue = inputValue.replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);
        }
        return inputValue;
    }
    public initYearList(): SelectItem[] {
        let yearList = [];
        let year: number = Constant.minValidYear;
        let maxYear: number = Constant.maxValidYear;
        while (year <= maxYear) {
            yearList.push({ label: year + "", value: year + "" });
            year++;
        }
        return yearList;
    }
}