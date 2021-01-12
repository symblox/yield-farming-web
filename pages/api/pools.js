export default function handler(req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ pool_identifier: 'syx/vlx', liquidity_locked: 123456, apy: 214.3 }))
  }