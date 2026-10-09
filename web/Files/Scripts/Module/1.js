import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../config.js';

const supabase = createClient(supabaseUrl, supabaseKey);

let started = false;

async function updatehomework() {
    // Hausaufgaben aus Supabase laden
    const { data, error } = await supabase
        .from('general')
        .select('*')
        .eq('id', 'general')
        .single();
    if (error || !data) {
        await supabase.from('Fehlerberichte').insert([{
            typ: 'Technischer Fehler',
            fehler: error.message || 'Unbekannter Fehler',
            stacktrace: error.stack || null,
            zeit: new Date().toISOString(),
            userAgent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent
        }]);
        return null;
    }
    return data;
}

async function update() {
    updatehomework().then(data => {
        if (data) {
            const loggedInUser = localStorage.getItem("loggedInUser_Paluss1122_sdb");
            let showMaintenance = false;
            const active = data.Wartungsarbeiten;

            if (loggedInUser) {
                try {
                    const user = JSON.parse(loggedInUser);
                    if (user.username === "Paluss1122" && active) {
                        showMaintenance = true;
                    }
                } catch (e) {
                    console.error("Fehler beim Parsen des Benutzers:", e);
                }
            } else {
                showMaintenance = active;
            }

            document.getElementById("maintenance-frame").style.display = showMaintenance ? "flex" : "none";
            document.getElementById("time-ws").innerText = data.WartungsarbeitenZeit;
            document.getElementById("why-ws").innerText = data.Grund;
            document.title = active ? `Wartungsarbeiten (bis ${data.WartungsarbeitenZeit})` : "Dashboard";
            if (!started == true) {
                document.getElementById('version').textContent = data.Version;
            }

            started = true;

            if (!data.Ende === true) {
                const auszublendendeIDs = [
                    "english",
                    "access-all",
                    "access-others",
                    "maths",
                    "access-all-maths",
                    "access-others-maths",
                    "german",
                    "access-german",
                    "homeworks",
                    "access-homework-english",
                    "access-homework-maths",
                    "access-homework-german",
                    "info-text",
                    "access-info",
                    "german-setting",
                    "maths-setting",
                    "english-setting",
                    "info-setting"
                ];
                auszublendendeIDs.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = "true";
                });
            }
        }
    });
}

window.SendAnalyticsStep = async function (action) {
    let user = null;
    window.console.log(action);
    try {
        const userStr = window.localStorage.getItem('loggedInUser_Paluss1122_sdb');
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Fehler beim Auslesen des Benutzernamens:", e);
        user = null;
    }

    // Prüfe, ob die Seite nicht lokal läuft
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    if (!isLocal) {
        try {
            const { error } = await supabase.from('analytics').insert([{
                browser: getBrowserName(),
                device: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                zeit: new Date().toISOString(),
                link: window.location.href,
                name: user && user.username ? user.username : null,
                Action: action
            }]);
            if (error) {
                await supabase.from('Fehlerberichte').insert([{
                    userAgent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                    zeit: new Date().toISOString(),
                    fehler: error.message || error
                }]);
            }
        } catch (err) {
            await supabase.from('Fehlerberichte').insert([{
                userAgent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                zeit: new Date().toISOString(),
                fehler: err.message || err
            }]);
        }
    }
}

