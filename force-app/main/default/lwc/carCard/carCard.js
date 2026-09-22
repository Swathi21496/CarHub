import { LightningElement, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Car__c.Name';
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c';
import FUEL_TYPE from '@salesforce/schema/Car__c.Fuel_Type__c';
import SEAT_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c';
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c';
import {getFieldValue} from 'lightning/uiRecordApi';
import CAR_SELECTED from '@salesforce/messageChannel/carSelected__c';
import {subscribe, unsubscribe, MessageContext} from 'lightning/messageService';
import {NavigationMixin} from 'lightning/navigation';
import CAR_OBJECT from '@salesforce/schema/Car__c';

export default class CarCard extends NavigationMixin(LightningElement) {
    carId;
    categoryField = CATEGORY_FIELD;
    makeField = MAKE_FIELD;
    msrpField = MSRP_FIELD;
    fuelTypeField = FUEL_TYPE;
    seatField = SEAT_FIELD;
    controlField = CONTROL_FIELD;
    carName;
    carPictureUrl;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeHandler();
    }

    subscription;
    subscribeHandler() {    
        this.subscription = subscribe(this.messageContext, CAR_SELECTED, (message) => {
            this.handleCarSelected(message);
        });
    }

    handleCarSelected(message) {
        console.log('Received message: ', message);
        this.carId = message.carId;
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleRecordLoad(event){
        console.log('Record Loaded: ', event.detail);
        const {records}= event.detail;
        const recordData = records[this.carId];
        this.carName = getFieldValue(recordData, NAME_FIELD);
        this.carPictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD);
    }

    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.carId,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}