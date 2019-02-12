import { MessageCenterConstants } from '../constants/messageCenter.constants';
import * as moment from 'moment';
import { extendMoment as extendedMoment } from 'moment-range';
import {
    MessageCenterSearchFilterDateRanges,
    MessageDetailsSearchResponseModelInterface
} from '../modals/interfaces/message-center-search.interface';
import { CommonDocumentEntityInterface } from '../modals/interfaces/message-center.interface';

export class MessageCenterUtilities {

    /**
     * @name: hasOwnProperty
     * @param: object - the object to be checked for the property
     * @param: prop - the property to be checked for existence in the object
     * @description: helps identify of an object contains a property or not
     * @returns: boolean - true if the object contains the property and false otherwise
     */
    public hasOwnPropertyCheck(object: any, prop: string): boolean {
        if (!object) {
            throw new Error(MessageCenterConstants.errorMessages.invalidMethodCall_invalidObj);
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
            throw new Error(MessageCenterConstants.errorMessages.invalidMethodCall_invalidObjOrInstance);
        }
        return (object instanceof instance);
    }

    /**
     * @name trackAgeOfEntity
     * @param now current time instance as Moment object. Defaults to current date
     * @param then created or birth time instance as string in date format
     * @param dateRangeInfoToUpdate of type MessageCenterSearchFilterDateRanges which is also the return object
     * @returns dateRangeInfoToUpdate instance of MessageCenterSearchFilterDateRanges
     */
    public trackAgeOfEntity(
        now: moment.Moment = moment(new Date()),
        then: string,
        dateRangeInfoToUpdate: MessageCenterSearchFilterDateRanges
    ): MessageCenterSearchFilterDateRanges {

        try {
            const msgListItemDate: moment.Moment = moment(new Date(then));
            const duration: moment.Duration = moment.duration(now.diff(msgListItemDate));
            const durationAsDays: number = duration.asDays();
            const durationAsYears: number = duration.asYears();

            if (!now.isValid()) {
                throw new Error(`${MessageCenterConstants.errorMessages.invalidParamInFunctionCall} -> now is ${now}`);
            }

            if (!msgListItemDate.isValid()) {
                throw new Error(`${MessageCenterConstants.errorMessages.invalidParamInFunctionCall}
                    -> msgListItemDate is ${msgListItemDate}`);
            }

            if (isNaN(durationAsDays) || isNaN(durationAsYears)) {
                throw new Error(`${MessageCenterConstants.errorMessages.possibleInvalidParamInFunctionCall}
                    -> now and msgListItemDate are possbily invalid`);
            }

            dateRangeInfoToUpdate.all_dates++;
            if (durationAsYears <= 1.0) {
                dateRangeInfoToUpdate.year_to_date++;
                if (durationAsDays <= 90) {
                    dateRangeInfoToUpdate.last_90_days++;
                    if (durationAsDays <= 60) {
                        dateRangeInfoToUpdate.last_60_days++;
                        if (durationAsDays <= 30) {
                            dateRangeInfoToUpdate.last_30_days++;
                        }
                    }
                }
            }
        } finally {
            return dateRangeInfoToUpdate;
        }

    }

    /**
     * @name doDateFilter
     * @param entityList : CommonDocumentEntityInterface[]
     * @param searchCriteriaData : MessageDetailsSearchResponseModelInterface
     * @param dateAttribute : CommonDocumentEntityInterface[]
     * @description helps mark all incomming data with "hideEntityFromDisplay" flag as false if they dont meet the
     *              date search criteria
     */
    public doDateFilter(entityList: CommonDocumentEntityInterface[],
        searchCriteriaData: MessageDetailsSearchResponseModelInterface,
        dateAttribute: string): CommonDocumentEntityInterface[] {

        try {

            const dateFilterKeys: string[] = searchCriteriaData.dateFilterMap.getKeys();
            const now: moment.Moment = moment(new Date());

            const customStartDate = moment(new Date(searchCriteriaData.dateFilterCustomStartDate));
            const customEndDate = moment(new Date(searchCriteriaData.dateFilterCustomEndDate)).add('days', 1);
            const range = extendedMoment(moment).range(customStartDate, customEndDate);


            let selectedDateFilter: string;
            for (const dateKey of dateFilterKeys) {
                const sortCriteria = searchCriteriaData.dateFilterMap.get(dateKey);
                if (sortCriteria.criteriaSelected) {
                    selectedDateFilter = dateKey;
                    break;
                }
            }

            entityList = entityList.map((entity) => {

                if (!entity.hideEntityFromDisplay) {
                    const entityRawDate = new Date(entity[dateAttribute]);
                    const entityDate: moment.Moment = moment(entityRawDate);
                    const duration: moment.Duration = moment.duration(now.diff(entityDate));
                    const durationAsDays: number = duration.asDays();
                    const durationAsYears: number = duration.asYears();

                    switch (selectedDateFilter) {
                        case 'Last 30 days':
                            entity.hideEntityFromDisplay = (durationAsDays > 30) ? true : false;
                            break;
                        case 'Last 60 days':
                            entity.hideEntityFromDisplay = (durationAsDays > 60) ? true : false;
                            break;
                        case 'Last 90 days':
                            entity.hideEntityFromDisplay = (durationAsDays > 90) ? true : false;
                            break;
                        case 'Year-to-date':
                            entity.hideEntityFromDisplay = (durationAsYears > 1.0) ? true : false;
                            break;
                        case 'Custom Date Range':
                            entity.hideEntityFromDisplay = !range.contains(entityRawDate);
                            break;
                        default:
                            entity.hideEntityFromDisplay = false;
                            break;

                    }
                }

                return entity;
            });
        } finally {
            return entityList;
        }
    }

    /**
     * @name doKeywordFilter
     * @param entityList : CommonDocumentEntityInterface[]
     * @param searchCriteriaData : MessageDetailsSearchResponseModelInterface
     * @description helps mark all incomming data with "hideEntityFromDisplay" flag as false if they dont meet the
     *              keyword search criteria
     */
    public doKeywordFilter(entityList: CommonDocumentEntityInterface[],
        searchCriteriaData: MessageDetailsSearchResponseModelInterface): CommonDocumentEntityInterface[] {
        try {
            const keywordToSearch: string = searchCriteriaData.keywordToSearch.toLowerCase();
            // search for values only when user searched with a valid keyword value
            if (keywordToSearch.trim() !== '') {
                entityList = entityList.map((entity) => {
                    if (!entity.hideEntityFromDisplay) {
                        if (!entity.LongText.toLowerCase().includes(keywordToSearch) &&
                            !entity.ShortText.toLowerCase().includes(keywordToSearch)) {
                            entity.hideEntityFromDisplay = true;
                        }
                    }

                    return entity;
                });
            }
        } finally {
            return entityList;
        }
    }

    public clearPreviousSearchFlags(entityList: CommonDocumentEntityInterface[]): CommonDocumentEntityInterface[] {
        return entityList.map((entity) => {
            entity.hideEntityFromDisplay = false;
            return entity;
        });
    }
}


