
# websocket_webcam

*Simplest possible implementation of a browser to browser low latency webcam using getUserMedia, mediaRecorder, and websockets*

This is a work in progress. As designed, it will work only on the same LAN; however, if you're prepared to upgrade to secure websockets (wss) and set up appropriate port forwarding / ssl for the websocket server it can be made to work over the web.

## how to set up

The server.js file should run under node.js (for example on a Pi using PM2 to keep it alive). You can see its dependencies in the 'includes' list at the start of the file. To connect to it the browser player and cameras need to know its internal IP. This can be achieved by setting a static IP for the server host in your router, or (as done here) using a third-party application to store the IP for access from the browser clients. In this implementation that's done by deploying a Google apps script file. My example is also here for reference (IPsaverPI.js) - if you want to copy this approach you will need to deploy that as a web app and copy the deployment url into line 10 of the server.js file. 

If that's too complicated, and you just want to hard-code the server IP into the web clients, you can skip the Apps Script deployment and remove lines 6-29 (inclusive) from server.js. Doing that also means the system will run on a LAN with no external web access.

## missing a few files?

The client html/js is still being tested. Check back in a few days and I'll have it all up.

## latency
Latency is really hard work to deal with. Delays in stream processing accumulate over time and the media element insists on playing every single blob. There's a system included here to manage that, but any/all better solutions are gratefully received!
