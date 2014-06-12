analytics_interceptor
=====================

App that blocks all calls to analytics platform and shows you what it would send. Supports Mixpanel, KissMetrics, Google Analytics.
This is a chrome extension that will block any calls to client side tracking libraries such as Google Analytics, Mixpanel, Segment.io and KissMetrics and it alerts you instead.

Why? 
There are a couple of use cases. 

1.) You want to see what your competitor is tracking on their website.
2.) You don't want to give any tracking information to the website.
3.) You want to troubleshoot your own website as to what you are sending to these analytics libraries.

How does it work?
It will scan through the globals that are defined by the client libraries and inject a stub version that sends you a notification every time the track is being called.

Which platforms does it support currently?
Currenty it supports Google Analytics (analytics.js and ga.js), Mixpanel, Segment.io and KissMetrics.

Need a client side platform integrated? Sure fork it and send me a pull request!
