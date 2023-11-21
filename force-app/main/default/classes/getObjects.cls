public class getObjects {
    @AuraEnabled
    public static List<String> getAllObjects(String partialObjectType) {
        try {
            if (String.isBlank(partialObjectType)) {
                System.debug('Input string is blank. No data fetched.');
                return new List<String>();
            }
    
            List<Schema.SObjectType> objList = Schema.getGlobalDescribe().Values();
            List<String> objNames = new List<String>();
    
            for (Schema.SObjectType obj : objList) {
                Schema.DescribeSObjectResult objResult = obj.getDescribe();
                String objName = objResult.getName().toLowerCase();
                String partialObjectTypeLower = partialObjectType.toLowerCase().trim();
    
                if (objName.contains(partialObjectTypeLower)) {
                    objNames.add(objResult.getName());
                }
            }
            objNames.sort();
    
            for (String obj : objNames) {
                System.debug('Api Name : ' + obj);
            }
            return objNames;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}