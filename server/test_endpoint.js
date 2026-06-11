const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://localhost:3000/api/history-book/update-status-book', {
            idHistory: 'dummy',
            status: 'picked_up',
            productId: 'dummy',
            userId: 'dummy'
        });
        console.log(res.data);
    } catch (e) {
        if (e.response) {
            console.log(e.response.data);
        } else {
            console.log(e.message);
        }
    }
}
test();
