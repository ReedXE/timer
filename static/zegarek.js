function Boss(id, card) {
    this.ID = id;
    this.name = bossNames[0];
    this.color = 100;

    this.startTime = respawnTimes[0];
    this.time = this.startTime;

    this.enabled = false;

    this.timerSpan = $(card).find(".timer");
    this.nameSpan = $(card).find(".bossName");


    this.toggle = function () {
        this.enabled = !this.enabled;
    };

    this.reset = function () {
        this.enabled = false;
        this.time = this.startTime;
        this.timerSpan.text(this.convert());
        this.nameSpan.text(this.name);
    };

    this.run = function () {
        if (this.enabled) {
            this.color = (this.time / this.startTime) * 100;
            if (this.time > 0) {
                this.time--;
                this.timerSpan.text(this.convert());
                let hsltext = "hsl(" + this.color + ",75%,50%)";
                this.timerSpan.css("color", hsltext)
            } else {
                this.time = this.startTime;
            }
            if (this.time === 120) {
                this.notify();
            }
        }
    };

    this.convert = function () {
        let mins = Math.floor(this.time / 60);
        let secs = this.time % 60;

        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        return mins + ":" + secs
    };

    this.notify = function () {
        if (allowNotifiaiotns) {
            let options = {
                icon: 'static/p1xel00.png'
            };
            let notification = new Notification(this.name + " CH" + (this.ID + 1) + " za 2 minuty !", options);
            let audio = new Audio("static/fbi-open-up-sfx.mp3");
			audio.volume = 0.55
            audio.play();
        }
    }
}
let bossList = [];
let toggleButtons = [];
let resetButtons = [];
let respawnTimes = [
2 * 60 + 2, //test
undefined, // napis bossy
30 * 60, //dolina
30 * 60, //pustynia
undefined, // napis małpy
15 * 60,// skalista małpa
20 * 60, // chodząca małpa
30 * 60, // lord małp
undefined, // napis kończący małpy
30 * 60, // góra sohan
undefined, // piekło
30 * 60, // świątynia hwang
120 * 60, // red las
360 * 60, // red las legenda
35 * 60, // loch v2
480 * 60, // grota av1 legenda
180 * 60, // grota av2 huashin
180 * 60, // grota av2 yonghan
180 * 60, // mapa 90
480 * 60, // mapa 90 Legenda
180 * 60,// mapa 100
undefined,// napis metiny
undefined,// dolina Metin
undefined,// pustynia metin
undefined,// napis kraina małp
10 * 60,// łatwy metin małp
15 * 60,// metin małp
20 * 60,// silny metin małp
undefined,// napis kończący małpy
undefined,// góra sohan Metin
undefined,// piekło Metin
25 * 60, // świątynia Metin
undefined, // red las Metin
undefined, // loch v2 Metin
undefined, // grota av2 Metin
undefined, // mapa 90 Metin
undefined  // mapa 100 Metin
];
let bossNames = [
 "Test dzwieku i powiadomienia 2 min przed",
 undefined,
 "Dolina",
 "Pustynia",
 undefined,
 "Skalista Małpa",
 "Chodząca Małpa",
 "Lord Małp",
 undefined,
 "Góra Sohan",
 "Piekło",
 "Świątynia hwang",
 "Red las",
 "Red las (LEGENDA)",
 "Loch V2",
 "Grota AV1 (LEGENDA)",
 "Grota AV2 Generał Huashin(Losowy resp)",
 "Grota AV2 Generał Yonghan",
 "Mapa 90",
 "Mapa 90 (LEGENDA)",
 "Mapa 100",
 undefined, // napis metiny
 "Dolina Metin",
 "Pustynia Metin",
 undefined, // kraina małp napis
 "Łatwy Metin Małp",
 "Metin Małp",
 "Silny Metin Małp",
 undefined, // kraina małp napis
 "Góra Sohan Metin",
 "Piekło Metin",
 "Świątynia hwang Metin",
 "Red las Metin",
 "Loch V2 Metin",
 "Grota AV2 Metin",
 "Mapa 90 Metin",
 "Mapa 100 Metin"
 ];
let allowNotifiaiotns = true;

for (let i = 0; i < $(".boss").length; i++) {
    let current = $(".boss")[i];
    let boss = new Boss(i, current);
    boss.reset();
    bossList.push(boss);

    let onButton = $(current).find(".btnon");
    toggleButtons.push(onButton);

    let resetButton = $(current).find(".btnreset");
    resetButtons.push(resetButton);
}

for (let i = 0; i < toggleButtons.length; i++) {
    toggleButtons[i].click(function () {
        bossList[i].toggle()
    });
    resetButtons[i].click(function () {
        bossList[i].reset()
    });
}

$("#bossControl").change(function () {
    for (let i = 0; i < bossList.length; i++) {
        bossList[i].startTime = respawnTimes[this.selectedIndex];
        bossList[i].name = bossNames[this.selectedIndex];
        bossList[i].reset();
    }
});

$(".btnresetall").click(function () {
    for (let i = 0; i < bossList.length; i++) {
        bossList[i].reset();
    }
});


if (Notification.permission !== "denied" && Notification.permission !== "granted") {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
            allowNotifiaiotns = true;
        }
    });
} else if (Notification.permission === "granted") {
    allowNotifiaiotns = true;
}


function tick() {
    for (let i = 0; i < bossList.length; i++) {
        bossList[i].run();
    }

}

window.onbeforeunload = function () {
    for (let i = 0; i < bossList.length; i++) {
        if (bossList[i].enabled === true) {
            return 1
        }
    }
};

setInterval(tick, 1000);
