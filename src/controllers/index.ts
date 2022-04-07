import { getBotInfo } from './info'
import { addVideoToRender } from './api'
import { getRecentlyUploadedVideos } from './video'
import {
    getServersStatus,
    startRenderingForcibly
} from './server'


export default {
    bot: {
        getServersStatus,
        startRenderingForcibly,
        getRecentlyUploadedVideos,
        getBotInfo,
    },
    api: {
        addVideoToRender
    },

}