<template>
  <dialog v-el:new-game class="mdl-dialog">
    <h6 class="mdl-dialog__title">New Game</h6>
    <div class="mdl-dialog__content">
      <ul class="new-game-sizes">
        <li v-for="size in sizes" :class="{'active': $index === newGameSizeIndex}">{{size}}</li>
      </ul>
      <input v-el:size-range v-model="sizeIndex" type="range" min="0" max="2" step="1" class="mdl-slider mdl-js-slider">
    </div>
    <div class="mdl-dialog__actions">
      <button type="button" class="mdl-button" @click="doNewGame">New Game</button>
      <button type="button" class="mdl-button" @click="close">Cancel</button>
    </div>
  </dialog>
</template>

<script type="text/babel">
import pf from 'dialog-polyfill';

const SIZES = [9, 13, 19];

export default {
  data: function () {
    return {
      sizeIndex: 2
    };
  },
  computed: {
    sizes: () => SIZES
  },
  methods: {
    doNewGame: function () {
      this.$dispatch('new-game', { size: SIZES[this.sizeIndex] });
    },
    close: function () {
      this.$dispatch('cancel');
    }
  },
  ready () {
    if (!this.$els.newGame.showModal) {
      pf.registerDialog(this.$els.newGame);
    }
    componentHandler.upgradeElement(this.$els.sizeRange);
    this.$els.newGame.showModal();
  }
}
</script>

<style scoped>

.new-game-sizes {
  padding: 0;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}

.new-game-sizes li {
  display: list-item;
  list-style: none;
  width: 33%;
  height: auto;
  align-content: center;
  text-align: center;
}
</style>
