public with sharing class FieldController {
    @AuraEnabled(cacheable=true)
    public static List<FieldInfoWrap> getObjectFields(String objectName) {
        // Create a list to store information about object fields.
        List<FieldInfoWrap> fieldInfoList = new List<FieldInfoWrap>();
        
        // Dynamically retrieve information about the SObject's fields using its name.
        SObjectType objectType = ((SObject)Type.forName('Schema', objectName).newInstance()).getSObjectType();
        
        // Check if the object type is not null, indicating a valid object.
        if (objectType != null) {
            // Retrieve a map of object fields using the Schema.DescribeFieldResult.
            Map<String, Schema.SObjectField> objectFields = objectType.getDescribe().fields.getMap();
            
            // Loop through the fields and create FieldInfoWrap objects for each field.
            for (String fieldName : objectFields.keySet()) {
                FieldInfoWrap fieldInfo = new FieldInfoWrap();
                Schema.DescribeFieldResult fieldDescribe = objectFields.get(fieldName).getDescribe();
                
                // Populate the FieldInfoWrap object with field information.
                fieldInfo.apiName = fieldDescribe.getName();
                fieldInfo.label = fieldDescribe.getLabel();
                System.debug('FieldType is ---'+ fieldDescribe.getType() +' for '+  fieldInfo.label);
                
                // Check if the field is a reference field.
                fieldInfo.isRelationField = String.valueOf(fieldDescribe.getType()) == 'REFERENCE' ? true : false;
                
                // If it's a reference field, determine the related object.
                if (fieldInfo.isRelationField) {
                    fieldInfo.relatedObject = fieldDescribe.getReferenceTo()[0].getDescribe().getName();
                    System.debug('REFERENCE field object is '+  fieldInfo.relatedObject);
                }
                
                
                // Add the FieldInfoWrap object to the list.
                fieldInfoList.add(fieldInfo);
            }
        }
        fieldInfoList.sort();
        // Return the list of field information.
        return fieldInfoList;
    }
    
    // Define an inner class to represent field information that can be serialized to JSON.
     public class FieldInfoWrap implements Comparable {
        @AuraEnabled public string apiName;
        @AuraEnabled public string label;
        @AuraEnabled public boolean isRelationField;
        @AuraEnabled public string relatedObject;

        // Implement the compareTo method for sorting based on the 'label' field.
        public Integer compareTo(Object compareTo) {
            FieldInfoWrap otherField = (FieldInfoWrap)compareTo;
            return label.compareTo(otherField.label);
        }
    }
}