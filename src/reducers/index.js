import {
    combineReducers
} from 'redux';
import {
    reducer as formReducer
} from "redux-form";
import auth from './auth';
import shared from './shared';
import user from './user';
import standard_form from './standard_form'
import equipment from './equipment';
import categories from './categories';
import models from './models';

export default combineReducers({
    form: formReducer,
    auth: auth,
    shared: shared,
    user: user,
    standard_form,
    equipment: equipment,
    catgories: categories,
    models: models
});
