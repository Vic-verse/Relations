import { LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
export default class SearchableComponent extends LightningElement {
    @track objName;
    @wire(MessageContext) messageContext;
    objectChangeHandler(event) {
        this.objName = event.detail.value;
    }
    SearchHandler() { 
        const payload = {};
        if (this.objName != undefined) {
            payload = { shareObjectName: this.objName };
        }
        publish(this.messageContext, Search_File, payload);
    }
}