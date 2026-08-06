const execa = require("execa");
const fs = require("fs");

// Il ramo gh-pages si costruisce da un ramo orfano: si fa il build, lo si
// committa e lo si spinge sovrascrivendo. Alla fine bisogna tornare da
// dove si era partiti.
//
// Prima quel ritorno era scritto a mano — "git checkout -f develop" — e
// falliva in CI: l'azione di checkout preleva un solo ref e lascia il
// repository con la testa staccata, quindi "develop" li' non esiste.
// Sulla macchina di chi sviluppa funzionava, ma riportava su develop
// anche chi aveva lanciato il deploy da un altro ramo.
//
// Ora il punto di partenza si legge prima di muoversi: il nome del ramo se
// c'e', altrimenti la revisione.
(async () => {
    let partenza = null;
    try {
        const ramo = await execa("git", ["symbolic-ref", "--short", "-q", "HEAD"])
            .catch(() => null);
        partenza = ramo && ramo.stdout.trim()
            ? ramo.stdout.trim()
            : (await execa("git", ["rev-parse", "HEAD"])).stdout.trim();

        await execa("git", ["checkout", "--orphan", "gh-pages"]);
        console.log("Building started...");
        await execa("npm", ["run", "stage"]);

        // Understand if it's dist or build folder
        const folderName = fs.existsSync("dist") ? "dist" : "build";
        await execa("git", ["--work-tree", folderName, "add", "--all"]);
        await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);

        console.log("Pushing to gh-pages...");
        await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
        await execa("rm", ["-r", folderName]);

        console.log("Successfully deployed, check your settings");
    } catch (e) {
        console.log(e.message);
        process.exitCode = 1;
    } finally {
        // La pulizia va fatta anche quando il deploy fallisce a meta':
        // senza, il repository resta su un ramo orfano con dentro il build.
        if (partenza) {
            await execa("git", ["checkout", "-f", partenza]).catch(() => {});
            await execa("git", ["branch", "-D", "gh-pages"]).catch(() => {});
        }
    }
})();
