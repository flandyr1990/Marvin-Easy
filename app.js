const container = document.getElementById("destinations");

function isConfigured(d) {
  return d.address && !d.address.startsWith("REPLACE");
}

// Uber officially supports pickup=my_location.
// Destination is passed as a Location JSON object.
function uberUrl(d) {
  const drop = {
    addressLine1: d.name,
    addressLine2: d.address
  };
  return "https://m.uber.com/looking?pickup=my_location&drop[0]=" +
    encodeURIComponent(JSON.stringify(drop));
}

// Lyft ride deep link. Pickup is left to the rider's current location.
function lyftUrl(d) {
  return "https://www.lyft.com/ride?id=lyft" +
    "&pickup[latitude]=null&pickup[longitude]=null" +
    "&destination[address]=" + encodeURIComponent(d.address);
}

function go(provider, d) {
  if (!isConfigured(d)) {
    alert("Andy still needs to add the address for this destination.");
    return;
  }
  location.href = provider === "uber" ? uberUrl(d) : lyftUrl(d);
}

for (const d of window.MARVIN_DESTINATIONS || []) {
  const card = document.createElement("section");
  card.className = "card";

  const h2 = document.createElement("h2");
  h2.textContent = d.name;

  const address = document.createElement("p");
  address.className = "address";
  address.textContent = isConfigured(d) ? d.address : "Address not added yet";

  const actions = document.createElement("div");
  actions.className = "actions";

  const uber = document.createElement("button");
  uber.className = "uber";
  uber.textContent = "Uber to " + (d.shortName || d.name);
  uber.onclick = () => go("uber", d);

  const lyft = document.createElement("button");
  lyft.className = "lyft";
  lyft.textContent = "Lyft to " + (d.shortName || d.name);
  lyft.onclick = () => go("lyft", d);

  actions.append(uber, lyft);
  card.append(h2, address, actions);
  container.append(card);
}
