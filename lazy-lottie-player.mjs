// language=CSS
const getStyles = lottiePlayerTag => `
    ${lottiePlayerTag} {
        display: none;
        height: 100%;
        width: 100%;
    }
`

export class LazyLottiePlayer extends HTMLElement {

    static lottiePlayerTag = "lottie-player"
    static lottiePlayerURL = "https://unpkg.com/@lottiefiles/lottie-player@2.0.2/dist/lottie-player.js"

    shadowRoot = this.attachShadow({mode: "open"})
    activationPromise = new Promise(resolve => this.resolveActivation = resolve);

    preloader = document.createElement("slot")
    lottiePlayer = document.createElement(this.constructor.lottiePlayerTag)
    styles = Object.assign(document.createElement("style"), {
        innerHTML: getStyles(this.constructor.lottiePlayerTag)
    })

    static define(tag = "lazy-lottie-player") {
        customElements.define(tag, this)
    }

    connectedCallback() {
        this.lottiePlayer.addEventListener("ready", this.activate.bind(this))
        this.lottiePlayer.setAttribute("src", this.getAttribute("src"));
        this.lottiePlayer.toggleAttribute("disableCheck", true)
        this.shadowRoot.replaceChildren(
            this.lottiePlayer,
            this.preloader,
            this.styles,
        )
    }

    prepare() {
        const {lottiePlayerTag} = this.constructor;
        if (!customElements.get(lottiePlayerTag)) void import(this.constructor.lottiePlayerURL);
        return this.activationPromise;
    }

    activate() {
        this.active = true
        this.preloader.style.display = "none"
        this.lottiePlayer.style.display = "revert"
        this.resolveActivation()
    }

    async play() {
        this.paused = false;
        if (!this.active) await this.prepare();
        if (this.paused) return;
        this.lottiePlayer.setLooping(true);
        this.lottiePlayer.play();
    }

    pause() {
        this.paused = true;
        if (!this.active) return;
        this.lottiePlayer.setLooping(false);
    }

}

LazyLottiePlayer.define()
