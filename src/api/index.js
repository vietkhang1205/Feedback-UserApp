import axios from "axios";

const BASE_URL = 'https://localhost:44354/api/';
const token = localStorage.getItem("token");
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
};

export const ENDPIONTS = {
    LOCATION: 'Locations',
    DEVICE: 'Devices',
    FEEDBACK: 'Feedbacks',
    NULL: ''
}

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + endpoint + '/';
    return {
        fetchAll: () => axios.get(url, { headers: headers }),
        fetchById: id => axios.get(url + id, { headers: headers }),
        fetchByUserId: id => axios.get(url + id + '/Feedback', { headers: headers }),
        create: newRecord => axios.post(url, newRecord, { headers: headers }),
        update: (id, updatedRecord) => axios.put(url + id, updatedRecord, { headers: headers }),
        delete: id => axios.delete(url + id, { headers: headers }),
        fetchListDeviceById: id => axios.get(url + id + '/Devices?locationId=' + id, { headers: headers })
    }
}
// export const callAPI = () => {
//     return fetch(BASE_URL + ENDPIONTS.LOCATION, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//     }).then(response => {
//         return response.json();
//     });
// }