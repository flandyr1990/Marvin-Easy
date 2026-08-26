const container = document.getElementById("destinations");

function isConfigured(d) {
  return d.address && !d.address.startsWith("REPLACE");
}

function isHome(d) {
  return d.shortName === "Home" || d.name === "Home";
}

function findHome() {
  return (window.MARVIN_DESTINATIONS || []).find(isHome);
}

// Trips to Home start from wherever the rider is now. Trips to anywhere
// else start from Home, since that's where Marvin leaves from.
//
// Uber officially supports pickup=my_location. A fixed pickup (or the
// destination) is passed as a Location JSON object.
function uberUrl(d) {
  const drop = {
    addressLine1: d.name,
    addressLine2: d.address
  };
  const dropParam = "drop[0]=" + encodeURIComponent(JSON.stringify(drop));

  const home = findHome();
  if (isHome(d) || !isConfigured(home)) {
    return "https://m.uber.com/looking?pickup=my_location&" + dropParam;
  }

  const pickup = {
    addressLine1: home.name,
    addressLine2: home.address
  };
  return "https://m.uber.com/looking?pickup=" +
    encodeURIComponent(JSON.stringify(pickup)) + "&" + dropParam;
}

// Lyft ride deep link. Pickup is the rider's current location for trips
// home, or Home's address for every other trip.
function lyftUrl(d) {
  const destParam = "&destination[address]=" + encodeURIComponent(d.address);

  const home = findHome();
  if (isHome(d) || !isConfigured(home)) {
    return "https://www.lyft.com/ride?id=lyft" +
      "&pickup[latitude]=null&pickup[longitude]=null" + destParam;
  }

  return "https://www.lyft.com/ride?id=lyft" +
    "&pickup[address]=" + encodeURIComponent(home.address) + destParam;
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
