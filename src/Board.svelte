<script>
  import Cell from "./Cell.svelte";
  import archer from "./data/archer";
  import bushi from "./data/bushi";
  const boards = { archer, bushi };
  export let job;
  const board = boards[job];
</script>

<style>
  td {
    background-color: #eee;
  }
  tr:nth-child(2n + 1) td:nth-child(2n + 1),
  tr:nth-child(2n) td:nth-child(2n) {
    background-color: #ccc;
  }
  td.null {
    border: none;
    background: transparent !important;
  }
</style>

<table cellspacing={0} cellpadding={0}>
  {#each board as row}
    <tr>
      {#each row as cell}
        {#if cell === null}
          <td class="null" />
        {:else}
          <td>
            <Cell id={cell} />
          </td>
        {/if}
      {/each}
    </tr>
  {/each}
</table>
