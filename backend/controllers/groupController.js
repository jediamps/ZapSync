const User = require('../models/User');
const Group = require('../models/Group');

// @desc    Get groups available to join
// @route   GET /api/groups/available
// @access  Private
exports.getAvailableGroups = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const groups = await Group.find({
        _id: { $nin: user.groups },
        $or: [
          { joinLink: { $exists: true } },
          { allowSelfJoin: true }
        ]
      }).populate('createdBy', 'fullname email');
      
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // @desc    Join group with token
  // @route   POST /api/groups/join
  // @access  Private
  exports.joinWithToken = async (req, res) => {
    try {
      const { token } = req.body;
      const group = await Group.findOne({ joinLink: token });
      
      if (!group) {
        return res.status(404).json({ error: 'Invalid join link' });
      }
  
      // Check if already a member
      const user = await User.findById(req.user.id);
      if (user.groups.includes(group._id)) {
        return res.status(400).json({ error: 'Already a member of this group' });
      }
  
      // Add user to group
      group.members.push(req.user.id);
      await group.save();
  
      // Add group to user's groups
      user.groups.push(group._id);
      await user.save();
  
      res.json({ success: true, group });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };