const { Thought, User } = require('../models');

module.exports = {
    // Gets all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            return res.json(thoughts);
        } catch (err) {
            return res.status(500).json(err);
        };
    },
    // Gets a single thought by id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v')
                .lean();

            if (!thought) {
                return res.status(404).json({ message: 'No thought found!' });
            };

            res.json({thought});
        } catch (err) {
            return res.status(500).json(err);
        };
    },
    // Creates a new Thought
    async createThought(req, res) {
        try {
          const thought = await Thought.create(req.body);
          const user = await User.findOneAndUpdate(
            { username: req.body.username },
            { $addToSet: { thoughts: thought._id }},
            { new: true }
          );

          if (!user) {
            return res.status(404).json({
                message: 'Thought created, but no user found!'
            })
          }
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    // update a user
    async updateThought(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought found!' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // delete a single Thought by id
    async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought exists!' })
          }
          
          const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId},
            { $pull: { thoughts: req.params.thoughtId }},
            { new: true }
          );

          if (!user) {
            return res.status(404).json({
                message: 'Thought deleted but no user found!',
            });
          }

          res.json({ message: 'Thought successfully deleted' });
        } catch (err) {
          res.status(500).json(err);
        }
      },
    // Add a reaction to a thought
    async addReaction(req, res) {
        try {
            console.log('You are adding a reaction');
            console.log(req.body);
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found!' })
        }

        res.json(thought);
        } catch (err) {
        res.status(500).json(err);
        }
    },
    // Remove assignment from a student
    async deleteReaction(req, res) {
        try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId }}},
            { new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found!' });
        }

        res.json({ message: 'Reaction successfully deleted!' });
        } catch (err) {
        res.status(500).json(err);
        }
    },
}