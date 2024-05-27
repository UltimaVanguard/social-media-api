const { User, Thought } = require('../models');

module.exports = {
    // Gets all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (err) {
            return res.status(500).json(err);
        };
    },
    // Gets a single user by id
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })

            if (!user) {
                return res.status(404).json({ message: 'No user found!' });
            };

            res.json(user);
        } catch (err) {
            return res.status(500).json(err);
        };
    },
    // Creates a new User
    async createUser(req, res) {
        try {
          const user = await User.create(req.body);
          res.json(user);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    // update a user
    async updateUser(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        );
  
        if (!user) {
          return res.status(404).json({ message: 'No user found!' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // delete User and all of their Thoughts
    async deleteUser(req, res) {
        try {
          const user = await User.findOneAndDelete({ _id: req.params.userId });
    
          if (!user) {
            return res.status(404).json({ message: 'No user exists!' })
          }

          console.log(user)
          const thoughts = await Thought.deleteMany(
            { username: user.username },
          );
    
          if (!thoughts) {
            return res.status(404).json({
              message: 'User deleted, but no thoughts found',
            });
          }
    
          res.json({ message: 'User successfully deleted' });
        } catch (err) {
          res.status(500).json(err);
        }
      },
      async addFriend(req, res) {
        try {
          const user = await User.findOne({ _id: req.params.userId});

          if (!user) {
            return res.status(404).json({ message: 'No user found!'});
          };
  
          const friend = await User.findOne({ _id: req.params.friendId });
  
          if (!friend) {
            return res.status(404).json({ message: 'The person you are trying to add could not be found!'});
          }
  
          const addFriend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: friend._id }},
            { new: true }
          );

          res.status(200).json(addFriend);
        } catch (err) {
          res.status(500).json(err);
        };
      },
      async removeFriend(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { new: true }
          );

          if (!user) {
            return res.status(404).json({ message: 'No user found!' })
          }

          res.status(200).json({ message: 'Friend successfully removed!'});
        } catch (err) {
          res.status(500).json(err);
        };
      },
}