window.onload = function () {
    let user = null;
    try {
        const userStr = window.localStorage.getItem('loggedInUser_Paluss1122_sdb');
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Fehler beim Auslesen des Benutzernamens:", e);
        user = "Fehler beim Auslesen des Benutzernamens:" + e
    }
    if (!window.location.href.startsWith("http://127.0.0.1") && !window.location.href.startsWith("https://127.0.0.1")) {
        // Analytics in Supabase speichern
        supabase.from('analytics').insert({
            browser: getBrowserName(),
            device: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
            zeit: new Date().toISOString(),
            link: window.location.href,
            name: user && user.username ? user.username : null
        }).then(({ error }) => {
            if (error) {
                supabase.from('Fehlerberichte').insert({
                    userAgent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                    zeit: new Date().toISOString(),
                    fehler: error
                })
            }
        });
    }
    if (localStorage.getItem("particles_paluss1122") === "true") {
        createParticles();
    } else if (!localStorage.getItem("particles_paluss1122")) {
        createParticles();
    }

    const backgroundcolorls = localStorage.getItem("backgroundcolor");
    changebg(backgroundcolorls);
    setCustomBgFromStorage();

    // Setze den Zustand der Checkbox basierend auf localStorage
    const animationToggle = document.getElementById("animationToggle");
    const animState = localStorage.getItem("anim_paluss1122");
    if (animState === "none") {
        animationToggle.checked = false; // Checkbox deaktiviert
    } else {
        animationToggle.checked = true; // Checkbox aktiviert
    }

    const animationToggle2 = document.getElementById("animationToggle2");
    const tutsState = localStorage.getItem("tuts_paluss1122");
    if (tutsState === "none") {
        animationToggle2.checked = false; // Checkbox deaktiviert
    } else {
        animationToggle2.checked = true; // Checkbox aktiviert
    }

    const animationToggle3 = document.getElementById("particletoggle");
    const particleState = localStorage.getItem("particles_paluss1122");
    if (particleState === "false") {
        animationToggle3.checked = false; // Checkbox deaktiviert
    } else {
        animationToggle3.checked = true; // Checkbox aktiviert
    }

    const animationToggle4 = document.getElementById("movebgtoggle");
    const movebgState = localStorage.getItem("movebg_paluss1122");
    if (movebgState === "false") {
        animationToggle4.checked = false; // Checkbox deaktiviert
    } else {
        animationToggle4.checked = true; // Checkbox aktiviert
    }

    const animationToggle5 = document.getElementById(
        "deviceinformationtoggle"
    );
    const deviceState = localStorage.getItem("device-infos");
    if (deviceState === "none") {
        animationToggle5.checked = false; // Checkbox deaktiviert
    } else {
        animationToggle5.checked = true; // Checkbox aktiviert
    }

    const animationToggle6 = document.getElementById("gameswebsitetoggle");
    const gamesState = localStorage.getItem("games-website");
    if (gamesState === "none") {
        animationToggle6.checked = false; // Checkbox deaktiviert
    } else {
        animationToggle6.checked = true; // Checkbox aktiviert
    }

    const animationToggle7 = document.getElementById("infohtmltoggle");
    const infoState = localStorage.getItem("access-info");
    if (infoState === "none") {
        animationToggle7.checked = false; // Checkbox deaktiviert
    } else {
        animationToggle7.checked = true; // Checkbox aktiviert
    }

    const animationToggle8 = document.getElementById("englishworkbooktoggle");
    const animationToggle9 = document.getElementById("mathstoggle");
    const animationToggle10 = document.getElementById("germantoggle");
    const userStr = localStorage.getItem("loggedInUser_Paluss1122_sdb");
    let is7c = false;
    if (userStr) {
        try {
            const userObj = JSON.parse(userStr);
            is7c = userObj.is7c === true;
        } catch (e) {
            is7c = false;
        }
    }

    if (animationToggle8) {
        if (is7c) {
            const accesallState = localStorage.getItem("access-all");
            animationToggle8.checked = accesallState !== "none";
        } else {
            const accesallState = localStorage.getItem("access-others");
            animationToggle8.checked = accesallState !== "none";
        }
    }

    if (animationToggle9) {
        if (is7c) {
            const accesallmathsState = localStorage.getItem("access-all-maths");
            animationToggle9.checked = accesallmathsState !== "none";
        } else {
            const accesallmathsState = localStorage.getItem(
                "access-others-maths"
            );
            animationToggle9.checked = accesallmathsState !== "none";
        }
    }

    if (animationToggle10) {
        if (is7c) {
            const accesgermanState = localStorage.getItem("access-german");
            animationToggle10.checked = accesgermanState !== "none";
        } else {
            const accesgermanState = localStorage.getItem("access-german-others");
            animationToggle10.checked = accesgermanState !== "none";
        }
    }

    const animationToggle11 = document.getElementById("transparenttoggle");
    const transparentdb = localStorage.getItem("transparentdashboard_paluss1122");
    if (transparentdb === "false") {
        animationToggle11.checked = false; // Checkbox deaktiviert
    } else if (!transparentdb) {
        animationToggle11.checked = false; // Checkbox aktiviert
    }
    else {
        animationToggle11.checked = true; // Checkbox aktiviert
    }

    const animationToggle12 = document.getElementById("latintoggle");
    const latinState = localStorage.getItem("access-latin");
    if (animationToggle12) {
        if (latinState === "none") {
            animationToggle12.checked = false; // Checkbox deaktiviert
        } else {
            animationToggle12.checked = true; // Checkbox aktiviert
        }
    }

};

// Hilfsfunktionen für Browser-Erkennung
function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    if (userAgent.includes('Trident')) return 'Internet Explorer';

    return 'Unknown';
}

update();
setInterval(update, 5000);

// Es passiert nichts, weil vermutlich entweder `acceptBtn` oder `banner` nicht im globalen Scope sind.
// Wir holen die Elemente explizit und prüfen, ob sie existieren.

