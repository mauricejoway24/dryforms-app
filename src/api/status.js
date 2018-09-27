import axios from './interceptor';
const statusResource = '/api/statuses';

export default {
    index() {
        return axios.get(statusResource);
    }
}
