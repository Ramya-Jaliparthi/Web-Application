import { CommChannel, MyPreferencesModel, MessageCategory } from './mypreferences.model';
import {Injectable} from '@angular/core';

@Injectable()
export class MyPrefConst {
    commChannels: CommChannel[];
    constructor () {
        this.commChannels = [];
        this.setCommunicationChannels();
    }

    setCommunicationChannels() {
        this.commChannels.push(new CommChannel('SMS*',
        // tslint:disable-next-line:max-line-length
        '*By enrolling in text alerts you are authorizing Blue Cross Blue Shield of Massachusetts to send text messages through an automatic dialing system.',
        'phone number'));
        this.commChannels.push(new CommChannel('Email', '', 'email'));
        this.commChannels.push(new CommChannel('All', '', ''));
        this.commChannels.push(new CommChannel('Paper', '', ''));
    }

    getSampleHealthPrmosData(): MessageCategory[] {
        const HealthPromoRows =  [
            {
              rowName: 'Total',
              rowDescription: '',
              row: [
                { 'commChannel':  this.commChannels[3] , 'checked': false, 'disabled': true },
                { 'commChannel':  this.commChannels[2] , 'checked': true, 'disabled': true  },
                { 'commChannel':  this.commChannels[1] , 'checked': false, 'disabled': false  }
              ]
            },
            {
              rowName: 'Message Category 1',
              rowDescription: 'Description Lorem ipsum dolor sit amet.',
              row: [
                { 'commChannel':  this.commChannels[3] , 'checked': false, 'disabled': true },
                { 'commChannel':  this.commChannels[2] , 'checked': true, 'disabled': true  },
                { 'commChannel':  this.commChannels[1] , 'checked': false, 'disabled': false  }
              ]
            },
            {
              rowName: 'Message Category 2',
              rowDescription: '',
              row: [
                { 'commChannel':  this.commChannels[3] , 'checked': false, 'disabled': true },
                { 'commChannel':  this.commChannels[2] , 'checked': true, 'disabled': true  },
                { 'commChannel':  this.commChannels[1] , 'checked': false, 'disabled': false  }
              ]
            }
          ];
        return HealthPromoRows;
    }

    getServiceSampleData() {
        const rtnVal = {
            'Preferences': [
                {
                    'name': 'Notifications',
                    'all': true,
                    'email': true,
                    'sms': true,
                    'details': [
                        {
                            'name': 'Mandatory',
                            'all': true,
                            'email': true,
                            'sms': true,
                            'details': [
                                {
                                    'name': 'Provider Changes',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': []
                                },
                                {
                                    'name': 'Plan Updates',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': []
                                },
                                {
                                    'name': 'Category',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': []
                                },
                                {
                                    'name': 'Category',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': []
                                },
                                {
                                    'name': 'Category',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': []
                                }
                            ]
                        },
                        {
                            'name': 'Account Activity',
                            'all': true,
                            'email': true,
                            'sms': true,
                            'details': [
                                {
                                    'name': 'Profile Updates',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'New HSA Card Mailed',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'HSA Card Reported Lost or Stolen',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'New ID Card Requested',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                }
                            ]
                        },
                        {
                            'name': 'SmartShopper',
                            'all': true,
                            'email': true,
                            'sms': true,
                            'details': [
                                {}
                            ]
                        },
                        {
                            'name': 'Financials',
                            'all': true,
                            'email': true,
                            'sms': true,
                            'details': [
                                {
                                    'name': 'Account Balance Alert',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Account Deductible Met',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Card Tranaction Approved / Denied',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Completed HSA Payment Notice',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Deposit Received',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Direct Deposit Account Change',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Failed HSA Payment',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'HSA Online Statement Available',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Manual Claim Entered by Administrator or You',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Reimbursment Processed',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'IRS Grace Period, Run Out Rate, and Year End Reminder',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                }
                            ]
                        },
                        {
                            'name': 'Healthy Updates (Promos)',
                            'all': true,
                            'email': true,
                            'sms': true,
                            'details': [
                                {
                                    'name': 'Message Category 1',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                },
                                {
                                    'name': 'Message Category 2',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': [
                                        {}
                                    ]
                                }
                            ]
                        },
                        {
                            'name': 'My Inbox',
                            'all': true,
                            'email': true,
                            'sms': true,
                            'details': [
                                {
                                    'name': 'New Messages',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': []
                                },
                                {
                                    'name': 'New Documents',
                                    'all': true,
                                    'email': true,
                                    'sms': true,
                                    'details': []
                                }
                            ]
                        }
                    ]
                },
                {
                    'name': 'Delivery',
                    'all': 'NA',
                    'email': 'NA',
                    'sms': 'NA',
                    'details': [
                        {
                            'name': 'Tax Forms',
                            'paper': true,
                            'electronic': true
                        },
                        {
                            'name': 'HSA Statements',
                            'electronicAndPaper': true,
                            'electronicOnly': true
                        }
                    ]
                }
            ]
        };

        return rtnVal;
    }

}
