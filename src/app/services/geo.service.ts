import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Province } from '../entities/province.class'
import { TownShip } from '../entities/township.class'
import { City } from '../entities/city.class'
import { Region } from '../entities/region.class'
import { Area } from '../entities/area.class'
import { environment } from '../../environments/environment';

@Injectable()
export class GeoService {
    baseURL = environment.apiUrl;
    token = sessionStorage.getItem('token');
    httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) {
    }
    geProvinceList() {
        let _url = this.baseURL + "/province/all/" + this.token;
        return this.http
            .get(_url,this.httpOptions);
    }
    lookupProvinceById(provinceID: number) {
        let _url = this.baseURL + "/province/lookupById/" + this.token + "/" + provinceID;
        return this.http
            .get(_url,this.httpOptions);
    }

    geTownshipList(provinceID: number) {
        let _url = this.baseURL + "/township/provinceid/" + this.token + "/" + provinceID;
        return this.http
            .get(_url,this.httpOptions)
            ;
    }
    geCityList(townshipID: number) {
        let _url = this.baseURL + "/city/townshipid/" + this.token + "/" + townshipID;
        return this.http
            .get(_url,this.httpOptions)
            ;
    }
    geRegionList(cityID: number) {
        let _url = this.baseURL + "/region/cityid/" + this.token + "/" + cityID;
        return this.http
            .get(_url,this.httpOptions)
            ;
    }

    geAreaList(regionID: number) {
        let _url = this.baseURL + "/area/regionid/" + this.token + "/" + regionID;
        return this.http
            .get(_url,this.httpOptions)
            ;
    }

    addProvince(pr: Province) {
        let _url = this.baseURL + "/province/add/" + this.token;
        return this.http
            .post(_url, JSON.stringify(pr),this.httpOptions)
            ;
    }
    updateProvince(pr: Province) {
        let _url = this.baseURL + "/province/edit/" + this.token;
        return this.http
            .post(_url, JSON.stringify(pr),this.httpOptions)
            ;
    }
    deleteProvince(pr: Province) {
        let _url = this.baseURL + "/province/delete/" + this.token;
        return this.http
            .post(_url, JSON.stringify(pr),this.httpOptions)
            ;
    }
    addTownship(township: TownShip) {
        let _url = this.baseURL + "/township/add/" + this.token;
        return this.http
            .post(_url, JSON.stringify(township),this.httpOptions)
            ;
    }
    updateTownship(township: TownShip) {
        let _url = this.baseURL + "/township/edit/" + this.token;
        return this.http
            .post(_url, JSON.stringify(township),this.httpOptions)
            ;
    }
    deleteTownship(township: TownShip) {
        let _url = this.baseURL + "/township/delete/" + this.token;
        return this.http
            .post(_url, JSON.stringify(township),this.httpOptions)
            ;
    }
    addCity(city: City) {
        let _url = this.baseURL + "/city/add/" + this.token;
        return this.http
            .post(_url, JSON.stringify(city),this.httpOptions)
            ;
    }
    updateCity(city: City) {
        let _url = this.baseURL + "/city/edit/" + this.token;
        return this.http
            .post(_url, JSON.stringify(city),this.httpOptions)
            ;
    }
    deleteCity(city: City) {
        let _url = this.baseURL + "/city/delete/" + this.token;
        return this.http
            .post(_url, JSON.stringify(city),this.httpOptions)
            ;
    }
    lookupCityByName(cityName: string) {
        let _url = this.baseURL + "/city/lookupByName/name/" + this.token + "/" + cityName;
        return this.http
            .get(_url,this.httpOptions)
            ;
    }
    lookupRegionByID(regionID: number) {
        let _url = this.baseURL + "/region/lookupById/id/" + this.token + "/" + regionID;
        return this.http.get(_url,this.httpOptions);
    }
    addRegion(region: Region) {
        let _url = this.baseURL + "/region/add/" + this.token;
        return this.http.post(_url, JSON.stringify(region),this.httpOptions);
    }
    updateRegion(region: Region) {
        let _url = this.baseURL + "/region/edit/" + this.token;
        return this.http.post(_url, JSON.stringify(region),this.httpOptions);
    }
    deleteRegion(region: Region) {
        let _url = this.baseURL + "/region/delete/" + this.token;
        return this.http.post(_url, JSON.stringify(region),this.httpOptions);
    }

    addArea(area: Area) {
        let _url = this.baseURL + "/area/add/" + this.token;

        return this.http.post(_url, JSON.stringify(area),this.httpOptions);
    }
    updateArea(area: Area) {
        let _url = this.baseURL + "/area/edit/" + this.token;
        return this.http.post(_url, JSON.stringify(area),this.httpOptions);
    }
    deleteArea(area: Area) {
        let _url = this.baseURL + "/area/delete/" + this.token;
        return this.http.post(_url, JSON.stringify(area),this.httpOptions);
    }
    geAreaListByCityID(cityID: number) {
        let _url = this.baseURL + "/area/cityid/" + this.token + "/" + cityID;
        return this.http.get(_url);
    }


}