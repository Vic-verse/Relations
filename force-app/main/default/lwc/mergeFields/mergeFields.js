import { LightningElement, api, track, wire } from 'lwc';
import {publish, subscribe, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
import getObjectFields from '@salesforce/apex/FieldController.getObjectFields';
import getObject from '@salesforce/apex/getObjects.getAllObjects';
export default class MergeFields extends LightningElement {
    @api objectName = '';
    isObjectsAvailable = false;
    isFieldsAvailable = false;
    allObjects = [];
    @track fields;
    @track selectedFieldTmp = '';
    openRelatedFields = false;
    showInsertField = false;
    selectedObjectname = '';
    @track selectedTagStyle = ''; 
    subscription = null;
    selectedLabelObject = '';
    selectedField = '';
    type = '';
    @wire(MessageContext) messageContext;
    connectedCallback() {}

    handleSearch(event) { 
        let obj;
        obj = event.target.value;
        this.isFieldsAvailable = false;
        this.selectedObjectname = null;
        this.fetchObjects(obj);
    }

    fetchObjects(objectName) { 
       getObject({ partialObjectType: objectName })
        .then(result => {
            this.allObjects = result;
            this.isObjectsAvailable = this.allObjects.length > 0 ? true : false;
        })
        .catch(error => {
            // console.error('Error fetching fields: ' + JSON.stringify(error));
        });
    }

    handleObj(event) { 
        this.objectName = event.target.dataset.object;
        this.isObjectsAvailable = false;
        this.fetchFields(this.objectName); 
    }
    
    fetchFields(obj) {
        getObjectFields({ objectName: obj })
        .then(result => {
            this.fields = result;
            this.isFieldsAvailable = this.fields.length > 0 ? true : false;
        })
        .catch(error => {
            // console.error('Error fetching fields: ' + JSON.stringify(error));
        });        
    }
    
    openObj(event) {
        let objName = event.target.dataset.objname;
        let index = event.target.dataset.index;
        let selectedfld = event.target.dataset.field;
        let selectedType = event.detail.type;
        let selectedLabel = event.detail.label;
        if (objName != this.selectedObjectname) {
            this.openRelatedFields = false;
        }
        this.selectedObjectname = objName;
        this.applyTagStyle(event.target);
        setTimeout(() => {
            this.openRelatedFields = true;
            this.showInsertField = false;
        }, 100);
    }
    selectField(event) {
        this.showInsertField = true;
        this.openRelatedFields = false;
        let index = event.target.dataset.index;
        let selectedfld = event.target.dataset.field;
        if (selectedfld.toLowerCase().endsWith('__c')) {
            selectedfld = selectedfld.replace(/__c$/, '__r');
        }
        this.selectedFieldTmp = selectedfld;  
        this.removeTagStyle(); 
        const dataField = event.target.dataset.field;
        this.selectedField = dataField;
        const relatedAnchors = this.template.querySelectorAll(`[data-field="${dataField}"]`);
        relatedAnchors.forEach((relatedAnchor) => {
            relatedAnchor.classList.add('selectedTagStyle');
        });

        var str = String(`${this.objectName}.${this.selectedField}`);
        this.selectedLabelObject = str;
        this.type = typeof this.selectedLabelObject;
    }
    handleClick() {
        let showPopUp = false;
        let result = `{!${this.objectName}.${this.selectedField}}`;
        const payload = {
            describeResult: result,
            showPopup: showPopUp,
        };
        publish(this.messageContext, Search_File, payload);
    }
    applyTagStyle(anchor) {
        this.removeTagStyle(); 
        const relatedAnchors = this.template.querySelectorAll(`[data-objname="${this.selectedObjectname}"]`);
        relatedAnchors.forEach((relatedAnchor) => {
            relatedAnchor.classList.add('selectedTagStyle');
        });
    }
    removeTagStyle() {
        const selectedTags = this.template.querySelectorAll('.selectedTagStyle');
        selectedTags.forEach((selectedTag) => {
            selectedTag.classList.remove('selectedTagStyle');
        });
    }
    
}
