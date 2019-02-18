export interface FAQQuestion {
    question: string;
    answer: string;
}

// tslint:disable:max-line-length
export const faqQuestions: FAQQuestion[] = [
    {
        question: 'I am getting the message "Could not connect to LiveSplit". What should I do?',
        answer: 'The LiveSplit overlay needs to connect to the LiveSplit base application. To do that a server component needs to be activated. Open LiveSplit and select the option "Control > Start Server (WS)". You should now be able to connect to LiveSplit.'
    },
    {
        question: 'Why do I need to have LiveSplit running?',
        answer: 'This Overlay is for fullscreen games. By running the base application in the background we can get all (or most) of the features from LiveSplit and can display them through overwolf.'
    },
    {
        question: 'When will feature XY be available?',
        answer: 'Please have a look at the GitHub issues tagged with "enhancement". Issues should have a planed milestone that gives you some info on when it will be available. Should you miss that feature please create a new Issue to let me know about it.'
    }
];
