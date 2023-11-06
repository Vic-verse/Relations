import { LightningElement, api, track, wire } from 'lwc';
import getObjectFields from '@salesforce/apex/FieldController.getObjectFields';
export default class SecondComponent extends LightningElement {
    @api secobjname;
    @api firstobject;
    @track fields;
    selectedField = '';
    @track count = 0;
    @track selectedFieldTmp = '';
    openRelatedFields = false;
    showInsertField = false;
    selectedObjectname = '';
    @track selectedTagStyle = ''; 
    selectedLabelObject = '';
    type = '';
    @wire (getObjectFields, {objectName:'$secobjname'}) wiredgetObjectFields({data,error}){
        if (data) {
            this.fields = data;
        } else if (error) {
        console.error(error);
        }
    }
    openObj(event) {
        let objName = event.target.dataset.objname;
        let index = event.target.dataset.index;
        let selectedfld = event.target.dataset.field;
        let selectedType = event.detail.type;
        let selectedLabel = event.detail.label;
        if (objName != this.selectedObjectname) {this.openRelatedFields=false;}
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
        console.error('Selected Field selectedfld: ' + selectedfld);
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
            
            var str = String(`${this.firstobject}.${this.secobjname}.${this.selectedField}`);
            this.selectedLabelObject = str;
            this.type = typeof this.selectedLabelObject;
        });
    }
    handleClick() {}
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