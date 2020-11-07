const {WaterfallDialog, ComponentDialog} = require('botbuilder-dialogs');

const { ConfirmPrompt, ChoicePrompt, DateTimePrompt, NumberPrompt, TextPrompt} = require('botbuilder-dialogs');
 
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const DATETIME_PROMPT = 'DATETIME_PROMPT';
const WATERFALL_PROMPT = 'WATERFALL_PROMPT';
 
class MakeReservationDialog extends ComponentDialog {
    constructor() {
        super('makeReservationDialog');
        this.conversationState = conversationState;
        this.conversationDate =  conversationDate;
        // initiate the dialogsets for the prompts
this.addDialog(new TextPrompt(TEXT_PROMPT));
this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
this.addDialog(new NumberPrompt(NUMBER_PROMPT),this.noOfParticipantsValidator);
this.addDialog(new DateTimePrompt(DATETIME_PROMPT));
 
this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [

])); 
    this.firstStep.bind(this),  // As confirmation for usr to create project // control
    this.getName.bind(this),    //Get name from user
    this.getNumberOfParticipants.bind(this), // Number of participants for reservation
    this.getDate.bind(this),
    this.getTime.bind(this),
    this.confirmStep.bind(this),
    this.summaryStep.bind(this)
        
this.initialDialogId = WATERFALL_DIALOG;

    }

    async run(turnContext, accessor) {

    const dialogSet = new dialogSet(accessor);
    dialogSet.add(this);
    const dialogContext = await dialogSet.createContext(turnContext);

    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
    }

    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
    } 
}

async firstStep(step) {
        
        // running a prompt here means the next waterfall step will run when users response is received
return await step.prompt(CONFIRM_PROMPT, 'Continue?', ['yes', 'no']);
}
 
async getName(step) {
        if(step.result == true)
        {
        return await step.prompt(TEXT_PROMPT, 'In What name reservation is to be made?');
        }
}

async getNumberOfParticipants(step) {
    step.values.name = step.result
    return await step.prompt(NUMBER_PROMPT, 'How many participants(0-150)?');
}

async getDate(step){
    step.values.noOfParticipants = step.result
    
    return await step.prompt(DATETIME_PROMPT, 'What date reservation is to be made?');
    
}

async getTime(step) {
    step.values.time = step.result
    
    return await step.prompt(DATETIME_PROMPT, 'What time reservation is to be made?');
    
}

async confirmStep(step){
    
    step.values.time = step.result
    
    var msg = ` You have entered following values: \n Name: ${step.values.name}\n Participants: ${step.values.noOfParticipants}\n Date: ${step.values.date}\n Time: ${step.values.time}`
    
    await step.context.sendActivity(msg);

    return await step.prompt(CONFIRM_PROMPT, 'Are you sure?, You Want to Reserve a Table', ['yes','no']);
    
}

async summaryStep(step){

    if(step.result===true)
    {
        await step.context.sendActivity('Reservation successfully made. Your id is : 123456')
        return await step.endDialog();
    
    }
}

async noOfParticipantsValidator(promptContext){
    // This condition is our validation rule. You can also change the value at this point.
    return promptContext.recognized.succeded && promptContext.recognized.value > 1 && promptContext.recognized.value < 150;
}
}

module.exports.MakeReservationDialog = MakeReservationDialog


