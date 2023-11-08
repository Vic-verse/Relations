import { LightningElement, api, wire } from 'lwc';
import {subscribe, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';

export default class ParentComponent extends LightningElement {
    @api isshowmodal;
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
    { 
        this.isshowmodal = message.showPopup;
    }

    openPopup() {
        this.isshowmodal = this.isshowmodal ;
    }

    closePopup() {
        this.isshowmodal = false;
    }
}