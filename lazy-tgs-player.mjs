import {LazyLottiePlayer} from "./lazy-lottie-player.mjs";

export class LazyTGSPlayer extends LazyLottiePlayer {

    static lottiePlayerTag = "tgs-player"
    static lottiePlayerURL = "https://unpkg.com/@lottiefiles/lottie-player@2.0.2/dist/tgs-player.js"

    static define(tag = "lazy-tgs-player") {
        customElements.define(tag, this)
    }

}

LazyTGSPlayer.define()
