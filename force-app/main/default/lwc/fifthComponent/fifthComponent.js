import { LightningElement, api, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';

export default class FifthComponent extends LightningElement
{
    @wire(MessageContext) messageContext;
    @api count;
    @api firstobject;
    @api selectedobject;
    @api selectedfields;
    @api position = NaN;
    @api wanttoclearmap = false;
    @track myMap = {};
    @track lastResult = '';

    callfunctions() { 
        if (wanttoclearmap) { 
            this.removeKeysGreaterThan();
        }
    }

    // Function to check if the map is empty
    isMapEmpty() {
        return Object.keys(this.myMap).length === 0;
    }

    // Add key-value pairs to the map
    addValuesToMap() {
        if ( this.myMap[0] != this.firstobject || this.isMapEmpty()) {
            this.myMap[0] = this.firstobject;
        }
        this.myMap[count] = this.selectedobject;

        //Increase counter by one for parent component
        this.count = this.count + 1;
    }

    // Function to remove keys with values greater than the user's input
    getValuesFromMap() {
        let allValues = this.myMap.values();
        let result = '';
        console.error('Map Values::' + allValues);
        
        allValues.forEach((element, index) => {
            result += element;

            if (index < allValues.length - 1) {
            result += '.';
            }
    });

    // // Remove the last dot
    //     if (result.endsWith('.')) {
    //     result = result.slice(0, -1);
    //     }
        this.lastResult = result + this.selectedfields;
        console.error('this.lastResult::  ' + this.lastResult);
        console.error('this.lastResult::  ' + JSON.stringify(this.lastResult));
        
    }
       
    // Function to remove keys with values greater than the user's input
    removeKeysGreaterThan() {
        if (this.position != Nan) {
            for (let key in this.myMap) {
                if (this.myMap[key] > this.position) {
                    delete this.myMap[key];
                }
            }
        }
    }

    sendContentToLMS() { 
        console.error('sendContentToLMS() called in child');
        const payload = {
            counter: this.count,
            result: this.lastResult
        };
        publish(this.messageContext, Search_File, payload);
        console.error('Payload counter::'+ payload.counter);
        console.error('Payload lastResult::'+ payload.lastResult);
    }
}