<template>
<div class="social">
    <div class="social-container">
        <p class="phone-display">
            Nos <span class="subtext">réseaux sociaux</span> !
        </p>
        <p class="desk-display">
            Tu peux suivre notre actualité sur les réseaux sociaux !
        </p>
        <div class="icons">
            <a href="https://www.instagram.com/lovel_app/?hl=fr">
                <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/lovelapplication/">
                <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com/lovel_app">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCGIs_LP1meTneNEWIEVqm1Q">
                <i class="fab fa-youtube"></i>
            </a>
            <a href="https://www.pinterest.fr/Lovelapp/">
                <i class="fab fa-pinterest"></i>
            </a>
        </div>
        <p class="phone-display">
            Notre blog<br><strong>Dating !</strong>
        </p>
        <p class="desk-display">
            On écrit également des articles intéressants sur le Dating !
        </p>
    </div>
    <h2>
        <span class="bold-text">Love<br>B</span>log
    </h2>
</div>
</template>

<script>
  export default {
    name: 'social'
  }
</script>

<style scoped>
.social {
    color: #9618F3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;    
    width: 100%;
    font-size: 52px;
}

.bold-text {
    font-weight: 1000;
}

.icons {
    display: flex;
    justify-content: space-around;
    width: 80%;
    color: #C9C9C9;
    font-size: 50px;
    margin: 0 auto;
}

.social h2 {
    /* font-family: 'Barlow Semi Condensed';
    font-size: 72px; */
    font: italic 72px 'Barlow Semi Condensed', sans-serif;
    line-height: 61px;
    background-color: #A02FF4;
    text-align: left;
    color: white;
    border-radius: 27px;
    padding: 55px 35px;
    margin-top: 0;
}

.social-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
@media screen and (min-width: 900px) {
    .social {
        font-size: 39px;
        padding-top: 25px;
    }

    .social-container {
        width: 62%;
    }

    .icons {
        font-size: 75px;
    }
}
</style>