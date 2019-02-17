export default {
    layout: {
        background: '#FF0F0F0F',
        opacity: 0.85,
        colors: {
            bestSegment: '#FFD8AF1F',
            aheadGaining: '#FF00CC36',
            aheadLosing: '#FF52CC73',
            behindGaining: '#FFCC5C52',
            behindLosing: '#FFCC1200',
            text: '#FFFFFFFF',
            textOutlines: '#0',
            notRunning: '#FFACACAC',
            personalBest: '#FF16A6FF',
            paused: '#FF7A7A7A',
            thinSeperators: '#3FFFFFF',
            seperator: '#24FFFFFF',
            shadows: '#80000000',
        }
    },
    title: {
        background: {
            color1: '#FF2A2A2A',
            color2: '#FF131313',
            direction: 'vertical'
        },
        showGameName: true,
        showCategoryName: true,
        showFinishedRunCount: false,
        showAttemptCount: true,
        displayGameIcon: true,
        displayGameAndCategoryInSingleLine: false,
        additionalCategoryInfo: {
            showRegion: false,
            showPlatform: true
        }
    },
    splits: {
        background: {
            color1: '#FFFFFF',
            color2: '#09FFFFFF',
            type: 'alternating'
        },
        maxSplits: 16,
        upcomingSplits: 4,
        showThinSeperators: true,
        showSeparatorBeforeLastSplit: true,
        alwaysShowLastSplit: true,
        fillWithBlankSpaceIfNotEnoughSplits: false,
        lockLastSplitToBottom: false,
        displayTwoRows: false,
        splitHeight: 24,
        currentSplitBackground: {
            color1: '#FF3373F4',
            color2: '#FF153574',
            direction: 'vertical'
        }
    },
    application: {
        livesplitUpdate: 'https://github.com/LiveSplit/LiveSplit/releases/latest',
        port: 16834,
    }
};
