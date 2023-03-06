# Chord Progression Converters
While working on a metronome player, I needed a way to compress/decompress a chord progression. Below is a sample snippet.

The goal here is identified the chord and the number of beats that chord is used.
Using `The Crawdad Song` as an example, this song is in the key of G with a 4/4 time signature.
The `G` is the first chord letter and is counted 12 times in a 4/4 measure.

```ts
// Crawdad Song chord progression
const progression = "G(12)D(4)G(4)C(4)G(2)D(2)G(4)";

/** Convert a compress chord progression to a comma delimited string */
function decompressChordProgression(progression: string): string {
    let converted = "";
    progression.split(")")
    .forEach((x) => {
        if (x !== "") {
            let chordLetter =  "";
            let cnt = 0;
            x.split("(").forEach((y) => {
                if (cnt % 2 === 0) {
                    chordLetter = y + ",";
                } else {
                    const numOfBeats = parseInt(y, 10);
                    for (let i = 1; i <= numOfBeats; i += 1) {
                        converted += chordLetter;
                    }
                }
                cnt += 1;
            });
        }
    });
    // Remove last comma
    return converted.substring(0, converted.lastIndexOf(","));
}

function compressChordProgression(progression: string): string {
    let converted = "";
    let chordLetter = "";
    let cnt = 0;
    progression.split(",").forEach((x) => {
        if (chordLetter !== x) {
            if (cnt > 0) converted += `${chordLetter}(${cnt.toString()})`;
            chordLetter = x;
            cnt = 1;
        } else {
            cnt += 1;
        }
    });
    // include the last one since we jump loop early
    converted += `${chordLetter}(${cnt.toString()})`
    return converted;
}

console.log(
    compressChordProgression(
        decompressChordProgression(progression)
    )
);
```
