// http://860d8d30.ngrok.io/api/training/videos?category_id=-1

import axios from './interceptor'
const trainingRoute = '/api/training/videos?category_id=-1';

export default ApiTraining = {
    getVideos() {
        return  axios.get(trainingRoute);
    }
}
