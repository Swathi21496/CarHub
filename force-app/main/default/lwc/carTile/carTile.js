import { LightningElement, api } from 'lwc';

export default class CarTile extends LightningElement {
    @api car={};

    handleClick(){
        console.log('Car Clicked: ', this.car);
        const carClickEvent = new CustomEvent('selected', {
            detail: this.car.Id
        });
        this.dispatchEvent(carClickEvent);
    }
}