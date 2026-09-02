// supabase/functions/send-mail/index.ts
//
// Riceve il modulo "Scrivici" di MdvForm.vue e spedisce il messaggio via SMTP
// Aruba (casella dedicata noreply@missionaridellavia.net), verso la casella
// vera della comunita'. Il destinatario e' fisso qui, non deciso dal chiamante:
// lasciarlo scegliere al client era il difetto che faceva arrivare le mail nel
// posto sbagliato (vedi api/SendMail.php, rimosso).
//
// L'indirizzo del visitatore va nel campo "Rispondi a", non nel mittente: un
// sito non puo' spedire "come se fosse" il visitatore (verrebbe rifiutata come
// spoofing), ma un clic su "Rispondi" nella casella della comunita' deve
// comunque arrivare a lui.
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const DESTINATARIO = "missionaridellavia.cassano@gmail.com";
const MITTENTE = "noreply@missionaridellavia.net";

const intestazioniCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function rispondi(corpo, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...intestazioniCors, "Content-Type": "application/json" },
  });
}

function escapeHtml(valore) {
  return String(valore ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailValida(valore) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valore || ""));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: intestazioniCors });
  }
  if (req.method !== "POST") {
    return rispondi({ sent: false, message: "Metodo non consentito" }, 405);
  }

  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return rispondi({ sent: false, message: "Corpo della richiesta non valido" }, 400);
  }

  const nome = String(corpo?.nome || "").trim();
  const cognome = String(corpo?.cognome || "").trim();
  const mail = String(corpo?.mail || "").trim();
  const messaggio = String(corpo?.message || "").trim();

  if (!nome || !messaggio || !emailValida(mail)) {
    return rispondi({ sent: false, message: "Dati mancanti o email non valida" }, 400);
  }

  const password = Deno.env.get("ARUBA_SMTP_PASSWORD");
  if (!password) {
    console.error("ARUBA_SMTP_PASSWORD non configurata tra i secret della funzione");
    return rispondi({ sent: false, message: "Configurazione mancante lato server" }, 500);
  }

  const client = new SMTPClient({
    connection: {
      hostname: "smtps.aruba.it",
      port: 465,
      tls: true,
      auth: { username: MITTENTE, password },
    },
  });

  const nomeCompleto = [nome, cognome].filter(Boolean).join(" ");
  const testoPiano = `${nomeCompleto} (${mail}) ha scritto dal modulo del sito:\n\n${messaggio}`;
  const testoHtml = `
    <html>
      <body style="font-family: sans-serif; color: #333; line-height: 1.5;">
        <p><strong>${escapeHtml(nomeCompleto)}</strong> (${escapeHtml(mail)}) ha scritto dal modulo del sito:</p>
        <p>${escapeHtml(messaggio).replace(/\n/g, "<br>")}</p>
      </body>
    </html>
  `;

  try {
    await client.send({
      from: MITTENTE,
      to: DESTINATARIO,
      replyTo: mail,
      subject: `Messaggio dal sito da ${nomeCompleto}`,
      content: testoPiano,
      html: testoHtml,
    });
  } catch (errore) {
    console.error("Errore invio mail:", errore);
    return rispondi({ sent: false, message: "Errore nell'invio del messaggio" }, 502);
  } finally {
    try {
      await client.close();
    } catch {
      // La connessione potrebbe essere gia' chiusa dopo un errore di invio.
    }
  }

  return rispondi({ sent: true, message: "Il messaggio è stato inviato con successo" });
});
