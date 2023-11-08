import { LightningElement, api, wire, track } from 'lwc';
import {publish, subscribe, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
export default class DiscriptionComponent extends LightningElement {
    show = false;
    @track selectedcontent = '';
    @wire(MessageContext) messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();

    }

    subscribeToMessageChannel()
    { 
        this.subscription = subscribe(
            this.messageContext,
            Search_File,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message)
    {this.selectedcontent = message.describeResult;}

    valueHandler(event) { 
        const value = event.detail.value;
    }

    fieldHandler() { 
        this.show = true;
        let showPopUp = true;

        const payload = {
            showPopup: showPopUp,
        };
        publish(this.messageContext, Search_File, payload);
    }

}