const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const WALLET_PATH = path.join(__dirname, 'solana-wallet.json');
const IDL_PATH = path.join(__dirname, '../../../blockchain/target/idl/beeproof.json');

// Default fallback Program ID (32-byte Base58 valid Solana PublicKey)
const DEFAULT_PROGRAM_ID = '8eLXGBggKm9Svwpq1UXUbrZeFTvEEosfwkXYcSP7WxeY';

const PROGRAM_ID_STR = process.env.SOLANA_PROGRAM_ID || DEFAULT_PROGRAM_ID;

let connection = null;
let payerKeypair = null;
let idlData = null;
let programId = null;

function loadPayerKeypair() {
  if (payerKeypair) return payerKeypair;

  if (process.env.SOLANA_PRIVATE_KEY) {
    try {
      const secret = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY));
      payerKeypair = Keypair.fromSecretKey(secret);
      return payerKeypair;
    } catch (e) {
      console.warn('Failed to parse SOLANA_PRIVATE_KEY env var, generating local dev keypair');
    }
  }

  if (fs.existsSync(WALLET_PATH)) {
    try {
      const raw = fs.readFileSync(WALLET_PATH, 'utf8');
      const secret = Uint8Array.from(JSON.parse(raw));
      payerKeypair = Keypair.fromSecretKey(secret);
      return payerKeypair;
    } catch (e) {
      console.warn('Failed to load wallet file, generating fresh keypair');
    }
  }

  payerKeypair = Keypair.generate();
  try {
    fs.writeFileSync(WALLET_PATH, JSON.stringify(Array.from(payerKeypair.secretKey)), 'utf8');
    console.log('🔑 Generated & saved new Solana Devnet Keypair:', payerKeypair.publicKey.toBase58());
  } catch (e) {
    console.warn('Could not save solana-wallet.json:', e.message);
  }

  return payerKeypair;
}

function loadIdl() {
  if (idlData) return idlData;
  if (fs.existsSync(IDL_PATH)) {
    try {
      idlData = JSON.parse(fs.readFileSync(IDL_PATH, 'utf8'));
    } catch (e) {
      console.warn('Failed to parse Anchor IDL from', IDL_PATH);
    }
  }
  return idlData;
}

function getSolanaConnection() {
  if (!connection) {
    connection = new Connection(RPC_URL, 'confirmed');
  }
  return connection;
}

function getBlockchainInstance() {
  const conn = getSolanaConnection();
  const payer = loadPayerKeypair();
  const idl = loadIdl();

  let pId = null;
  try {
    pId = new PublicKey(PROGRAM_ID_STR);
  } catch (e) {
    pId = payer.publicKey; // fallback to payer public key if custom string invalid
  }
  programId = pId;

  return {
    connection: conn,
    payer,
    walletAddress: payer.publicKey.toBase58(),
    programId: pId.toBase58(),
    idl,
    networkName: 'Solana Devnet',
    rpcUrl: RPC_URL,
    deploymentData: {
      contractAddress: pId.toBase58(),
      network: 'Solana Devnet'
    }
  };
}

module.exports = {
  RPC_URL,
  getSolanaConnection,
  loadPayerKeypair,
  getBlockchainInstance
};
