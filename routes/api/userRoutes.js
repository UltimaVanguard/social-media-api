const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    // addFriend,
    // deleteFriend,
} = require('../../controllers/userControllers');

router.route('/').get(getUsers).post(createUser);

router.route('/:userId').get(getSingleUser).update(updateUser).delete(deleteUser);

// router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;