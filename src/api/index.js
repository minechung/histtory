import axios from "axios";
export function getList(data) {
    return axios({
        url: 'https://ttt.czgame.xyz:2087/api/game/record',
        method: 'POST',
        data: data
    })
}