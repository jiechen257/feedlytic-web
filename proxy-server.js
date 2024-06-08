const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const app = express()

app.use(
  '/proxy',
  createProxyMiddleware({
    target: '',
    changeOrigin: true,
    pathRewrite: {
      '^/proxy': '', // remove /proxy from the start of the request path
    },
    router: (req) => {
      const url = new URL(req.url.replace('/proxy/', ''))
      console.log('url---', url)
      return `${url.protocol}//${url.host}`
    },
    onProxyReq: (proxyReq, req, res) => {
      const url = new URL(req.url.replace('/proxy/', ''))
      proxyReq.path = url.pathname + url.search
    },
  }),
)

app.listen(3001, () => {
  console.log('Proxy server is running on http://localhost:3001')
})
