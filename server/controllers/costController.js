import Cost from '../models/Cost.js';

export const getCosts = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    const costs = await Cost.find({ workspace: workspaceId }).sort({ date: -1 });
    res.json(costs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCost = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    const { category, name, amount, frequency } = req.body;

    const cost = await Cost.create({
      workspace: workspaceId,
      category,
      name,
      amount,
      frequency
    });

    res.status(201).json(cost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCost = async (req, res) => {
  try {
    const { id } = req.params;
    await Cost.findByIdAndDelete(id);
    res.json({ message: 'Cost removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};