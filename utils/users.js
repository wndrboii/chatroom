const { db } = require('./firebaseConfig');
const { ref, set, get, remove, query, orderByChild, equalTo } = require("firebase/database");

// Join user to chat
async function userJoin(id, username, room) {
    const userRef = ref(db, `users/${id}`);
    const user = { id, username, room };
    await set(userRef, user);
    return user;
}

// Get the current user
async function getCurrentUser(id) {
    const userRef = ref(db, `users/${id}`);
    const data = await get(userRef);
    return data.exists() ? data.val() : null;
}

// User leave chat
async function userLeave(id) {
    const userRef = ref(db, `users/${id}`);
    const data = await get(userRef);
    const user = data.exists() ? data.val() : null;
    if (user) {
        await remove(userRef);
        return user;
    }
}

// Get room users
async function getRoomUsers(room) {
    const usersRef = ref(db, 'users');
    const roomQuery = query(usersRef, orderByChild('room'), equalTo(room));
    const data = await get(roomQuery);
    const users = [];
    data.forEach(child => {
        users.push(child.val());
    });
    return users;
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
