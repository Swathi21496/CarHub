import { LightningElement,wire } from 'lwc';
import {getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';
import CAR_OBJECT from '@salesforce/schema/Car__c';
import CATEGORTY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
const CATEGORY_ERROR_MESSAGE = 'Error loading category picklist values';
const MAKE_ERROR_MESSAGE = 'Error loading make picklist values';
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFilter__c';
import { publish, MessageContext } from 'lightning/messageService';
export default class CarFilter extends LightningElement {
    filters={
        searchKey: '',
        maxPrice: 999999
    }
    timer;
    categoryErrorMessage = CATEGORY_ERROR_MESSAGE;
    makeErrorMessage = MAKE_ERROR_MESSAGE;

    @wire(MessageContext)
    messageContext;

    /* fetching category picklist values from car object */
    @wire(getObjectInfo, {objectApiName: CAR_OBJECT})
    carObjectInfo;

    @wire(getPicklistValues, {recordTypeId: '$carObjectInfo.data.defaultRecordTypeId', fieldApiName: CATEGORTY_FIELD})
        categoryPicklistValues;
    

    /* fetching make picklist values from car object */
    @wire(getPicklistValues, {recordTypeId: '$carObjectInfo.data.defaultRecordTypeId', fieldApiName: MAKE_FIELD})
        makePicklistValues;
    

    handleSearchKeyChange(event){
        console.log('Search Key Changed: ', event.target.value);
        this.filters = {
            ...this.filters,
            searchKey: event.target.value
        };
        this.sendDataToCarTileList();
    }

    handleMaxPriceChange(event){
        console.log('Max Price Changed: ', event.target.value);
        this.filters = {
            ...this.filters,
            maxPrice: event.target.value
        };
        this.sendDataToCarTileList();
    }

    handleCheckbox(event){
        console.log('Checkbox Changed: ', event.target.checked);
        if(!this.filters.categories){
            const categories = this.categoryPicklistValues.data.values.map(item => item.value);
            this.filters = {...this.filters,categories};
            
        }
        console.log('Filters before change: ', this.filters);
        if(!this.filters.makeType){
            const makeType = this.makePicklistValues.data.values.map(item => item.value);
            this.filters = {...this.filters,makeType};
        }
        console.log('Filters before change: ', this.filters);
        const {name, value} = event.target.dataset;
        console.log('Checkbox Name: ', name);
        console.log('Checkbox Value: ', value);
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] =[...this.filters[name], value];
            }
        } else {
            this.filters[name] = this.filters[name].filter(v => v !== value);
        }

        this.sendDataToCarTileList();

    }

    sendDataToCarTileList(){
        console.log('Sending data to carTileList: ', this.filters);
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(() => {
        publish(this.messageContext, CARS_FILTERED_MESSAGE, {
            filters: this.filters
        });
        }, 400);
    }
}