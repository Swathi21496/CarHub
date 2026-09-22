import { LightningElement,api, wire } from 'lwc';
import getSimilarCars from '@salesforce/apex/CarController.getSimilarCars';
import {getRecord} from 'lightning/uiRecordApi';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import {NavigationMixin} from 'lightning/navigation';

export default class SimilarCars extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName
    similarCars

    @wire(getRecord,{recordId: '$recordId', fields:[MAKE_FIELD]})
    car

    fetchSimilarCars(){
        console.log('Fetch Similar Cars button clicked');
        getSimilarCars({carId: this.recordId, makeType: this.car.data.fields.Make__c.value})
        .then(result => {
            console.log('Similar Cars: ', result);
            this.similarCars = result;
        })
        .catch(error => {
            console.error('Error in fetching similar cars: ', error);
        });
    }

    handleViewDetailsClick(event){
        console.log('Id is',event.target.dataset.id)
       this[NavigationMixin.Navigate]({
         type: 'standard__recordPage',
         attributes:{
            recordId:event.target.dataset.id,
            objectApiName: this.objectApiName,
            actionName:'view'
         }
       });
    }
}