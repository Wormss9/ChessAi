<template>
  <div>
    <tr v-for="[i, row] in board.entries()" :key="i">
      <td
        v-for="[j, piece] in row.entries()"
        :key="j"
        :style="(i + j) % 2 ? { backgroundColor: 'grey' } : {}"
        class="square"
        :onclick="processClick([i, j])"
      >
        <p
          :style="
            savedPosition?.[0] == i && savedPosition?.[1] == j
              ? { fontWeight: 'bold' }
              : {}
          "
        >
          {{ piece?.bn }}
        </p>
      </td>
    </tr>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { createBoard, initializeBoard } from "./chess/board";
import { Position } from "./chess/types";
import "vue3-toastify/dist/index.css";
import { change } from "./chess/actions";
import { State } from "./chess/types";

export default defineComponent({
  data() {
    return {
      board: initializeBoard(createBoard()),
      turn: 0,
      savedPosition: undefined as Position | undefined,
      turns: 0,
      gameover: false,
    } as State;
  },
  methods: {
    processClick(position: Position) {
      return () => change(position, this);
    },
  },
});
</script>

<style>
@font-face {
  font-family: "Chess Merida Unicode";
  src: url("../assets/chess_merida_unicode.ttf");
}

#app {
  font-family: "Chess Merida Unicode";
}

.square {
  width: 80px;
  height: 80px;
  text-align: center;
  box-shadow: 0px 0px 0px 1px black;
  font-size: 1.6em;
}
</style>
