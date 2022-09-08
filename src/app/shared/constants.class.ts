export class Constant{
    public static tehranCityID = 320;
    public static karajCityID = 141;
    public static defaultTownshipID = 100;
    public static defaultProvinceID = 8;
    public static minValidYear = 1300;
    public static maxValidYear = 1400;
    public static websiteRgx = `^((https|http|ftp)\:\/\/)?([a-z0-9A-Z]+\.[a-z0-9A-Z]+\.[a-z0-9A-Z]+\.[a-zA-Z]{2,4}|[a-z0-9A-Z]+\.[a-z0-9A-Z]+\.[a-zA-Z]{2,4}|[a-z0-9A-Z]+\.[a-zA-Z]{2,4})$`
    public static phoneNumberRgx = `^[0-9]{3,10}$`
    public static mobileNumberRgx = `^(09)[0-9]{9}$`
    public static emailRegx = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
    public static percentRegx = '^$|^([0-9]|[1-9][0-9]|[1][0][0])?$'
    public static minLatitude = 34;
    public static maxLatitude = 37;
    public static minLongtitude = 50;
    public static maxLongtitude = 53;
    public static lazyLoadingPageSize = 7;
    public static centerlatitude = 35.6891980;
    public static centerLongitude = 51.3889740;
    public static mapZoomLevel = 12;
    public static maximumFileSize = 250000;
    public static maximumFileSize200 = 200 * 1024;

}