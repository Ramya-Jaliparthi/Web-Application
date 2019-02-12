export const MessageCenterConstants = Object.freeze({
    attributes: {
        messageUpdatedDateTime: 'messageUpdatedDateTime',
        dateStamp: 'dateStamp'
    },

    buttons: {
        key: 'value',
        anotherKey: 'anotherValue'
    },

    buttonSpans: {
        backToUploads: 'Back to Uploads',
        downloadACopy: 'Download a Copy'
    },

    components: {
        documentsComponent: 'DocumentsComponent',
        planDocumentsComponent: 'PlanDocumentsComponent',
        documentDetailComponent: 'DocumentDetailComponent',
        documentsListViewComponent: 'DocumentsListViewComponent',
        messageDetailComponent: 'MessageDetailComponent',
        msgListingComponent: 'MsgListingComponent',
        uploadsComponent: 'UploadsComponent',
        uploadDetailComponent: 'UploadDetailComponent',
        noDocumentsFoundComponent: 'NoDocumentsFoundComponent',
        messageCenterSearchComponent: 'MessageCenterSearchComponent',
        inboxComponent: 'InboxComponent'
    },

    errorMessages: {
        invalidParamInFunctionCall: 'Function call uses invalid parameter',
        possibleInvalidParamInFunctionCall: 'Possible invalid parameters in function call',
        invalidFileItem: 'Invalid File Item',
        invalidFileLocation: 'Invalid File Location',
        invalidFolderLocation: 'Invalid Folder Location',
        invalidMethodCall_invalidObj: 'Invalid method call - object is invalid',
        invalidMethodCall_invalidObjOrInstance: 'Invalid method call - object or instance param is invalid',
        invalidServiceResponseData: 'Invalid Service Response Data',
        noDocsFound_InvalidComponentModeError:
            'Invalid component mode in NoDocumentsFoundComponent. Should be one of uploads/documents/messages'
    },

    flags: {
        documentsMode: 'documents',
        messagesMode: 'messages',
        uploadsMode: 'uploads',
        planDocumentsMode: 'planDocuments',
        noSearchResultsMode: 'noSearchResultsMode'
    },

    labels: {

    },

    messages: {

    },

    methods: {
        initDefaultSortFilter: 'initDefaultSortFilter',
        toggleCalender: 'toggleCalender',
        onSortFilterChanged: 'onSortFilterChanged',
        onCategoryFilterChange: 'onCategoryFilterChange',
        onDateFilterChanged: 'onDateFilterChanged',
        toggleFilter: 'toggleFilter',
        applyFilter: 'applyFilter',
        clearFilter: 'clearFilter',
        customDateInputKeyDownEvent: 'customDateInputKeyDownEvent',
        toggleCalendarDisplay: 'toggleCalendarDisplay',
        getMinimumFromDate: 'getMinimumFromDate',
        getSelectedValue: 'getSelectedValue',
        isOpened: 'isOpened',
        isClosed: 'isClosed',
        showTypeAHeadList: 'showTypeAHeadList',
        escapeSearchContainer: 'escapeSearchContaine',
        clearSearchVal: ' clearSearchVa',
        search: ' search',
        setCalendarMinimumDate: 'setCalendarMinimumDate',
        getSearchValue: ' getSearchValue',
        proxyClick: 'proxyClic',
        onSearch: 'onSearch',
        removeUndoOption: 'removeUndoOption',
        backToMsgListing: 'backToMsgListing',
        constructor: 'constructor',
        clearCache: 'clearCache',
        getDocumentViewData: 'getDocumentViewData',
        getMessageDetail: 'getMessageDetail',
        getMsgListing: 'getMsgListing',
        getSearchFilters: 'getSearchFilters',
        ngOnInit: 'ngOnInit',
        openFolder: 'openFolder',
        openFile: 'openFile',
        clearMsgListing: 'clearMsgListing',
        setMsgListing: 'setMsgListing',
        createSearchCriteria: 'createSearchCriteria',
        getSelectedMsgListing: 'getSelectedMsgListing',
        deleteMsgListing: 'deleteMsgListing',
        undoMsgListing: 'undoMsgListing',
        showMsgDetails: 'showMsgDetails',
        navigateToUploadsScreen: 'navigateToUploadsScreen',
        downloadCopy: 'downloadCopy',
        ngOnChanges: 'ngOnChanges',
        openComponent: 'openComponent'
    },

    filters: {
        sortByFilters: {
            mostRecent: 'Most Recent',
            oldestFirst: 'Oldest First',
            unreadFirst: 'Unread First'
        },
        dateFilters: {
            last30Days: 'Last 30 days',
            last60Days: 'Last 60 days',
            last90Days: 'Last 90 days',
            yearToDate: 'Year-to-date',
            allDates: 'All dates',
            customDateRange: 'Custom Date Range'
        }
    },

    services: {
        documentsService: 'documentsService',
        messageCenterSearchService: 'messageCenterSearchService',
        uploadsService: 'uploadsService',
        messagesService: 'messagesService'
    },

    urls: {

    }

});
