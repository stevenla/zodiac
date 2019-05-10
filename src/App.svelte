<script>
  import key from "./data/key";
  import archer from "./data/archer";
  export let name;
</script>

<style>
  td {
    width: 32px;
    height: 32px;
    background-color: #ddd;
    text-align: center;
    vertical-align: center;
  }
  tr:nth-child(2n + 1) td:nth-child(2n + 1),
  tr:nth-child(2n) td:nth-child(2n) {
    background-color: #999;
  }
  td.null {
    border: none;
    background: transparent !important;
  }
</style>

<table cellspacing={0} cellpadding={0}>
  {#each archer as row}
    <tr>
      {#each row as cell}
        {#if cell === null}
          <td class="null" />
        {:else}
          <td title={key && key[cell] ? key[cell].name : null}>{cell}</td>
        {/if}
      {/each}
    </tr>
  {/each}
</table>
