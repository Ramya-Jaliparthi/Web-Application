import { BcbsmaConstants } from '../constants/bcbsma.constants';

export class GenericMethodUtilities {
    /**
     * @name: hasOwnProperty
     * @param: object - the object to be checked for the property
     * @param: prop - the property to be checked for existence in the object
     * @description: helps identify of an object contains a property or not
     * @returns: boolean - true if the object contains the property and false otherwise
     */
    public hasOwnPropertyCheck(object: any, prop: string): boolean {
        if (!object) {
            throw new Error(BcbsmaConstants.errorMessages.invalidMethodCall_invalidObj);
        }
        return object.hasOwnProperty(prop);
    }

    /**
     * @name: instanceOfCheck
     * @param object - object to be checked if its an instance of a class
     * @param instance - class which is supposed to be the instance of the object
     * @description: helps check if object is an instance of a particular class
     * @returns: true if object is instance of class and false otherwise
     */
    public instanceOfCheck(object: any, instance: any): boolean {
        if (!object || !instance) {
            throw new Error(BcbsmaConstants.errorMessages.invalidMethodCall_invalidObjOrInstance);
        }
        return (object instanceof instance);
    }
}
