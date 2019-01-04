const aj = this;

let imagePath = '/sdcard/scripts/images/';
let imageCache = {};

function tryFindImages(images) {
    // let best = aj.images.matchTemplate(image, template).best();
    // if (best) {
    //     return {
    //         x: best.point.x,
    //         y: best.point.y,
    //         w: template.getWidth(),
    //         h: template.getHeight(),
    //         s: best.similarity,
    //     };
    // }
    let screen = aj.captureScreen();
    let threshold = 1;
    while (threshold > 0.5) {
        for (let image of images) {
            try {
                if (typeof (image) == 'string') {
                    let name = image;
                    image = imageCache[name];
                    if (!image) {
                        let image = aj.images.read(imagePath + name + '.png'); // TODO
                        if (image) {
                            imageCache[name] = image;
                        }
                    }
                }
                let p = aj.findImage(screen, image, {
                    threshold: threshold,
                });
                return {
                    x: p.x,
                    y: p.y,
                    w: image.getWidth(),
                    h: image.getHeight(),
                    s: threshold,
                    i: image,
                };
                // eslint-disable-next-line no-empty
            } catch (e) {}
        }
        threshold -= 0.05;
    }
}

function tryClick(result, interval) {
    if (result) {
        if (interval) {
            aj.sleep(interval);
        }
        aj.click(result.x + result.w / 2, result.y + result.h / 2);
        return true;
    }
}

function waitForImage(image, timeout) {
    timeout = timeout || 5000;
    let time = new Date(Date.now() + timeout);
    while (Date.now() < time) {
        let result = tryFindImages([image]);
        if (result) {
            return result;
        }
    }
}

function waitAndClick(image, timeout, interval) {
    return tryClick(waitForImage(image, timeout), interval);
}

function simulate(func, times, interval) {
    times = times || 1;
    interval = interval || 500;
    for (let i = 0; i < times; i++) {
        func();
        aj.sleep(interval);
    }
}

function swipeUp(times, interval) {
    simulate(() => {
        aj.swipe(540, 960, 540, 660, 250);
    }, times, interval);
}

function swipeDown(times, interval) {
    simulate(() => {
        aj.swipe(540, 960, 540, 1260, 250);
    }, times, interval);
}

function tap(times, interval) {
    simulate(() => {
        aj.click(560, 960);
    }, times, interval);
}

aj.setScreenMetrics(1080, 1920);
aj.auto.waitFor();
if (!aj.requestScreenCapture()) {
    aj.exit();
}

if (!(aj.launchApp('失落的龙约') || aj.launchApp('Dragalia'))) {
    aj.exit();
}

let running = false;
aj.events.observeKey();
aj.events.onKeyDown('back', (keyCode, event) => {
    running = false;
    aj.toast('stopping');
    aj.exit();
});
aj.threads.start(function () {
    running = true;
    let times = 10;
    while (running && times-- > 0) {
        if (waitAndClick('raid', 30000, 2000) && waitAndClick('raid-beginner') && waitAndClick('create-private-room')) {
            if (waitAndClick('begin-quest', 30000, 2000) && waitAndClick('begin') && waitAndClick('red-packet', 60000, 2000)) {
                aj.toast('start');
                swipeUp(12);
                swipeDown(2);
                tap(15);
                while (running) {
                    swipeUp(5);
                    swipeDown(3);
                    tap(10);
                    if (waitAndClick('continue')) {
                        break;
                    }
                }
            }
        }
        aj.toast('end');
    }
    aj.toast('stopped');
});
aj.toast('press back to stop');