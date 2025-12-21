import 'dotenv/config';
import tweetnacl from 'tweetnacl';
import app from '../src/index';

// Generate a Key Pair for Testing
const keyPair = tweetnacl.sign.keyPair();
const publicKey = Buffer.from(keyPair.publicKey).toString('hex');
const privateKey = keyPair.secretKey;

// Override the environment variable in the process (Hono reads it from process.env)
process.env.DISCORD_PUBLIC_KEY = publicKey;

async function sendInteraction(data: any) {
  const body = JSON.stringify(data);
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const signature = Buffer.from(
    tweetnacl.sign.detached(
      Buffer.from(timestamp + body),
      privateKey
    )
  ).toString('hex');

  const req = new Request('http://localhost/interactions', {
    method: 'POST',
    body,
    headers: {
      'X-Signature-Ed25519': signature,
      'X-Signature-Timestamp': timestamp,
      'Content-Type': 'application/json'
    }
  });

  const res = await app.fetch(req);
  return res;
}

async function runTests() {
  console.log('--- Testing Ping ---');
  const pingRes = await sendInteraction({ type: 1 });
  console.log('Ping Status:', pingRes.status);
  console.log('Ping Body:', await pingRes.json());

  console.log('\n--- Testing Unauthorized (Role Check) ---');
  process.env.DISCORD_AUTHORIZED_ROLE_ID = 'admin-role';
  const noRoleRes = await sendInteraction({
    type: 2,
    data: { name: 'list_feeds' },
    member: { roles: ['other-role'] }
  });
  console.log('No Role Status:', noRoleRes.status);
  console.log('No Role Body:', await noRoleRes.json());

  console.log('\n--- Testing Authorized List Feeds ---');
  const authorizedRes = await sendInteraction({
    type: 2,
    data: { name: 'list_feeds' },
    member: { roles: ['admin-role'] }
  });
  console.log('Auth List Status:', authorizedRes.status);
  // We expect this to fail or return empty list because DB is not mocked or empty,
  // but it verifies the handler logic.
  // If DB connection fails, it might throw 500.
  // We haven't mocked the DB, so this might try to connect to real DB if env vars set.
  try {
      console.log('Auth List Body:', await authorizedRes.json());
  } catch (e) {
      console.log('Auth List Response (likely DB error):', await authorizedRes.text());
  }
}

runTests().catch(console.error);
