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

    activationPromise = new Promise(resolve => this.resolveActivation = resolve);

    shadowRoot = this.attachShadow({mode: "open"})

    preloader = document.createElement("slot")
    lottiePlayer = document.createElement(this.constructor.lottiePlayerTag)
    styles = Object.assign(document.createElement("style"), {
        innerHTML: getStyles(this.constructor.lottiePlayerTag)
    })

    static loadLottiePlayer = () => import(this.lottiePlayerURL)

    static define(tag = "lazy-lottie-player") {
        customElements.define(tag, this)
    }

    connectedCallback() {
        this.lottiePlayer.setAttribute("src", this.getAttribute("src"));
        this.lottiePlayer.addEventListener("ready", this.activate.bind(this))
        this.lottiePlayer.toggleAttribute("disableCheck", true)
        this.shadowRoot.replaceChildren(
            this.lottiePlayer,
            this.preloader,
            this.styles,
        )
    }

    prepare() {
        const {lottiePlayerTag} = this.constructor;
        this.lottiePlayer.setAttribute("src", this.getAttribute("src"));
        if (!customElements.get(lottiePlayerTag)) void this.constructor.loadLottiePlayer();
        return this.activationPromise;
    }

    activate() {
        this.active = true
        this.preloader.style.display = "none"
        this.lottiePlayer.style.display = "revert"
        this.resolveActivation()
    }

    async play() {
        if (!this.active) await this.prepare();
        this.lottiePlayer.setLooping(true);
        this.lottiePlayer.play();
    }

    pause() {
        if (this.active) this.lottiePlayer.setLooping(false);
    }

}

LazyLottiePlayer.define()
