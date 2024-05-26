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
            const user = User.findOne({ _id: req.params.userId })
                .select('-__v')
                .lean();

            if (!user) {
                return res.status(404).json({ message: 'No user found!' });
            };

            res.json({user});
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
          const user = await User.findOneAndRemove({ _id: req.params.userId });
    
          if (!user) {
            return res.status(404).json({ message: 'No user exists!' })
          }
          console.log(UserActivation)
          const thought = '';
        //   const thought = await Thought.findAndDelete(
        //     { students: req.params.studentId },
        //     { $pull: { students: req.params.studentId } },
        //     { new: true }
        //   );
    
          if (!thought) {
            return res.status(404).json({
              message: 'User deleted, but no thoughts found',
            });
          }
    
          res.json({ message: 'User successfully deleted' });
        } catch (err) {
          res.status(500).json(err);
        }
      },
}