const btnConnect = document.getElementById("btnConnect");
const btnDisconnect = document.getElementById("btnDisconnect");
const statusEl = document.getElementById("status");
const addrEl = document.getElementById("addr");
const netEl = document.getElementById("net");

let provider;
let signer;

function setStatus(text, ok = true) {
  statusEl.textContent = `Estado: ${text}`;
  statusEl.className = ok ? "ok" : "bad";
}

async function refresh() {
  if (!provider) return;
  const network = await provider.getNetwork();
  const address = await signer.getAddress();
  addrEl.textContent = address;
  netEl.textContent = `${network.name} (chainId ${network.chainId})`;

  // BNB Chain mainnet = 56
  if (Number(network.chainId) === 56) {
    setStatus("conectado a BNB Chain ✅", true);
  } else {
    setStatus("conectado, pero NO estás en BNB Chain (56) ⚠️", false);
  }
}

btnConnect.addEventListener("click", async () => {
  try {
    if (!window.ethereum) {
      setStatus("MetaMask no detectado", false);
      return;
    }
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();

    // listeners
    window.ethereum.on("accountsChanged", () => refresh());
    window.ethereum.on("chainChanged", () => window.location.reload());

    await refresh();
  } catch (e) {
    setStatus("error al conectar", false);
    console.error(e);
  }
});

btnDisconnect.addEventListener("click", () => {
  // MetaMask no permite “desconectar” por código; esto es solo UI reset
  provider = null;
  signer = null;
  addrEl.textContent = "-";
  netEl.textContent = "-";
  statusEl.className = "muted";
  statusEl.textContent = "Estado: desconectado";
});
