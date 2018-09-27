import {
    FETCH_USER,
    FETCH_COMPANY,
    FETCH_SUBSCRIPTION
} from '../actions/actionTypes'

const initialState = {
    user: {},
    company: {},
    is_subscribed: false,
    is_grace_period: false
}

export default function user(state = initialState, action) {
    console.log(action);
    switch (action.type) {
        case FETCH_USER:
            return Object.assign({}, state, {
                user: action.user
            });
        case FETCH_COMPANY:
            return Object.assign({}, state, {
                company: action.company
            });
        case FETCH_SUBSCRIPTION:
            return Object.assign({}, state, {
                is_subscribed: action.subscription.isSubscribed,
                is_grace_period: action.subscription.isGracePeriod
            });
        default:
            return state;
    }
}