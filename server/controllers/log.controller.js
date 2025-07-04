import Log from '../models/log.model.js'

export const getRecentLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('user', 'username email')    
      .populate('task', 'title status')      

    res.status(200).json(logs)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch recent logs',
      error: error.message
    })
  }
}
