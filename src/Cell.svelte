<script>
  import key from "./data/key";

  function getDisplayType(type) {
    switch (type.toLowerCase()) {
      case "b": // bow
        return "🏹";
      case "l": // light armor
        return "🥋";
      case "h": // heavy
        return "🧥";
      case "m": // mystic armor
        return "👘";
      case "t": // technick
        return "📜";
      case "hp":
        return "💟";
      case "k": // katana
        return "🥄";
      case "a": // accessory
        return "💍";
      case "ml": // magick lore
        return "🧠";
      case "sum": // summon
        return "🧞";
      case "g": // gambit
        return "🖋";
      case "sw": // swiftness
        return "⏩";
      case "pol": // potion lore
        return "🍷";
      case "phl": // phoenix lore
        return "🦅";
      case "bl": // battle lore
        return "💪";
      case "el": // ether lore
        return "🔋";
      case "rl": // remedy lore
        return "💊";
      case "q": // quickening
        return "☢";
      case "o": // origin
        return "❌";
      case "+": // second board
        return "♊";
      case "w": // white magick
        return "💖";
      case "b": // black magick
        return "🖤";
      case "g": // green magick
        return "💚";
      case "arc": // arcane magick
        return "💜";
      case "tim": // time magick
        return "🕘";
      default:
        return type;
    }
  }

  export let id;
  const info = key[id] || {};
  const name = info.name;
  let type = (id || "").replace(/\d/g, "");
  if (type === "") {
    type = "sum";
  }
  const number = (id || "").replace(/[^\d]/g, "");
</script>

<style>
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    text-align: center;
    font-size: 18px;
    position: relative;
  }
  .number {
    position: absolute;
    right: 2px;
    top: 1px;
    font-size: 10px;
    line-height: 10px;
  }
</style>

<div class="cell" title={name}>
   {getDisplayType(type)}
  <div class="number">{number}</div>
</div>
