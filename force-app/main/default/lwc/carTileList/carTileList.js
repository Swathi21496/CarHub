import { LightningElement,wire } from 'lwc';
import getCarRecords from '@salesforce/apex/CarController.getCarRecords';
import { MessageContext, subscribe, unsubscribe, publish} from 'lightning/messageService';
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFilter__c';
import CAR_SELECTED from '@salesforce/messageChannel/carSelected__c';
export default class CarTileList extends LightningElement {
    cars=[];
    error;
    filters={};
    @wire(MessageContext)
    messageContext;


    connectedCallback() {
        this.subscribeHandler();
    }

    subscription;
    subscribeHandler() {    
        this.subscription = subscribe(this.messageContext, CARS_FILTERED_MESSAGE, (message) => {
            this.handleFilterChanges(message);
        });
    }

    handleFilterChanges(message) {
        console.log('Received message: ', message);
        this.filters = message.filters;
    }   

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    @wire(getCarRecords, { filters: '$filters' } )
    carsHandler({data, error}){
        if(data){
            console.log('Car Records: ', data);
            this.cars = data;
        }
        if(error){
            console.error('Error in fetching car records: ', error);
            this.error = error;
        }
    }

    handleCarSelected(event){
        console.log('Car Selected: ', event.detail);
        publish(this.messageContext, CAR_SELECTED, {
            carId: event.detail
        });
    }
}