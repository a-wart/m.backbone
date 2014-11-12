express      = require "express"
path         = require "path"
bodyParser   = require "body-parser"
serveStatic  = require "serve-static"
_            = require 'lodash'
needle       = require 'needle'
cookieParser = require 'cookie-parser'

app              = express()
jsonParser       = bodyParser.json()
urlencodedParser = bodyParser.urlencoded(extended: false)

app.use(cookieParser())

sendRequest = (req, callback) ->
  params = req.body
  yasenHost = 'http://yasen.aviasales.ru/adaptors/chains/jetradar_rt_search_native_format'
  parseSegment = (segment) ->
    new_segment =
      date: (new Date(segment.date)).toISOString().split('T')[0]
      origin: segment.origin.iata
      destination: segment.destination.iata
    return new_segment
  data =
    trip_class: params.trip_class or 'Y'
    with_request: params.with_request or true
    internal: params.internal or false
    locale: params.locale or 'en'
    segments: parseSegment(segment) for segment in params.segments
    passengers:
      adults: params.passengers.adults or 1
      children: params.passengers.children or 0
      infants: params.passengers.infants or 0
    marker: req.cookies.marker or 'direct'
    auid: req.cookies.auid or ''
    _ga: req.cookies._ga or ''
  needle.request 'post', yasenHost, data, {json: true}, (err, response) ->
    callback response.body if response.statusCode is 200
    callback '' if err

transforTickets = (raw_tickets) ->
  tickets = _.map raw_tickets, (tickets_part) ->
    if tickets_part.proposals?.length > 0
      _.map tickets_part.proposals, (proposal) ->
        deeplink = "/searches/#{tickets_part.search_id}/clicks/#{proposal.terms[_.keys(proposal.terms)[0]].url}?gate_id=#{_.keys(proposal.terms)[0]}&gate_currency=#{proposal.terms[_.keys(proposal.terms)[0]].currency}"
        ticket =
          price: proposal.terms[_.keys(proposal.terms)[0]].unified_price
          flights: proposal.segment
          deeplink: deeplink
  return _.flatten _.filter tickets, (ticket) -> ticket? and ticket.length > 0


fetchTickets = (meta, callback) ->
  yasenHost = 'http://yasen.aviasales.ru/searches_results_united'
  needle.request 'get', meta, (err, resp) ->
    callback response.body if response.statusCode is 200
    callback '' if err

app.get '/places', urlencodedParser, (req, res) ->
  jetradarHost = 'http://www.jetradar.com/autocomplete/places'
  needle.request 'get', jetradarHost, req.query, (err, response) ->
    return res.send(JSON.stringify(response.body)) if response.statusCode is 200
    return res.send('')

app.get '/searches/:search_id/clicks/:click_id', (req, res) ->
  url = "http://yasen.aviasales.ru/searches/#{req.params.search_id}/order_urls/#{req.params.click_id}"
  needle.request 'get', url, {}, (err, response) ->
    res.redirect response.body.url if response.statusCode is 200

app.get '/searches/:id', (req, res) ->
  search_id = req.params.id
  res.redirect('/')

app.get '/searches', urlencodedParser, (req, res) ->
  yasenHost = 'http://yasen.aviasales.ru/searches_results_united'
  meta =
    uuid: req.query.uuid
  needle.request 'get', yasenHost, meta, {timeout: 10000}, (err, response) ->
    tickets = transforTickets response.body if response?.statusCode is 200
    return '' if err
    res.json tickets

app.post "/searches", jsonParser, (req, res) ->
  return res.sendStatus(400) unless req.body
  url = ''
  round_trip = false
  prevSegment = undefined
  parseDate = (date) ->
    date = new Date(date)
    day = date.getDay()
    month = date.getMonth()
    "#{(if day < 10 then '0' else '') + day}#{(if month < 10 then '0' else '') + month}"
  if req.body.segments.length is 2 and _.isEqual req.body.segments[0].destination, req.body.segments[1].origin
    round_trip = true
  for index, segment of req.body.segments
    unless (round_trip and (+index is 1)) or _.isEqual(prevSegment?.destination, segment.origin)
      url += (if segment.origin.type is 'city' then 'C' else 'A')
      url += segment.origin.iata
    url += parseDate(segment.date)
    unless round_trip and +index is 1
      url += (if segment.destination.type is 'city' then 'C' else 'A')
      url += segment.destination.iata
    prevSegment = segment
  url += req.body.trip_class or 'Y'
  url += req.body.passengers?.adults or '1'
  url += req.body.passengers?.children or ''
  url += req.body.passengers?.infants or ''
  req.body.url = '/searches/' + url
  sendRequest req, (resp) ->
    req.body.response = resp
    res.json req.body

app.use serveStatic(__dirname)

app.on 'uncaughtException', (event) ->
  console.log 'Sorry mista, shit happens.'

app.listen 3000, ->
  console.log "Express server listening on port 3000"
  return
