<template>
    <div class="navbar">
        <img src="../assets/LOGOx.png" alt="logoLovel">
        <ul style="display: none;">
            <li> <router-link :to="{name: 'home'}">accueil</router-link></li>
            <li> <a>blog</a> </li>
            <li> <router-link :to="{name: 'conditions'}">cgu</router-link></li>
            <li> <a>contaaaaact</a> </li>
        </ul>
    </div>
</template>
<script>
export default {
  name: 'Navbar'
}
</script>
<style>
/***** MOBILE *****/
.navbar {
    display: flex;
    justify-content: space-between;
    width: 85%;
    margin: 20px auto 5px;
}

.navbar ul {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    display: none;
}

.navbar ul li {
    margin-right: 10px;
    margin-bottom: 10px;
}
.navbar img {
    width: 33%;
    height: auto;
}
.burger {
    font-size: 42px;
    color: #707070;
    margin-right: 13px;;
}
/******** DESKTOP ***********/
@media screen and (min-width: 900px) {
    /* NAVBAR */
    .navbar {
        display: flex;
        justify-content: flex-start;
        width: 85%;
        margin: 20px auto 5px;
        max-width: 1350px;
    }
    .navbar ul {
        color: #27F2CB;
        font-family: 'Barlow Semi Condensed', sans-serif;
        text-transform: uppercase;
        font-weight: bolder;
        font-size: 20px;
        display: flex;
        align-self: center;
        width: 30%;
        justify-content: space-between;
    }
    .navbar ul li {
        display: inline;
    }
    .navbar img {
        width: 10%;
        height: auto;
    }
    .burger {
        display: none;
        font-size: 42px;
        color: #707070;
        margin-right: 13px;;
    }
}
</style>
