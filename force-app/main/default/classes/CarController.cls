public with sharing class CarController {

    public class Filters{

        @AuraEnabled public String searchKey {get;set;}
        @AuraEnabled public Decimal maxPrice {get;set;}
        @AuraEnabled public String[] categories {get;set;}
        @AuraEnabled public String[] makeType {get;set;}
    }


    @AuraEnabled(cacheable=true)    
    public static List<Car__c> getCarRecords(Filters filters){
        String key, whereClause ='';
        Decimal maxPrice;
        String[] categories, makeType, criteria = new List<String>();

        if(filters != null){
            maxPrice = filters.maxPrice;
            categories = filters.categories;
            makeType = filters.makeType;
            if(!String.isEmpty(filters.searchKey)){
                key = '%'+filters.searchKey+'%';
                criteria.add('Name LIKE :key');
            }
            if(filters.maxPrice >= 0){
                criteria.add('MSRP__c <= :maxPrice');
            }
            if(filters.categories != null && !filters.categories.isEmpty()){
                criteria.add('Category__c IN :categories'); 
            }
            if(filters.makeType != null && !filters.makeType.isEmpty()){
                criteria.add('Make__c IN :makeType');
            }
        }

        if(!criteria.isEmpty()){
            whereClause = ' WHERE ' + String.join(criteria, ' AND ');
        }

        String query = 'SELECT Id, Name, Picture_URL__c, Category__c, Make__c, MSRP__c, Fuel_Type__c, Number_of_Seats__c, Control__c FROM Car__c' + whereClause + ' ORDER BY Name ASC';

        return Database.query(query);
    }

}