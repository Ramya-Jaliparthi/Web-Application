export const RegistrationModuleConstants = Object.freeze({
    buttons: {
        continueButton: 'Continue'
    },

    components: {
        verifyAccessCodeComponent: 'VerifyaccesscodeComponent'
    },

    controls: {
        accessCode1: 'accesscode1',
        accessCode2: 'accesscode2',
        accessCode3: 'accesscode3',
        accessCode4: 'accesscode4',
        accessCode5: 'accesscode5',
        accessCode6: 'accesscode6'
    },

    errorMessages: {
        invalidMaterialFormError: 'invalid material form'
    },

    headerText: {
        verifyUrIdentityText: 'Verify Your Identity'
    },

    instructionText: {
        answer3QuestionsOnIdentityText: 'answer three security questions.',
        enterUrStudIDOrText: 'Enter your student ID to verify your identity, or',
        enterStudIdToVerifyText: 'Enter your student ID to verify your identity.',
        fieldIsReqInfoText: '*Field is required.',
        noStudIdQuestion: `Don't have a student ID?`,
        orAnswer3QuestionsOnIdentityText: 'Answer three security questions.',
    },

    labels: {
        studentIdReq: 'Student ID*',
    },

    methods: {
        getMatFormClass: 'getMatFormClass'
    },

    validationErrorMessages: {
        studentIdIsRequired: 'Student ID is required',
        requireAccessCode: 'Error - invalid access code'
    },

    urls: {
        register_securityAnswers_url: '/register/securityanswers',
        register_updateSSN_url: '/register/updatessn'
    },

    verficationCodeResentMsg: 'Verification code resent! You may need to check your spam folder.'

});
