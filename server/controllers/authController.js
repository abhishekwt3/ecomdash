import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  const { name, email, password, workspaceName } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });

    // Create default workspace
    const workspace = await Workspace.create({
      name: workspaceName || `${name}'s Workspace`,
      owner: user._id,
      members: [{ user: user._id, role: 'admin' }]
    });

    user.workspaces.push(workspace._id);
    user.activeWorkspace = workspace._id;
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      activeWorkspace: workspace,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('activeWorkspace');

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          activeWorkspace: user.activeWorkspace
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('activeWorkspace');
  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      activeWorkspace: user.activeWorkspace
    }
  });
};