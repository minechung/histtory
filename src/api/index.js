import axios from "axios";
var url='https://007.czgame.xyz:2087/api/game/record'
// var url = 'https://ttt.czgame.xyz:2087/api/game'
export function getList(data) {
    return axios({
        url: url + '/record',
        method: 'POST',
        data: data
    })
}


export function recordSum(data) {
    return axios({
        url: url + '/recordSum',
        method: 'POST',
        data: data
    })
}