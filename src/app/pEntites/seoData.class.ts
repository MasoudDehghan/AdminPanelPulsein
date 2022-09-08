import { C3SeoContent } from "./c3SeoContent.class";
import { C3SeoQuestion } from "./c3SeoQuestion.class";
import { C3Price } from "./c3Price.class";

export class SeoData{
    titleSeo:string;
	descriptionSeo:string;
	imageHeader:string;
	altImage:string;
	headerTxtH1:string;
	headerTxtH2:string;
	introductionTxt:string;
	questionsTitleH2:string;
	contents:C3SeoContent[];
	questions:C3SeoQuestion[];
	priceInfo:C3Price;
}