/* globals SnapCloud, SERVER_URL, NetsBloxMorph, WorldMorph, utils */

var world;


window.onload = function () {
    world = new WorldMorph(document.getElementById('world'));
    world.worldCanvas.focus();
    var net = new NetsBloxMorph();
    net.openIn(world);
    // var timerID = setInterval(function() {
    //     // net.save();
    //     net.saveProjectToCloud('newprojecttest');
    // }, 10 * 1000);
    loop();
    window.onbeforeunload = function(evt) {
        console.log('saving');
        // net.save();
            // net.saveProjectToCloud('newprojecttest');
        // clearInterval(timerID);
        // NetsBloxMorph().save();
      // NetsBloxMorph().saveProjectToCloud('test');
      // new NetsBloxMorph().saveProjectToCloud();
      // SnapCloud
    }
    // if not logged in, make sure
    if (!SnapCloud.username) {
        // gets user info: username, email
        var getProfile = function() {
            const request = new XMLHttpRequest();
            request.open('POST', `${SERVER_URL}/api`, true);
            request.withCredentials = true;
            const data = {
              __u: "oeletest",
              __h: hex_sha512("oeletest"),
                api: false,
                return_user: true,
                silent: true
            };
            return utils.requestPromise(request, data)
                .then(function(res) {
                    if (!res.responseText) throw new Error('Access denied. You are not logged in.');
                    let user = JSON.parse(res.responseText);
                    return user;
                });
        };

        // check to see if loggedin
        getProfile().then(user => {
            // notify the client that we are logged in
            SnapCloud.username = user.username;
            SnapCloud.password = true;
        });

    }
};

function loop() {
    requestAnimationFrame(loop);
    world.doOneCycle();
}
