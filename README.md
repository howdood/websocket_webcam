
# websocket_webcam

*Simplest possible implementation of a browser to browser low latency webcam using getUserMedia, mediaRecorder, and websockets*

As designed, this will work only to pass video between clients on the same LAN (eg as a home webcam); however, if you're prepared to upgrade to secure websockets (wss) and set up appropriate port forwarding / ssl for the websocket server it can be made to work over the web.

## what's the use case?

I've developed this to enable use of old smartphone cameras as live streaming video sources, simply because everyone seems to have a lot of them lying around and it's less of an irritation to use them than to buy extra webcams and R-Pis to stream direct.

## how to set up

The server.js file should run under node.js (for example on a Pi using PM2 to keep it alive). This has one signalling channel per camera, and another which serves to send messsages back from the 'player' client to cameras. You can see the server's dependencies in the 'includes' list at the start of the file. To connect to it the browser player and cameras need to know its internal IP. This can be achieved by setting a static IP for the server host in your router, or (as done here) using a third-party application to store the IP for access from the browser clients. In this implementation that's done by deploying a Google apps script file. My example is also here for reference (IPsaverPI.js) - if you want to copy this approach you will need to deploy that as a web app and copy the deployment url into line 10 of the server.js file, as well as into 'camera' and 'player'. 

If that's too complicated, and you just want to hard-code the server IP into the web clients, you can skip the Apps Script deployment and remove lines 6-29 (inclusive) from server.js. Doing that also means the system will run on a LAN with no external web access.

## how do I get round the issue with https / wss requirements?

Bit of a catch-22 here. The getUserMedia() security requirements mean that the camera side will work only in 'secure' contexts such as https:// hosting, while modern browsers typically disable vanilla websockets as soon as they encounter https:// environments. If you are hosting a websocket server locally (on a PC or PI without a domain associated with it) then it's a bit of a faff to go the whole hog and install ssl certs to enable secure websockets, although the changes to the server code itself are trivial. 

There are several ways round this. I've listed them in order of ascending utility, as I've found it.

* host a version of 'camera.html' on localhost for whatever devices are using it. (Localhost will run getUserMedia() even without https connection.)
* using Chrome, manually add whatever IP is hosting camera.html as an 'insecure origin treated as secure' using the method described [here] (https://stackoverflow.com/questions/40144036/javascript-getusermedia-using-chrome-with-localhost-without-https).
* using Firefox, you can manually set a flag to allow it to run vanilla websockets even in secure https:// contexts. The method is [here](https://www.damirscorner.com/blog/posts/20210528-AllowingInsecureWebsocketConnections.html). Note that the flag is missing in the mobile version but you can access it via the 'nightly' (developer) version of Firefox mobile which is available from the app store.

## latency

Latency is really hard work to deal with. Delays in stream processing accumulate over time and the media element insists on playing every single blob. There's a system included here to manage that by sending a signal back to pause broadcast from all cameras any time it looks like the player buffers are getting overloaded, which works fine as long as the packets are kept big (and hence sent less often). There's also a mechanism (commented out in the 'camera' file as-is) which enables regular pausing of the camera system to enable delayed players to catch up - at the cost of potential stutter for any players which are up to date.

Note that the *theoretical* minimum latency is set by the length of time before the media recorder outputs its first blob. However, smaller blobs come more often and require more processing power at both websocket and receiver. In the field, larger blob sizes have been found to provide lower perceived latency despite raising the theoretical latency floor. 

Any/all better solutions are gratefully received!

## memory

This seems to be an issue still - the longer the sites are open, the more memory they hog. If that's a coding error rather than an issue with the 'experimental' nature of getUserMedia(), please let me know...
