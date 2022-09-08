import { DiscountSource } from './../enums/discountSource.enum';
import { DiscountType } from './../enums/discountType.enum';
import { UserV } from './../entities/userV.class';
export class DiscountDetail {
	cat1Id: number;// Required in General & FirstUse
	cat2Id: number;// Required in General & FirstUse
	cat2: string;
	cat3Id: number;// Required in General & FirstUse
	cat3: string;
	provinceId: number;// Normal Only
	townshipId: number;// Normal Only
	province: string;// Normal Only
	cityId: number;// Normal Only
	city: string;// Normal Only
	user: UserV;// Normal Only
	userMobileNumber: string;// Normal Only
	description: string;


	registerBy: string;

	multyUse: boolean;// Normal Only

	type: DiscountType;
	sourceType: DiscountSource;

	image: string;// Only & Required in General & FirstUse

	get discountSourceLabel(){
		switch (this.sourceType) {
			case DiscountSource.Mopon:
				return 'Mopon';
			case DiscountSource.Netbarg:
				return 'Netbarg';
			case DiscountSource.OffChannel:
				return 'OffChannel';
			case DiscountSource.Pulsein:
				return 'Pulsein';
			case DiscountSource.Takhfifan:
				return 'Takhfifan';
			case DiscountSource.TopCoppon:
				return 'TopCoppon';
		}
	}
}