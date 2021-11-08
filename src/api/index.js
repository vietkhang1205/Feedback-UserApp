import axios from "axios";

const BASE_URL = 'https://localhost:44354/api/';

export const ENDPIONTS = {
    LOCATION: 'Locations',
    DEVICE: 'Devices',
    FEEDBACK: 'Feedbacks',
    NULL: ''
}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + endpoint + '/';
    return {
        fetchAll: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        fetchByUserId: id =>axios.get(url+id+'/Feedback'),
        create: newRecord => axios.post(url, newRecord),
        update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
        delete: id => axios.delete(url + id),
        fetchDevice: id =>axios.get(url+id+'/Devices?locationId='+id)
    }
}