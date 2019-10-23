const request = require('request');
const parseLinkHeader = require('parse-link-header');

// fetch all within 1 mile of edinburgh
let startUrl =  'https://api.list.co.uk/v1/events?near=55.953251,-3.188267/1';
let apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjhmYTEyOGMtMzQwNC00YzVjLWEwODItMjYwZGNiNTAwODNjIiwia2V5X2lkIjoiZTliYjI3ZDgtMjEzNy00OGZhLWE4ZjgtOGQ1YzgxODNlZTU5IiwiaWF0IjoxNTcxNzU1NTg1fQ.O05N3YIO4fHGBr6VPKl-gdkhLEz3F9CexxxcSVYObV0';
let events = [];
let getPage = function(url) {
    let opts = {
        url: url,
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    };
    request(opts, function(err, res, body) {
        if(err) {
            console.log(err);
            process.exit();
        }
        body = JSON.parse(body);
        body = body.filter((e) => {
            return !e.tags.includes('film'); // ignore film
        });
        events = events.concat(body);

        var p = parseLinkHeader(res.headers['link']);
        if(res.headers['link'] && p.next && p.next.url) {
            getPage(p.next.url);
        } else {
            console.log(JSON.stringify(events, null, '  ')); // output collected events data to console
            process.exit();
        }
    });
};
getPage(startUrl);