<template>
  <tr v-for="[i, row] in board.entries()" :key="i">
    <td
      v-for="[j, piece] in row.entries()"
      :key="j"
      :style="(i + j + 1) % 2 ? { backgroundColor: 'grey' } : {}"
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
  <div>
    WhiteAi
    <input type="checkbox" v-model="this.whiteAi" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { createBoard, initializeBoard } from "./chess/board";
import { Position } from "./chess/types";
import "vue3-toastify/dist/index.css";
import { change } from "./chess/actions";
import { State } from "./chess/types";
import { Predictor } from "./chess/predictor";
import { toast } from "vue3-toastify";

export default defineComponent({
  data() {
    return {
      board: initializeBoard(createBoard()),
      turn: 0,
      savedPosition: undefined as Position | undefined,
      turns: 0,
      gameover: false,
      whiteAi: false,
      ai: new Predictor(),
    } as State;
  },
  methods: {
    processClick(position: Position) {
      return () => change(position, this);
    },
    async turnWatcher() {
      if (this.turn == 0 && this.whiteAi) {
        let tries = 0;
        while (this.turn == 0 && tries <= 500) {
          const moves = await this.ai.whiteMove(this.board);
          change(moves[0], this, true);
          if (this.turn == 0) continue;
          change(moves[1], this, true);
          tries++;
        }
        if (tries > 500) {
          toast.error("Unable to make turn");
        }
      }
    },
  },
  watch: {
    async turn() {
      this.turnWatcher();
    },
    whiteAi() {
      this.turnWatcher();
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
